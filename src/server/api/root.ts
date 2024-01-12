import { createTRPCRouter } from '@/server/api/trpc';
import { todoRouter } from './routers/todo';
import { taskRouter } from './routers/task';
import { groupRouter } from './routers/group';
import { userRouter } from './routers/user';

export const appRouter = createTRPCRouter({
  todo: todoRouter,
  task: taskRouter,
  group: groupRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
