'use client';

import { format } from 'date-fns';
import { Loader2, Trash2 } from 'lucide-react';
import { type FC, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import DownloadButton from './DownloadButton';
import { api } from '@/trpc/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { formatDateTime } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

export interface ModTaskCardProps {
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

const ModTaskCard: FC<ModTaskCardProps> = ({
  description,
  id: taskId,
  title,
  groupId,
  dueDate,
  fileId,
  createdAt,
}) => {
  const [duration, setDuration] = useState('');
  const utils = api.useUtils();
  const { toast } = useToast();
  const { mutate: deleteTask, status: deleteStatus } =
    api.task.deleteMod.useMutation({
      onSuccess: async () => await utils.task.getAllModTask.invalidate(),
      // @perf: remove code duplication
      onError: async (err) => {
        if (err.data?.code === 'UNAUTHORIZED') {
          toast({
            variant: 'destructive',
            title: 'Task Deletion Failed',
            description: 'User not found or not authorized',
          });
          return;
        }
        if (err.data?.code === 'NOT_FOUND') {
          toast({
            variant: 'destructive',
            title: 'Task Deletion Failed',
            description: 'Task not found. Try again...',
          });
          await utils.task.getAllModTask.invalidate();
          return;
        }
      },
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
            onClick={() => deleteTask({ groupId, taskId })}
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

export default ModTaskCard;
