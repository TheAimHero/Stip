import {
  pgTable,
  varchar,
  timestamp,
  pgEnum,
  serial,
} from 'drizzle-orm/pg-core';
import { users } from './users';
import { relations, sql } from 'drizzle-orm';

export const fileType = pgEnum('fileType', ['pdf', 'markdown']);

export const files = pgTable('file', {
  id: serial('id').notNull().primaryKey(),
  key: varchar('key', { length: 255 }).notNull(),
  link: varchar('link', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  fileType: fileType('fileType').notNull().default('pdf'),
  createdAt: timestamp('createdAt')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
  userId: varchar('userId', { length: 255 })
    .notNull()
    .references(() => users.id),
});

export const filesRelations = relations(files, ({ one }) => ({
  user: one(users, { fields: [files.userId], references: [users.id] }),
}));
