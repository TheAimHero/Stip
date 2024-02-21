import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { db } from '@/server/db';
import { files } from '@/server/db/schema/files';
import { and, eq } from 'drizzle-orm';
import { utapi } from '@/server/uploadthing';
import { TRPCError } from '@trpc/server';

export const fileRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.enum(['markdown', 'pdf']))
    .query(({ ctx, input }) => {
      return db.query.files.findMany({
        where: (f, { eq, and }) =>
          and(eq(f.userId, ctx.session.user.id), eq(f.fileType, input)),
      });
    }),

  getOne: protectedProcedure.input(z.number()).query(async ({ input }) => {
    return db.query.files.findFirst({
      where: (f, { eq }) => eq(f.id, input),
    });
  }),

  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const fileArr = await db
        .delete(files)
        .where(and(eq(files.id, input), eq(files.userId, ctx.session.user.id)))
        .returning({ key: files.key, name: files.name });
      const file = fileArr && fileArr.length > 0 && fileArr[0];
      if (file) {
        await utapi.deleteFiles(file.key);
      } else {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'File not found' });
      }
      return file;
    }),
});
