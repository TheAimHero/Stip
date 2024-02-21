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
      groupId: number | undefined;
    } & DefaultSession['user'];
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({ ...session, user }),
  },
  adapter: DrizzleAdapter(db) as Adapter,
  pages: { signIn: '/login' },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      httpOptions: { timeout: 10000 },
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
