import { getGrpModMember } from '@/lib/db/preparedStatement';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { db } from '@/server/db';
import { groupMembers, groups } from '@/server/db/schema/groups';
import { userTasks } from '@/server/db/schema/tasks';
import { TRPCError } from '@trpc/server';
import { randomUUID } from 'crypto';
import { eq, inArray, not, and, or } from 'drizzle-orm';
import { z } from 'zod';

export const groupRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const data = db.query.groupMembers.findMany({
      where(gm, { eq, and }) {
        return and(eq(gm.userId, ctx.session.user.id), eq(gm.joined, true));
      },
      with: {
        group: { columns: { inviteCode: false, inviteCodeExpiry: false } },
      },
    });
    return data;
  }),

  getMod: protectedProcedure.query(async ({ ctx }) => {
    return db.query.groupMembers.findMany({
      where: (gm, { eq, and }) =>
        and(
          eq(gm.userId, ctx.session.user.id),
          or(eq(gm.role, 'MOD'), eq(gm.role, 'ADMIN')),
        ),
      with: {
        group: { columns: { inviteCode: false, inviteCodeExpiry: false } },
      },
    });
  }),

  createGroup: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const group = await db
        .insert(groups)
        .values({
          name: input.name,
          description: input.description,
          createdAt: new Date(),
        })
        .returning();
      if (!group?.[0]) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Group not created',
        });
      }
      await db.insert(groupMembers).values({
        userId: ctx.session.user.id,
        groupId: group[0].id,
        role: 'ADMIN',
        joined: true,
      });
      return group[0];
    }),

  deleteGroup: protectedProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      const grpModMember = await getGrpModMember.execute({
        groupId: input,
        userId: ctx.session.user.id,
      });
      if (!grpModMember || grpModMember.role !== 'ADMIN') {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not found or not authorized',
        });
      }
      const groupArr = await db
        .delete(groups)
        .where(eq(groups.id, input))
        .returning();
      const group = groupArr[0];
      if (!group) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Group not deleted',
        });
      }
      return group;
    }),

  demoteMember: protectedProcedure
    .input(
      z.object({
        groupId: z.number(),
        userIds: z.string().array().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { groupId, userIds } = input;
      const isAdmin = await db.query.groupMembers.findFirst({
        where(gm, { and, eq }) {
          return and(
            eq(gm.userId, ctx.session.user.id),
            eq(gm.groupId, groupId),
            eq(gm.role, 'ADMIN'),
          );
        },
      });
      if (!isAdmin) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not authorized',
        });
      }
      const demotedGrpMembers = await db
        .update(groupMembers)
        .set({ role: 'USER' })
        .where(
          and(
            inArray(groupMembers.userId, userIds),
            not(eq(groupMembers.role, 'ADMIN')),
          ),
        )
        .returning({ userId: groupMembers.userId });
      return demotedGrpMembers;
    }),

  removeMember: protectedProcedure
    .input(
      z.object({
        groupId: z.number(),
        userIds: z.string().array().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { userIds, groupId } = input;
      const isMod = await getGrpModMember.execute({
        groupId,
        userId: ctx.session.user.id,
      });
      if (!isMod) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not authorized',
        });
      }
      const deleteGrpMembers = await db
        .delete(groupMembers)
        .where(
          and(
            inArray(groupMembers.userId, userIds),
            not(eq(groupMembers.role, 'ADMIN')),
          ),
        )
        .returning({ userId: groupMembers.userId });
      return deleteGrpMembers;
    }),

  promoteMember: protectedProcedure
    .input(
      z.object({
        groupId: z.number(),
        userIds: z.string().array().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { userIds, groupId } = input;
      const isMod = await getGrpModMember.execute({
        groupId,
        userId: ctx.session.user.id,
      });
      if (!isMod) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not authorized',
        });
      }
      const modGrpMember = await db
        .update(groupMembers)
        .set({ role: 'MOD' })
        .where(
          and(
            inArray(groupMembers.userId, userIds),
            not(eq(groupMembers.role, 'ADMIN')),
          ),
        );
      return modGrpMember;
    }),

  joinGroup: protectedProcedure
    .input(z.object({ inviteCode: z.string(), groupId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const group = await db.query.groups.findFirst({
        where: (g, { eq }) => eq(g.id, input.groupId),
        with: {
          members: { where: (m, { eq }) => eq(m.userId, ctx.session.user.id) },
        },
      });
      if (!group) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Group not joined',
        });
      }
      if (group.members.length > 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Already joined',
          cause: { ...group, members: undefined },
        });
      }
      if (group.inviteCode !== input.inviteCode) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid invite code',
        });
      }
      if (!group.inviteCodeExpiry || group.inviteCodeExpiry < new Date()) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invite code expired',
        });
      }
      const memberArr = await db
        .insert(groupMembers)
        .values({
          userId: ctx.session.user.id,
          groupId: input.groupId,
          role: 'USER',
          joined: true,
        })
        .returning();
      const prevTasks = await db.query.tasks.findMany({
        where: (t, { eq }) => eq(t.groupId, input.groupId),
      });
      if (prevTasks.length > 0) {
        await db.insert(userTasks).values(
          prevTasks.map((task) => ({
            userId: ctx.session.user.id,
            groupId: input.groupId,
            taskId: task.id,
            completedAt: null,
            cancelledAt: null,
          })),
        );
      }
      const member = memberArr[0];
      return { member, group: { ...group, members: undefined } };
    }),

  getGroupInvite: protectedProcedure
    .input(
      z.object({
        groupId: z.number(),
        refresh: z.boolean().optional().default(false),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { groupId, refresh } = input;
      const user = await db.query.groupMembers.findFirst({
        where: (gm, { eq, and }) =>
          and(eq(gm.userId, ctx.session.user.id), eq(gm.groupId, groupId)),
      });
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not found',
        });
      }
      if (user.role === 'USER') {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not authorized',
        });
      }
      const group = await db.query.groups.findFirst({
        where: (g, { eq }) => eq(g.id, groupId),
      });
      if (!group) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Group not found',
        });
      }
      const { inviteCode, inviteCodeExpiry } = group;
      if (
        !inviteCode ||
        !inviteCodeExpiry ||
        inviteCodeExpiry < new Date() ||
        refresh
      ) {
        const groupArr = await db
          .update(groups)
          .set({
            inviteCode: randomUUID(),
            inviteCodeExpiry: new Date(new Date().getTime() + 1000 * 60 * 15),
          })
          .where(eq(groups.id, input.groupId))
          .returning();
        return groupArr[0];
      }
      return group;
    }),

  getGroup: protectedProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      const isMember = await db.query.groupMembers.findFirst({
        where: (gm, { eq, and }) =>
          and(
            eq(gm.groupId, input),
            eq(gm.joined, true),
            eq(gm.userId, ctx.session.user.id),
          ),
      });
      if (!isMember) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not found or not authorized',
        });
      }
      const group = await db.query.groups.findFirst({
        where: (g, { eq }) => eq(g.id, input),
        columns: {
          id: true,
          name: true,
          inviteCode: false,
          createdAt: true,
          description: true,
          inviteCodeExpiry: false,
        },
      });
      if (!group) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Group not found',
        });
      }
      return group;
    }),

  getGroupMembers: protectedProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      const isMod = await getGrpModMember.execute({
        groupId: input,
        userId: ctx.session.user.id,
      });
      if (!isMod) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not found or not authorized',
        });
      }
      const members = await db.query.groupMembers.findMany({
        where: (gm, { eq }) => eq(gm.groupId, input),
        with: { user: true },
      });
      return members;
    }),
});
