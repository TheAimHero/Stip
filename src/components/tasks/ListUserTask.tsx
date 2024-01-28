'use client';

import React, { Fragment, type FC, useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { format } from 'date-fns';
import { cn, formatDateTime } from '@/lib/utils';
import { api } from '@/trpc/react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Check, Ghost, Loader2 } from 'lucide-react';
import FilterTasksClass, {
  type filterTaskMethods,
} from '@/lib/tasks/filterTasks';
import SortTasksClass, {
  type SortParam,
  type SortTasksMethod,
} from '@/lib/tasks/sortTasks';

interface TaskCardProps {
  task: {
    id: number;
    title: string;
    description: string;
    dueDate: Date;
    assignedBy: {
      name: string;
    };
    groupId: number;
    createdAt: Date;
    state: string;
  };
  completed: boolean;
  taskId: number;
  completedAt: Date | null;
}

const TaskCard: FC<TaskCardProps> = ({ task, completed }) => {
  const { description, assignedBy, id, title, dueDate, createdAt, state } =
    task;
  const { name } = assignedBy;
  const [isUpdating, setIsUpdating] = useState(false);
  const [duration, setDuration] = useState('');
  const utils = api.useUtils();
  const { mutate: updateTodo } = api.task.updateUserTask.useMutation({
    onSuccess: async () => {
      setIsUpdating(false);
      await utils.task.getAllUserTask.invalidate();
    },
    onError: () => setIsUpdating(false),
    onMutate: () => setIsUpdating(true),
  });
  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(formatDateTime(dueDate));
    }, 60000);
    setDuration(formatDateTime(dueDate));
    return () => clearInterval(interval);
  }, [dueDate]);
  return (
    <Card>
      <CardHeader>
        <CardTitle
          className={cn('flex gap-3 truncate text-xl', {
            'text-red-500': state === 'DELETED',
          })}
        >
          <span className=''>{title}</span>
          {state === 'DELETED' && <span>Cancelled</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-3'>
        <CardDescription className='truncate'>{description}</CardDescription>
        <div className='flex w-full items-center justify-between gap-5'>
          <span>Due Date: </span>
          <span>{format(dueDate, 'dd MMM yyyy')}</span>
        </div>
        <div className='flex w-full items-center justify-between gap-5'>
          <span>Created Date: </span>
          <span>{format(createdAt, 'dd MMM yyyy')}</span>
        </div>
        <div className='flex w-full items-center justify-between gap-5'>
          <div className='flex items-center gap-5'>
            <span>Completed: </span>
            <div
              className={cn(
                'h-4 w-4 rounded-full',
                { 'bg-red-500': !completed },
                { 'bg-green-500': completed },
              )}
            />
          </div>
          <Button
            onClick={() => {
              updateTodo({ id, completed: !completed });
              setIsUpdating(!isUpdating);
            }}
            className='w-20 p-0'
            variant={'outline'}
          >
            {isUpdating ? (
              <Loader2 className='h-4 w-6 animate-spin' />
            ) : (
              <Check
                className={cn(
                  'h-4 w-4',
                  { 'text-gray-500': isUpdating },
                  { 'text-green-500': completed && !isUpdating },
                  { 'text-red-500': !completed && !isUpdating },
                )}
              />
            )}
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-center justify-between'>
          <div className='flex w-full flex-col'>
            <span className='text-md'>Time Left: </span>
            <span className='text-xs'>{duration}</span>
          </div>
          <div className='flex w-full flex-col'>
            <span className='text-md'>Assigned By: </span>
            <span className='text-xs'>{name}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

interface ListUserTaskProps {
  filterBy: string;
  sortBy: string;
}

const ListUserTask: FC<ListUserTaskProps> = ({ filterBy, sortBy }) => {
  const timeInterval = 1000 * 30;
  const { data: tasks, status } = api.task.getAllUserTask.useQuery(undefined, {
    staleTime: timeInterval,
    refetchInterval: timeInterval,
  });
  const filterTasks =
    tasks && new FilterTasksClass(tasks)[filterBy as filterTaskMethods]();

  const [sortByMethod, sortByParam] = sortBy.split('-');
  const sortedTasks =
    filterTasks &&
    (new SortTasksClass(filterTasks)[sortByMethod as SortTasksMethod](
      sortByParam as SortParam,
    ) as TaskCardProps[]);
  return (
    <div className='m-4 mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3'>
      <Fragment>
        {status === 'loading'
          ? Array(6)
              .fill(0)
              .map((_, ind) => (
                <Skeleton key={ind} className='h-72 rounded-md shadow-sm' />
              ))
          : null}
        {tasks?.length === 0 ? (
          <div className='mt-13 col-span-1 items-center justify-between gap-4 text-center md:col-span-2 lg:col-span-3'>
            <div className='flex flex-col gap-4'>
              <h1 className='text-2xl'>No Tasks Found...</h1>
              <Ghost className='mx-auto h-12 w-12' />
            </div>
          </div>
        ) : null}
        {sortedTasks
          ? sortedTasks?.map((task) => <TaskCard key={task.taskId} {...task} />)
          : null}
      </Fragment>
    </div>
  );
};

export default ListUserTask;
