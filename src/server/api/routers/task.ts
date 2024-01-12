/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { z } from 'zod';
import {
  createTRPCRouter,
  modProcedure,
  protectedProcedure,
} from '@/server/api/trpc';
import { db } from '@/server/db';

export const taskRouter = createTRPCRouter({
  getAllUserTask: protectedProcedure.query(async ({ ctx }) => {
    const userTaskList = await db.userTask.findMany({
      where: { userId: ctx.session.user.id },
      include: { Task: true, User: true },
    });
    return userTaskList;
  }),

  getAllModTask: modProcedure.query(async ({ ctx }) => {
    const modId = ctx.session?.user.id!;
    const modTaskList = await db.task.findMany({
      where: { assignedById: modId, state: 'OPEN' },
      include: { Group: true },
    });
    return modTaskList;
  }),

  updateUserTask: protectedProcedure
    .input(z.object({ id: z.string(), completed: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;
      const { id, completed } = input;
      await db.userTask.update({
        where: { userId_taskId: { userId: user.id, taskId: id } },
        data: { completed },
      });
    }),

  addTask: modProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        groupId: z.string(),
        dueDate: z.date(),
        createdAt: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { dueDate, description, title, createdAt, groupId } = input;
      const assignedById = ctx.session?.user.id!;
      const newTask = await db.task.create({
        data: {
          description,
          createdAt,
          dueDate,
          title,
          assignedById,
          groupId,
        },
      });
      const users = await db.user.findMany({ where: { groupId: groupId } });
      await db.userTask.createMany({
        data: users.map((user) => ({
          completed: false,
          completedAt: null,
          taskId: newTask.id,
          userId: user.id,
        })),
      });
    }),

  delete: modProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const assignedById = ctx.session?.user.id!;
    const task = await db.task.update({
      where: { assignedById, id: input },
      data: { state: 'DELETED' },
    });
    await db.userTask.updateMany({
      where: { taskId: task.id },
      data: {
        completed: true,
        completedAt: new Date(),
        cancelled: true,
        cancelledAt: new Date(),
      },
    });
  }),
});
