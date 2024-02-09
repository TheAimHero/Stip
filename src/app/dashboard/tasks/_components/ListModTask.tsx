'use client';

import { formatDateTime } from '@/lib/utils';
import { api } from '@/trpc/react';
import { format } from 'date-fns';
import { Loader2, Trash2, Ghost } from 'lucide-react';
import { type FC, useState, useEffect, Fragment } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import SortTasksClass, {
  type SortParam,
  type SortTasksMethod,
} from '@/lib/tasks/sortTasks';
import DownloadButton from './DownloadButton';

interface TaskCardProps {
  group: {
    id: number;
    name: string;
  };
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  groupId: number;
  createdAt: Date;
  fileId: number | undefined;
  assignedById: string;
}

const TaskCard: FC<TaskCardProps> = ({
  description,
  id,
  title,
  dueDate,
  fileId,
  createdAt,
}) => {
  const [duration, setDuration] = useState('');
  const utils = api.useUtils();
  const { mutate: deleteTask, status: deleteStatus } =
    api.task.deleteMod.useMutation({
      onSuccess: async () => await utils.task.getAllModTask.invalidate(),
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
      <CardHeader className='flex flex-row items-center justify-between gap-3 md:gap-10'>
        <CardTitle className='truncate text-xl'>{title}</CardTitle>
        {fileId && <DownloadButton fileId={fileId} />}
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
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-center justify-between gap-5'>
          <div className='flex w-full flex-col'>
            <span className='text-md'>Time Left: </span>
            <span className='text-xs'>{duration}</span>
          </div>
          <Button
            onClick={() => {
              deleteTask(id);
            }}
            className='w-20 p-0'
            variant={'destructive'}
          >
            {deleteStatus === 'loading' ? (
              <Loader2 className='h-4 w-6 animate-spin' />
            ) : (
              <Trash2 className='h-4 w-8' />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

interface ListModTaskProps {
  sortBy: string;
}

const ListModTask: FC<ListModTaskProps> = ({ sortBy }) => {
  const { data: tasks } = api.task.getAllModTask.useQuery(undefined, {
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
    cacheTime: 1000 * 60,
  });
  const [sortTaskMethod, sortTaskParam] = sortBy.split('-');
  const sortedTasks =
    tasks &&
    (new SortTasksClass(tasks)[sortTaskMethod as SortTasksMethod](
      sortTaskParam as SortParam,
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
          ? sortedTasks?.map((task) => <TaskCard key={task.id} {...task} />)
          : null}
      </Fragment>
    </div>
  );
};

export default ListModTask;
