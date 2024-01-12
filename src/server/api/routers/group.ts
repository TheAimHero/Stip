// import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { db } from '@/server/db';

export const groupRouter = createTRPCRouter({
  getAll: publicProcedure.query(() => db.group.findMany()),
});
