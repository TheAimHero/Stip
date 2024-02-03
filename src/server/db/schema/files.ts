import { sqliteTable, integer, text, int } from 'drizzle-orm/sqlite-core';
import { users } from './users';
import { relations, sql } from 'drizzle-orm';

export const files = sqliteTable('file', {
  id: integer('id', { mode: 'number' })
    .notNull()
    .primaryKey({ autoIncrement: true }),
  link: text('link', { mode: 'text', length: 255 }).notNull(),
  name: text('name', { mode: 'text', length: 255 }).notNull(),
  createdAt: int('createdAt', { mode: 'timestamp' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: int('updatedAt', { mode: 'timestamp' }).notNull(),
  userId: text('userId', { length: 255 })
    .notNull()
    .references(() => users.id),
});

export const filesRelations = relations(files, ({ one }) => ({
  user: one(users, { fields: [files.userId], references: [users.id] }),
}));
