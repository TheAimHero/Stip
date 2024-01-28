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

export const authOptions: NextAuthOptions = {
  // @fix: make the session callback object smaller
  callbacks: { session: ({ session, user }) => ({ ...session, user }) },
  adapter: DrizzleAdapter(db) as Adapter,
  pages: { signIn: '/login' },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
