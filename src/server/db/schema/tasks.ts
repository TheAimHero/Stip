import {
  sqliteTable,
  integer,
  primaryKey,
  text,
  int,
} from 'drizzle-orm/sqlite-core';
import { groups } from './groups';
import { users } from './users';
import { relations, sql } from 'drizzle-orm';

export const tasks = sqliteTable('task', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  title: text('title', { mode: 'text' }).notNull(),
  description: text('description', { mode: 'text' }).notNull(),
  dueDate: integer('dueDate', { mode: 'timestamp' }).notNull(),
  groupId: integer('groupId')
    .notNull()
    .references(() => groups.id),
  createdAt: integer('createdAt', { mode: 'timestamp' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  assignedById: text('assignedById', { length: 255, mode: 'text' })
    .notNull()
    .references(() => users.id),
  state: text('state', { enum: ['OPEN', 'DELETED', 'DONE'] })
    .notNull()
    .default('OPEN'),
});

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  group: one(groups, { fields: [tasks.groupId], references: [groups.id] }),
  assignedBy: one(users, {
    fields: [tasks.assignedById],
    references: [users.id],
  }),
  userTask: many(userTasks),
}));

export const userTasks = sqliteTable(
  'userTask',
  {
    userId: text('userId', { mode: 'text', length: 255 })
      .references(() => users.id)
      .notNull(),
    taskId: integer('taskId', { mode: 'number' })
      .references(() => tasks.id)
      .notNull(),
    completed: int('completed', { mode: 'boolean' }).notNull().default(false),
    completedAt: integer('completedAt', { mode: 'timestamp' }),
    cancelled: int('cancelled', { mode: 'boolean' }).notNull().default(false),
    cancelledAt: int('cancelledAt', { mode: 'number' }),
  },
  (ut) => ({ pk: primaryKey({ columns: [ut.userId, ut.taskId] }) }),
);

export const userTasksRelations = relations(userTasks, ({ one }) => ({
  user: one(users, { fields: [userTasks.userId], references: [users.id] }),
  task: one(tasks, { fields: [userTasks.taskId], references: [tasks.id] }),
}));
