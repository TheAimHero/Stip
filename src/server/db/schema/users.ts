import { sql, relations } from 'drizzle-orm';
import {
  pgTable,
  integer,
  text,
  unique,
  timestamp,
  varchar,
  boolean,
  serial,
} from 'drizzle-orm/pg-core';
import { accounts } from './auth';
import { groupMembers, groups } from './groups';

export const users = pgTable('user', {
  id: varchar('id', { length: 255 }).notNull().primaryKey(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull(),
  emailVerified: timestamp('emailVerified').default(sql`CURRENT_TIMESTAMP`),
  image: text('image'),
  rollNo: integer('rollNo'),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  groups: many(groupMembers),
}));

export const attendance = pgTable(
  'attendance',
  {
    id: serial('id').primaryKey(),
    userId: varchar('userId', { length: 255 })
      .references(() => users.id)
      .notNull(),
    groupId: integer('groupId')
      .notNull()
      .references(() => groups.id),
    present: boolean('present').notNull().default(false),
    createdAt: timestamp('createdAt')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (a) => ({
    unq: unique().on(a.userId, a.groupId, a.createdAt),
  }),
);

export const attendanceRelations = relations(attendance, ({ one }) => ({
  user: one(users, { fields: [attendance.userId], references: [users.id] }),
  group: one(groups, { fields: [attendance.groupId], references: [groups.id] }),
}));
