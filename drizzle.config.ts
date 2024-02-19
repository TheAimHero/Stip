import { type Config } from 'drizzle-kit';

import { env } from '@/env.js';

export default {
  schema: './src/server/db/schema/*.ts',
  driver: 'pg',
  out: './drizzle',
  dbCredentials: { connectionString: env.DATABASE_URL },
  verbose: true,
  strict: true,
} satisfies Config;
