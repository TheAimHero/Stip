import {
  pgTable,
  text,
  integer,
  primaryKey,
  varchar,
  timestamp,
  boolean,
  pgEnum,
  serial,
} from 'drizzle-orm/pg-core';
import { users } from './users';
import { relations, sql } from 'drizzle-orm';

export const groups = pgTable('group', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: varchar('description', { length: 255 }).notNull().default(''),
  inviteCode: varchar('inviteCode', { length: 255 }),
  inviteCodeExpiry: timestamp('inviteCodeExpiry'),
  createdAt: timestamp('createdAt').default(sql`CURRENT_TIMESTAMP`),
});

export const groupsRelations = relations(groups, ({ many }) => ({
  members: many(groupMembers),
}));

export const groupRole = pgEnum('groupRole', ['USER', 'MOD', 'ADMIN']);

export const groupMembers = pgTable(
  'group_member',
  {
    groupId: integer('groupId')
      .notNull()
      .references(() => groups.id),
    userId: varchar('userId', { length: 255 })
      .notNull()
      .references(() => users.id),
    role: groupRole('role').notNull().default('USER'),
    joinedAt: timestamp('joinedAt')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    leftAt: timestamp('leftAt'),
    joined: boolean('joined').notNull().default(false),
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
