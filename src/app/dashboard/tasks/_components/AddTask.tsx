'use client';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogHeader,
} from '@/components/ui/dialog';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popoverDialog';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { api } from '@/trpc/react';
import { useToast } from '@/components/ui/use-toast';
import UploadTaskFile from './UploadTaskFile';
import { resetForm } from '@/lib/tasks/resetForm';
import { useGroups } from '@/components/Context';

const formSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(50, 'Title must be less than 50 characters'),
  description: z
    .string()
    .min(2, 'Description must be at least 2 characters')
    .max(100, 'Description must be less than 100 characters'),
  dueDate: z.date().min(new Date(), 'Due date must be in the future'),
  createdAt: z.date().default(new Date()),
  groupId: z.number().min(1, 'Group is required'),
  fileId: z.number().optional(),
});

const AddTask = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileId, setFileId] = useState<number | undefined>();
  const { groupMember, setGroupMember } = useGroups();
  useEffect(() => {
    if (fileId && !isUploading) {
      form.setValue('fileId', fileId);
    }
    if (groupMember?.groupId) {
      form.setValue('groupId', groupMember?.groupId);
    }
  }, [fileId, isUploading, groupMember]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: undefined,
      createdAt: new Date(),
    },
  });
  const { toast } = useToast();
  const utils = api.useUtils();
  const { mutate: addTask, status: taskAddStatus } =
    api.task.addTask.useMutation({
      onSuccess: async () => {
        setModalOpen(false);
        toast({
          title: 'Added Task',
          description: `Due Date: ${format(form.getValues('dueDate').toString(), 'yyyy-MM-dd')}`,
        });
        await utils.task.invalidate();
        form.reset();
        if (fileId) await resetForm(fileId);
        setFileId(undefined);
        setIsUploading(false);
      },
      onError: (err) => {
        if (err.data?.code === 'UNAUTHORIZED') {
          toast({
            title: 'Error',
            description: 'Not a Moderator.',
            variant: 'destructive',
          });
          setGroupMember(undefined);
          return;
        }
        toast({
          title: 'Error',
          description: 'Failed to add task.',
          variant: 'destructive',
        });
      },
    });
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!groupMember) {
      toast({
        title: 'Error',
        description: 'Select a group to add a task.',
        variant: 'destructive',
      });
      return;
    }
    form.setValue('groupId', groupMember.groupId);
    addTask({ ...values });
  }
  return (
    <Form {...form}>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={() => setModalOpen(true)}
            variant='default'
            size={'lg'}
            disabled={taskAddStatus === 'loading' || isUploading}
            className='rounded-sm'
          >
            {taskAddStatus === 'loading' || isUploading ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <span className='font-semibold'>Add Task</span>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className='max-h-[90%] max-w-[90%] overflow-scroll sm:max-h-full sm:max-w-[542px]'>
          <DialogHeader>
            <DialogTitle>Add Task</DialogTitle>
            <DialogDescription>Add a new task.</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder='Title' {...field} />
                  </FormControl>
                  <FormDescription>The title of the task.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder='Description' {...field} />
                  </FormControl>
                  <FormDescription>
                    The description of the task.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='dueDate'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Due Date</FormLabel>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-[240px] pl-3 text-left font-normal',
                            !field.value,
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className='ml-auto h-4 w-4' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={(value) => {
                          field.onChange(value);
                          setCalendarOpen(false);
                        }}
                        initialFocus
                        disabled={(date) =>
                          date < new Date() || date < new Date('1900-01-01')
                        }
                        className='border-slate-200 bg-[hsl(var(--popover))] opacity-95 shadow-sm'
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>Due date of the task.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <UploadTaskFile
              className='w-full'
              fileTypes={'pdf'}
              maxSizeMb={4}
              isUploading={isUploading}
              setIsUploading={setIsUploading}
              setFileId={setFileId}
              fileId={fileId}
            />
            <div className='flex justify-between gap-5'>
              <Button
                type='submit'
                className='flex-1'
                disabled={taskAddStatus === 'loading' || isUploading}
              >
                {taskAddStatus === 'loading' ? (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                ) : (
                  'Save changes'
                )}
              </Button>
              <Button
                className='flex-1'
                onClick={async () => {
                  form.reset();
                  await resetForm(fileId);
                  setIsUploading(true);
                  setFileId(undefined);
                  setIsUploading(false);
                }}
              >
                Reset Form
              </Button>
              <DialogClose asChild>
                <Button>Close</Button>
              </DialogClose>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Form>
  );
};

export default AddTask;
