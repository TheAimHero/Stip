import { sql, relations } from 'drizzle-orm';
import {
  sqliteTable,
  int,
  text,
  integer,
  unique,
} from 'drizzle-orm/sqlite-core';
import { accounts } from './auth';
import { groups } from './groups';

export const users = sqliteTable('user', {
  id: text('id', { length: 255 }).notNull().primaryKey(),
  name: text('name', { mode: 'text', length: 255 }),
  email: text('email', { mode: 'text', length: 255 }).notNull(),
  emailVerified: int('emailVerified', {
    mode: 'timestamp',
  }).default(sql`CURRENT_TIMESTAMP`),
  image: text('image', { mode: 'text', length: 255 }),
  role: text('role', { enum: ['USER', 'MOD', 'ADMIN'] })
    .default('USER')
    .notNull(),
  groupId: integer('groupId').references(() => groups.id),
  rollNo: int('rollNo'),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  accounts: many(accounts),
  group: one(groups, { fields: [users.groupId], references: [groups.id] }),
}));

export const attendance = sqliteTable(
  'attendance',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: text('userId', { length: 255, mode: 'text' })
      .references(() => users.id)
      .notNull(),
    groupId: integer('groupId')
      .notNull()
      .references(() => groups.id),
    present: int('present', { mode: 'boolean' }).notNull().default(false),
    createdAt: int('createdAt', { mode: 'timestamp' })
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
