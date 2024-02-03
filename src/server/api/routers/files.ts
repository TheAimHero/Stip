import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { db } from '@/server/db';

export const fileRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return db.query.files.findMany({
      where: (f, { eq }) => eq(f.userId, ctx.session.user.id),
    });
  }),

  getOne: protectedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    return db.query.files.findFirst({
      where(f, { eq, and }) {
        return and(eq(f.id, input), eq(f.userId, ctx.session.user.id));
      },
    });
  }),
});
