import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        (str) => !str.includes('Your Mysql Url Here'),
        'You forgot to change the default URL',
      ),
    PAGE_URL: z
      .string()
      .refine(
        (str) => !str.includes('Your Mysql Url Here'),
        'You forgot to change the default URL',
      ),
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === 'production'
        ? z.string()
        : z.string().optional(),
    NEXTAUTH_URL: z.preprocess(
      (str) => process.env.VERCEL_URL ?? str,
      process.env.VERCEL ? z.string() : z.string().url(),
    ),
    GOOGLE_CLIENT_ID: z
      .string()
      .refine(
        (str) => !str.includes('Your Google Client ID Here'),
        'You forgot to change the default',
      ),
    GOOGLE_CLIENT_SECRET: z
      .string()
      .refine(
        (str) => !str.includes('Your Google Client Secret Here'),
        'You forgot to change the default URL',
      ),
    UPLOADTHING_SECRET: z
      .string()
      .refine(
        (str) => !str.includes('Your Upload Thing Secret Here'),
        'You forgot to change the default',
      ),
    UPLOADTHING_APP_ID: z
      .string()
      .refine(
        (str) => !str.includes('Your Upload Thing App Id Here'),
        'You forgot to change the default',
      ),
  },

  client: {},

  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    PAGE_URL: process.env.PAGE_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
    UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
