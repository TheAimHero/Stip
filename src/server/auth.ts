import { DrizzleAdapter } from '@auth/drizzle-adapter';
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { db } from '@/server/db';
import { env } from '@/env';
import { type Adapter } from 'next-auth/adapters';
import { users } from './db/schema/users';
import { accounts, sessions, verificationTokens } from './db/schema/auth';
import { type SQLiteTableFn, sqliteTable } from 'drizzle-orm/sqlite-core';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: 'USER' | 'MOD' | 'ADMIN';
      groupId: number | undefined;
    } & DefaultSession['user'];
  }

  interface User {
    role: 'USER' | 'MOD' | 'ADMIN';
  }
}

type TableFnParams = Parameters<SQLiteTableFn>;
function dumbAdapter(
  name: TableFnParams[0],
  columns: TableFnParams[1],
  extraConfig: TableFnParams[2],
) {
  switch (name) {
    case 'user':
      return users;
    case 'account':
      return accounts;
    case 'session':
      return sessions;
    case 'verification_token':
      return verificationTokens;
    default:
      return sqliteTable(name, columns, extraConfig);
  }
}

export const authOptions: NextAuthOptions = {
  // @fix: make the session callback object smaller
  callbacks: {
    session: ({ session, user }) => ({ ...session, user }),
  },
  adapter: DrizzleAdapter(
    db,
    dumbAdapter as SQLiteTableFn<undefined>,
  ) as Adapter,
  pages: { signIn: '/login' },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
