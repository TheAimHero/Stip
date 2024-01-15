import { PrismaAdapter } from '@next-auth/prisma-adapter';
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { db } from '@/server/db';
import { env } from '@/env';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
      groupId: string | undefined;
    } & DefaultSession['user'];
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: { session: ({ session, user }) => ({ ...session, user }) },
  adapter: PrismaAdapter(db),
  pages: { signIn: '/login' },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
