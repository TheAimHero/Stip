import { z } from 'zod';
import {
  createTRPCRouter,
  modProcedure,
  protectedProcedure,
} from '@/server/api/trpc';
import { db } from '@/server/db';
import { TRPCError } from '@trpc/server';

export const userRouter = createTRPCRouter({
  getById: protectedProcedure.query(({ ctx }) => {
    return db.user.findUnique({ where: { id: ctx.session.user.id } });
  }),

  setAttendance: modProcedure
    .input(
      z.object({
        groupId: z.string(),
        userIds: z.array(z.string()),
        createdAt: z.date(),
        present: z.boolean(),
      }),
    )
    .mutation(async ({ input }) => {
      const { groupId, userIds, createdAt, present } = input;
      await db.attendence.createMany({
        data: userIds.map((userId) => ({
          groupId,
          userId,
          createdAt: new Date(createdAt.setHours(0, 0, 0, 0)),
          present,
        })),
      });
    }),

  getAttendance: protectedProcedure.input(z.date()).query(({ ctx, input }) => {
    const { groupId, id } = ctx.session.user;
    if (!groupId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'User is not in a group',
      });
    }
    return db.attendence.findMany({
      where: {
        groupId: groupId,
        createdAt: new Date(input.setHours(0, 0, 0, 0)),
        userId: id,
      },
    });
  }),

  getByGroup: protectedProcedure
    .input(z.string())
    .query(({ input: groupId }) => {
      return db.user.findMany({ where: { groupId: groupId } });
    }),

  update: protectedProcedure
    .input(z.object({ groupId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { groupId } = input;
      const tasks = await db.task.findMany({ where: { groupId } });
      await db.user.update({ where: { id: userId }, data: { groupId } });
      await db.userTask.createMany({
        data: tasks.map((task) => ({
          completed: false,
          completedAt: new Date(),
          taskId: task.id,
          userId,
        })),
      });
    }),
});
