import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { users } from './users';

export const todos = pgTable('todo', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 256 }).notNull(),
  description: text('description').notNull().default(''),
  completed: boolean('completed').notNull().default(false),
  notes: text('notes').notNull().default(''),
  dueDate: timestamp('due_date')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  createdById: varchar('createdById', { length: 255 })
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const todosRelations = relations(todos, ({ one }) => ({
  createdBy: one(users, {
    fields: [todos.createdById],
    references: [users.id],
  }),
}));
