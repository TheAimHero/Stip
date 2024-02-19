import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { env } from '@/env.js';
import * as auth from './schema/auth';
import * as tasks from './schema/tasks';
import * as todos from './schema/todos';
import * as users from './schema/users';
import * as groups from './schema/groups';
import * as files from './schema/files';

const schema = { ...auth, ...tasks, ...todos, ...users, ...groups, ...files };

const client = neon(env.DATABASE_URL);

declare global {
  // eslint-disable-next-line no-var -- only var works here
  var db: NeonHttpDatabase<typeof schema> | undefined;
}

let db: NeonHttpDatabase<typeof schema>;

if (env.NODE_ENV === 'production') {
  db = drizzle(client, { schema });
} else {
  if (!global.db) global.db = drizzle(client, { schema });
  db = global.db;
}

export { db, client };
