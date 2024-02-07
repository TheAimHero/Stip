import { z } from 'zod';
import {
  createTRPCRouter,
  modProcedure,
  protectedProcedure,
} from '@/server/api/trpc';
import { db } from '@/server/db';
import { TRPCError } from '@trpc/server';
import { tasks, userTasks } from '@/server/db/schema/tasks';
import { and, eq } from 'drizzle-orm';

export const taskRouter = createTRPCRouter({
  getAllUserTask: protectedProcedure.query(async ({ ctx }) => {
    const userTaskList = await db.query.userTasks.findMany({
      where: (t, { eq }) => eq(t.userId, ctx.session.user.id),
      with: { task: { with: { assignedBy: true } } },
    });
    return userTaskList;
  }),

  getAllModTask: modProcedure.query(async ({ ctx }) => {
    const modId = ctx.session?.user.id;
    if (!modId) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'User not found' });
    }
    const modTaskList = await db.query.tasks.findMany({
      where: (t, { eq, and }) => {
        return and(eq(t.assignedById, modId), eq(t.state, 'OPEN'));
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

  addTask: modProcedure
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
      const users = await db.query.users.findMany({
        where: (t, { eq }) => eq(t.groupId, groupId),
      });
      const userTasksArr: (typeof userTasks.$inferInsert)[] = users.map(
        (user) => ({
          userId: user.id,
          completedAt: null,
          cancelledAt: null,
          taskId: newTask.id,
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

  deleteMod: modProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    const assignedById = ctx.session?.user.id;
    if (!assignedById) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'User not found' });
    }
    const task = await db
      .update(tasks)
      .set({ state: 'DELETED' })
      .where(and(eq(tasks.assignedById, assignedById), eq(tasks.id, input)))
      .returning();
    if (!task[0]) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Task not found' });
    }
    await db
      .update(userTasks)
      .set({ cancelled: true })
      .where(eq(userTasks.taskId, task[0].id));
  }),
});
