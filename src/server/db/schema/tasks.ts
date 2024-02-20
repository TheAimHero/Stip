import {
  pgTable,
  integer,
  primaryKey,
  text,
  timestamp,
  varchar,
  boolean,
  pgEnum,
  serial,
} from 'drizzle-orm/pg-core';
import { groups } from './groups';
import { users } from './users';
import { relations, sql } from 'drizzle-orm';
import { files } from './files';

export const taskState = pgEnum('taskState', ['OPEN', 'DELETED', 'DONE']);

export const tasks = pgTable('task', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  dueDate: timestamp('dueDate').notNull(),
  groupId: integer('groupId')
    .notNull()
    .references(() => groups.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  createdAt: timestamp('createdAt')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  assignedById: varchar('assignedById', { length: 255 })
    .notNull()
    .references(() => users.id),
  fileId: integer('fileId').references(() => files.id, { onDelete: 'cascade' }),
  state: taskState('state').notNull().default('OPEN'),
});

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  group: one(groups, { fields: [tasks.groupId], references: [groups.id] }),
  assignedBy: one(users, {
    fields: [tasks.assignedById],
    references: [users.id],
  }),
  userTask: many(userTasks),
  file: one(files, { fields: [tasks.fileId], references: [files.id] }),
}));

export const userTasks = pgTable(
  'userTask',
  {
    userId: varchar('userId', { length: 255 })
      .references(() => users.id)
      .notNull(),
    taskId: integer('taskId')
      .references(() => tasks.id)
      .notNull(),
    groupId: integer('groupId')
      .notNull()
      .references(() => groups.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    completed: boolean('completed').notNull().default(false),
    completedAt: timestamp('completedAt'),
    cancelled: boolean('cancelled').notNull().default(false),
    cancelledAt: integer('cancelledAt'),
  },
  (ut) => ({ pk: primaryKey({ columns: [ut.userId, ut.taskId] }) }),
);

export const userTasksRelations = relations(userTasks, ({ one }) => ({
  user: one(users, { fields: [userTasks.userId], references: [users.id] }),
  task: one(tasks, { fields: [userTasks.taskId], references: [tasks.id] }),
  group: one(groups, { fields: [userTasks.groupId], references: [groups.id] }),
}));
