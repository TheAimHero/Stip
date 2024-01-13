'use client';

import React, { type FC, useState, useEffect } from 'react';
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
interface TodoCardProps {
  title: string;
  id: string;
  description: string;
  completed: boolean;
  dueDate: Date;
  createdAt: Date;
}
import { Button } from '@/components/ui/button';
import { Check, Edit, Loader2, Trash2 } from 'lucide-react';
import { api } from '@/trpc/react';
import TodoDialog from './TodoDialog';

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
  const [isInfoOpen, setInfoOpen] = useState(false);
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
      await utils.todo.getAll.invalidate(undefined, { queryKey: ['todo', id] });
      await utils.todo.getOne.invalidate(id);
    },
    onSettled: () => setIsUpdating(false),
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
        <CardTitle className='flex items-center justify-between gap-4'>
          <span className='truncate text-xl'>{title}</span>
          <Button onClick={() => setInfoOpen(true)} variant={'link'}>
            <Edit className='h-6 w-7 opacity-30' />
          </Button>
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
                { 'bg-red-500': !completed && !isUpdating },
                { 'bg-green-500': completed && !isUpdating },
                { 'bg-gray-500': isUpdating },
              )}
            />
          </div>
          <Button
            onClick={() => {
              updateTodo({ id, completed: !completed });
              setIsUpdating(true);
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
            className='w-20 place-content-end p-0 opacity-80'
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
      <TodoDialog isOpen={isInfoOpen} setIsOpen={setInfoOpen} todoId={id} />
    </Card>
  );
};

export default TodoCard;
