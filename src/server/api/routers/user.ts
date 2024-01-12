import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { db } from '@/server/db';

export const userRouter = createTRPCRouter({
  getById: protectedProcedure.query(({ ctx }) => {
    return db.user.findUnique({ where: { id: ctx.session.user.id } });
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
