import {
  integer,
  sqliteTable,
  text,
  int,
  primaryKey,
} from 'drizzle-orm/sqlite-core';
import { users } from './users';
import { relations, sql } from 'drizzle-orm';

export const groups = sqliteTable('group', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name', { mode: 'text' }).notNull().unique(),
  description: text('description', { mode: 'text', length: 255 })
    .notNull()
    .default(''),
  inviteCode: text('inviteCode', { mode: 'text', length: 255 }),
  inviteCodeExpiry: int('inviteCodeExpiry', { mode: 'timestamp' }),
  createdAt: int('createdAt', { mode: 'timestamp' }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
});

export const groupsRelations = relations(groups, ({ many }) => ({
  members: many(groupMembers),
}));

export const groupMembers = sqliteTable(
  'group_member',
  {
    groupId: integer('groupId')
      .notNull()
      .references(() => groups.id),
    userId: text('userId', { length: 255 })
      .notNull()
      .references(() => users.id),
    role: text('role', { enum: ['USER', 'MOD', 'ADMIN'] }).notNull(),
    joinedAt: int('joinedAt', { mode: 'timestamp' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    leftAt: int('leftAt', { mode: 'timestamp' }),
    joined: int('joined', { mode: 'boolean' }).notNull().default(false),
  },
  (gm) => ({ pk: primaryKey({ columns: [gm.groupId, gm.userId] }) }),
);

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  user: one(users, { fields: [groupMembers.userId], references: [users.id] }),
  group: one(groups, {
    fields: [groupMembers.groupId],
    references: [groups.id],
  }),
}));
