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
import { Check, Ghost, Loader2, Trash2 } from 'lucide-react';
import Sort, {
  type sortMethodType,
  type sortParamType,
} from '@/lib/todos/sort';
import Filter, { type filterMethodType } from '@/lib/todos/filter';

interface TodoCardProps {
  title: string;
  id: string;
  description: string;
  completed: boolean;
  dueDate: Date;
  createdAt: Date;
}

const TodoCard: FC<TodoCardProps> = ({
  description,
  id,
  title,
  dueDate,
  completed,
  createdAt,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [duration, setDuration] = useState('');
  const utils = api.useUtils();
  const { mutate: deleteTodo } = api.todo.delete.useMutation({
    onSuccess: async () => {
      setIsDeleting(false);
      await utils.todo.getAll.invalidate();
    },
    onError: () => setIsDeleting(false),
    onMutate: () => setIsDeleting(true),
  });
  const { mutate: updateTodo } = api.todo.update.useMutation({
    onSuccess: async () => {
      setIsUpdating(false);
      await utils.todo.getAll.invalidate();
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
        <CardTitle className='truncate text-xl'>{title}</CardTitle>
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
        <div className='flex w-full items-center justify-between gap-5'>
          <div className='flex w-full flex-col'>
            <span className='text-md'>Time Left: </span>
            <span className='text-xs'>{duration}</span>
          </div>
          <Button
            onClick={() => {
              setIsDeleting(true);
              deleteTodo(id);
            }}
            className='w-20 place-content-end p-0'
            variant={'destructive'}
          >
            {isDeleting ? (
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

interface ListTodosProps {
  sortBy: string;
  filterBy: string;
}

const ListTodos: FC<ListTodosProps> = ({ sortBy, filterBy }) => {
  const { data: todos, status } = api.todo.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  if (status === 'loading') {
    return (
      <div className='m-4 mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {Array(6)
          .fill(0)
          .map((_, ind) => (
            <Skeleton key={ind} className='h-72 rounded-md shadow-sm' />
          ))}
      </div>
    );
  }
  const [sortMethod, sortParam] = sortBy.split('-');
  const filterTodos =
    todos && new Filter(todos)[filterBy as filterMethodType]();
  const sortedTodos =
    filterTodos &&
    new Sort(filterTodos)[sortMethod as sortMethodType](
      sortParam as sortParamType,
    );

  return (
    <div className='m-4 mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
      <Fragment>
        {sortedTodos?.length === 0 ? (
          <div className='mt-13 col-span-1 items-center justify-between gap-4 text-center md:col-span-2 lg:col-span-3'>
            <div className='flex flex-col gap-4'>
              <h1 className='text-2xl'>No Todos Found...</h1>
              <Ghost className='mx-auto h-12 w-12' />
            </div>
          </div>
        ) : null}
        {sortedTodos
          ? sortedTodos?.map((todo) => <TodoCard key={todo.id} {...todo} />)
          : null}
      </Fragment>
    </div>
  );
};

export default ListTodos;
