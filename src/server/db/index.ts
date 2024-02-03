import { drizzle, type LibSQLDatabase } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { env } from '@/env.js';
import * as auth from './schema/auth';
import * as tasks from './schema/tasks';
import * as todos from './schema/todos';
import * as users from './schema/users';
import * as groups from './schema/groups';
import * as files from './schema/files';

const schema = { ...auth, ...tasks, ...todos, ...users, ...groups, ...files };

const client = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_AUTH_TOKEN,
});

declare global {
  // eslint-disable-next-line no-var -- only var works here
  var db: LibSQLDatabase<typeof schema> | undefined;
}

let db: LibSQLDatabase<typeof schema>;

if (env.NODE_ENV === 'production') {
  db = drizzle(client, { schema });
} else {
  if (!global.db) global.db = drizzle(client, { schema });
  db = global.db;
}

export { db };
