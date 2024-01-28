import { relations, sql } from 'drizzle-orm';
import { int, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from './users';

export const todos = sqliteTable('todo', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  title: text('title', { length: 256, mode: 'text' }).notNull(),
  description: text('description', { mode: 'text' }).notNull().default(''),
  completed: int('completed', { mode: 'boolean' }).notNull().default(false),
  notes: text('notes', { mode: 'text' }).notNull().default(''),
  dueDate: int('due_date', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  createdById: text('createdById', { mode: 'text', length: 255 })
    .notNull()
    .references(() => users.id),
  createdAt: int('created_at', { mode: 'timestamp' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const todosRelations = relations(todos, ({ one }) => ({
  createdBy: one(users, {
    fields: [todos.createdById],
    references: [users.id],
  }),
}));
