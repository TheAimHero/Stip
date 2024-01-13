import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { db } from '@/server/db';

export const todoRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return db.todo.findMany({ where: { userId: ctx.session.user.id } });
  }),

  getOne: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return db.todo.findFirst({
      where: { userId: ctx.session.user.id, id: input },
      include: { user: false },
    });
  }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await db.todo.delete({
        where: { userId: ctx.session.user.id, id: input },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        completed: z.boolean().optional(),
        note: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db.todo.update({
        where: { userId: ctx.session.user.id, id: input.id },
        data: { completed: input.completed, note: input.note },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1).max(100),
        dueDate: z.date(),
        completed: z.boolean(),
        createdAt: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db.todo.create({
        data: {
          title: input.title,
          description: input.description,
          dueDate: input.dueDate,
          completed: input.completed,
          createdAt: input.createdAt,
          userId: ctx.session.user.id,
          note: '',
        },
      });
    }),
});
