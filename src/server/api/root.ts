import { todoRouter } from '@/server/api/routers/todo';
import { createTRPCRouter } from '@/server/api/trpc';
import { groupRouter } from './routers/group';
import { taskRouter } from './routers/task';
import { userRouter } from './routers/user';
import { fileRouter } from './routers/files';

export const appRouter = createTRPCRouter({
  todo: todoRouter,
  user: userRouter,
  group: groupRouter,
  task: taskRouter,
  file: fileRouter,
});

export type AppRouter = typeof appRouter;
