import { z } from 'zod';
import {
  createTRPCRouter,
  modProcedure,
  protectedProcedure,
} from '@/server/api/trpc';
import { db } from '@/server/db';
import { TRPCError } from '@trpc/server';
import { users, attendance } from '@/server/db/schema/users';
import { eq, sql } from 'drizzle-orm';
import { userTasks } from '@/server/db/schema/tasks';

export const userRouter = createTRPCRouter({
  getById: protectedProcedure.query(({ ctx }) => {
    return db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, ctx.session.user.id),
    });
  }),

  setAttendance: modProcedure
    .input(
      z.object({
        groupId: z.number(),
        userIds: z.record(z.string(), z.boolean()),
        createdAt: z.date(),
      }),
    )
    .mutation(async ({ input }) => {
      const { groupId, userIds, createdAt } = input;
      const attendenceArr: (typeof attendance.$inferInsert)[] = Object.entries(
        userIds,
      ).map(([key, value]) => ({
        userId: key,
        groupId,
        createdAt,
        present: value,
      }));
      await db
        .insert(attendance)
        .values(attendenceArr)
        .onConflictDoUpdate({
          target: [attendance.userId, attendance.groupId, attendance.createdAt],
          set: { present: sql`EXCLUDED.present` },
        });
    }),

  getUserAttendance: protectedProcedure
    .input(z.date().optional())
    .query(async ({ input: createdAt, ctx }) => {
      const { id: userId } = ctx.session.user;
      if (!createdAt) {
        return db.query.attendance.findMany({
          where: (a, { eq }) => eq(a.userId, userId),
        });
      }
      return db.query.attendance.findMany({
        where: (a, { eq, and }) =>
          and(
            eq(a.userId, userId),
            eq(a.createdAt, new Date(createdAt.setHours(0, 0, 0, 0))),
          ),
      });
    }),

  getGroupAttendance: modProcedure
    .input(z.object({ createdAt: z.date(), groupId: z.number() }))
    .query(({ input, ctx }) => {
      const { createdAt } = input;
      const groupId = input.groupId ?? ctx.session?.user.groupId;
      if (!groupId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'User is not in a group',
        });
      }
      return db.query.attendance.findMany({
        where: (a, { eq, and }) =>
          and(
            eq(a.groupId, groupId),
            eq(a.createdAt, new Date(createdAt.setHours(0, 0, 0, 0))),
          ),
      });
    }),

  getByGroup: protectedProcedure
    .input(z.number())
    .query(({ input: groupId }) => {
      return db.select().from(users).where(eq(users.groupId, groupId));
    }),

  update: protectedProcedure
    .input(
      z.object({
        groupId: z.number().optional(),
        rollNo: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { groupId, rollNo } = input;
      await db
        .update(users)
        .set({
          rollNo: rollNo ?? undefined,
          groupId: groupId ?? undefined,
        })
        .where(eq(users.id, userId));
      if (groupId) {
        // @todo: remove tasks from old group when updating groups
        const tasks = await db.query.tasks.findMany({
          where: (t, { eq }) => eq(t.groupId, groupId),
        });
        const userTasksArr: (typeof userTasks.$inferInsert)[] = tasks.map(
          (task) => ({
            userId,
            completedAt: null,
            cancelledAt: null,
            taskId: task.id,
          }),
        );
        await db.insert(userTasks).values(userTasksArr).onConflictDoNothing();
      }
    }),
});
