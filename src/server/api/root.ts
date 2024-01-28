import { todoRouter } from '@/server/api/routers/todo';
import { createTRPCRouter } from '@/server/api/trpc';
import { groupRouter } from './routers/group';
import { taskRouter } from './routers/task';
import { userRouter } from './routers/user';

export const appRouter = createTRPCRouter({
  todo: todoRouter,
  user: userRouter,
  group: groupRouter,
  task: taskRouter,
});

export type AppRouter = typeof appRouter;
