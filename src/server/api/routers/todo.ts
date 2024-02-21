import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { db } from '@/server/db';
import { todos } from '@/server/db/schema/todos';
import { and, eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

export const todoRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const todos = await db.query.todos.findMany({
      where: (t, { eq }) => eq(t.createdById, ctx.session.user.id),
    });
    if (!todos) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    return todos;
  }),

  getOne: protectedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const todo = await db.query.todos.findFirst({
      where: (t, { eq, and }) =>
        and(eq(t.id, input), eq(t.createdById, ctx.session.user.id)),
    });
    if (!todo) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    return todo;
  }),

  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      await db
        .delete(todos)
        .where(
          and(eq(todos.id, input), eq(todos.createdById, ctx.session.user.id)),
        );
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        completed: z.boolean().optional(),
        note: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db
        .update(todos)
        .set({ completed: input.completed, notes: input.note ?? '' })
        .where(
          and(
            eq(todos.id, input.id),
            eq(todos.createdById, ctx.session.user.id),
          ),
        );
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
      await db.insert(todos).values({
        title: input.title,
        description: input.description,
        dueDate: input.dueDate,
        completed: input.completed,
        createdAt: input.createdAt,
        createdById: ctx.session.user.id,
      });
    }),
});
