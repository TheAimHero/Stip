import { type Config } from 'drizzle-kit';

import { env } from '@/env.js';

export default {
  schema: './src/server/db/schema/*.ts',
  driver: 'turso',
  out: './drizzle',
  dbCredentials: { url: env.DATABASE_URL, authToken: env.DATABASE_AUTH_TOKEN },
} satisfies Config;
