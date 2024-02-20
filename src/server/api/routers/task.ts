import { z } from 'zod';
import { utapi } from '@/server/uploadthing';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { db } from '@/server/db';
import { TRPCError } from '@trpc/server';
import { tasks, userTasks } from '@/server/db/schema/tasks';
import { and, eq } from 'drizzle-orm';
import { files } from '@/server/db/schema/files';
import { getGrpMember, getGrpModMember } from '@/lib/db/preparedStatement';
import { groupMembers } from '@/server/db/schema/groups';

export const taskRouter = createTRPCRouter({
  getAllUserTask: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const grpMember = await getGrpMember.execute({
        groupId: input,
        userId: ctx.session.user.id,
      });
      if (!grpMember)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'User not a member of group',
        });
      const userTaskList = await db.query.userTasks.findMany({
        where: (t, { eq, and }) =>
          and(eq(t.userId, ctx.session.user.id), eq(t.groupId, input)),
        with: { task: { with: { assignedBy: true } } },
      });
      return userTaskList;
    }),

  getAllModTask: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const modId = ctx.session?.user.id;
      const groupMember = await getGrpModMember.execute({
        groupId: input,
        userId: modId,
      });
      if (!groupMember) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not found or not authorized',
        });
      }
      const modTaskList = await db.query.tasks.findMany({
        where: (t, { eq, and }) => {
          return and(
            and(eq(t.assignedById, modId), eq(t.state, 'OPEN')),
            eq(t.groupId, input),
          );
        },
        with: { group: true },
      });
      return modTaskList;
    }),

  updateUserTask: protectedProcedure
    .input(z.object({ id: z.number(), completed: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;
      const { id, completed } = input;
      await db
        .update(userTasks)
        .set({ completed })
        .where(and(eq(userTasks.userId, user.id), eq(userTasks.taskId, id)));
    }),

  addTask: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        groupId: z.number(),
        dueDate: z.date(),
        createdAt: z.date(),
        fileId: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { dueDate, description, title, createdAt, groupId, fileId } = input;
      const assignedById = ctx.session?.user.id;
      if (!assignedById) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'User not found' });
      }
      const grpMember = await getGrpMember.execute({
        groupId,
        userId: assignedById,
      });
      if (!grpMember) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'User not a member of group',
        });
      }
      if (grpMember.role !== 'MOD') {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not authorized',
        });
      }
      const newTaskArr = await db
        .insert(tasks)
        .values({
          title,
          description,
          dueDate,
          createdAt,
          assignedById,
          groupId,
          fileId,
        })
        .returning();
      const newTask = newTaskArr[0];
      if (!newTask) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Task not created',
        });
      }
      const grpMemberArr = await db.query.groupMembers.findMany({
        where: (gm, { eq }) => eq(gm.groupId, groupId),
        with: { user: true },
      });
      const users = grpMemberArr.map((member) => member.user);
      const userTasksArr: (typeof userTasks.$inferInsert)[] = users.map(
        (user) => ({
          userId: user.id,
          completedAt: null,
          cancelledAt: null,
          taskId: newTask.id,
          groupId: groupId,
        }),
      );
      if (userTasksArr.length > 0) {
        await db.insert(userTasks).values(userTasksArr);
      }
    }),

  deleteTask: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return await db
        .delete(userTasks)
        .where(
          and(
            eq(userTasks.taskId, input),
            eq(userTasks.userId, ctx.session.user.id),
          ),
        );
    }),

  deleteMod: protectedProcedure
    .input(z.object({ taskId: z.number(), groupId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const assignedById = ctx.session?.user.id;
      const { taskId, groupId } = input;
      if (!assignedById) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'User not found' });
      }
      const grpModMember = await getGrpModMember.execute({
        groupId,
        userId: assignedById,
      });
      if (!grpModMember) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not found or not authorized',
        });
      }
      const taskArr = await db
        .update(tasks)
        .set({ state: 'DELETED' })
        .where(and(eq(tasks.assignedById, assignedById), eq(tasks.id, taskId)))
        .returning();
      const task = taskArr[0];
      if (!task) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Task not found' });
      }
      await db
        .update(userTasks)
        .set({ cancelled: true })
        .where(eq(userTasks.taskId, task.id));
      if (task.fileId) {
        const deletedFileArr = await db
          .delete(files)
          .where(eq(files.id, task.fileId))
          .returning({ fileKey: files.key });
        const deletedFile =
          deletedFileArr && deletedFileArr.length > 0 && deletedFileArr[0];
        if (deletedFile) await utapi.deleteFiles(deletedFile.fileKey);
      }
    }),
});
