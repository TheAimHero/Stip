import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const groups = sqliteTable('group', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name', { mode: 'text' }).notNull().unique(),
  description: text('description', { mode: 'text', length: 255 })
    .notNull()
    .default(''),
});
