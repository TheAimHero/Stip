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
import { Button } from '@/components/ui/button';
import { Check, Ghost, Loader2, Trash2 } from 'lucide-react';
import FilterTasksClass, {
  type filterTaskMethods,
} from '@/lib/tasks/filterTasks';
import SortTasksClass, {
  type SortParam,
  type SortTasksMethod,
} from '@/lib/tasks/sortTasks';
import DownloadButton from './DownloadButton';
import { useGroups } from '@/components/Context';

interface TaskCardProps {
  task: {
    id: number;
    title: string;
    description: string;
    dueDate: Date;
    fileId: number | undefined;
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
  const {
    description,
    assignedBy,
    id,
    title,
    dueDate,
    createdAt,
    state,
    fileId,
  } = task;
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
  const { mutate: deleteTask, status: deleteStatus } =
    api.task.deleteTask.useMutation({
      async onSettled(_data, error, _variables, _context) {
        if (!error) {
          await utils.task.getAllUserTask.invalidate();
        }
      },
    });
  return (
    <Card>
      <CardHeader>
        <CardTitle
          className={cn(
            'flex items-center justify-between gap-3 truncate text-xl',
            {
              'text-red-500': state === 'DELETED',
            },
          )}
        >
          <span className=''>{title}</span>
          {state === 'DELETED' && <span>Cancelled</span>}
          {state !== 'DELETED' && fileId && <DownloadButton fileId={fileId} />}
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
            <span className='text-pretty text-xs'>{duration}</span>
          </div>
          <div className='flex w-full flex-col'>
            <span className='text-md'>Assigned By: </span>
            <span className='text-xs'>{name}</span>
          </div>
          {state === 'DELETED' && (
            <Button
              variant='destructive'
              onClick={() => {
                deleteTask(id);
              }}
            >
              {deleteStatus === 'loading' ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Trash2 className='h-4 w-4' />
              )}
            </Button>
          )}
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
  const { groupMember } = useGroups();
  const { data: tasks } = api.task.getAllUserTask.useQuery(
    groupMember?.groupId ?? -1,
    {
      staleTime: timeInterval,
      refetchInterval: timeInterval,
      enabled: !!groupMember,
    },
  );
  const filterTasks =
    tasks && new FilterTasksClass(tasks)[filterBy as filterTaskMethods]();
  const [sortByMethod, sortByParam] = sortBy.split('-');
  const sortedTasks =
    filterTasks &&
    (new SortTasksClass(filterTasks)[sortByMethod as SortTasksMethod](
      sortByParam as SortParam,
    ) as TaskCardProps[]);
  return (
    <div className='m-4 mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 p-4 lg:grid-cols-2'>
      <Fragment>
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
