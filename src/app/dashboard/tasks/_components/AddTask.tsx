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
import { CalendarIcon, CheckIcon, ChevronsDownUp, Loader2 } from 'lucide-react';
import { api } from '@/trpc/react';
import { useToast } from '@/components/ui/use-toast';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import UploadTaskFile from './UploadTaskFile';

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
  group_id: z.number().min(1, 'Group is required'),
  fileId: z.number().optional(),
});

const AddTask = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileId, setFileId] = useState<number | undefined>();
  useEffect(() => {
    if (fileId && !isUploading) {
      form.setValue('fileId', fileId);
    }
  }, [fileId, isUploading]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: undefined,
      createdAt: new Date(),
    },
  });
  const { data: groups } = api.group.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
    enabled: modalOpen,
    refetchOnReconnect: false,
  });
  const { toast } = useToast();
  const utils = api.useUtils();
  const { mutate: addTask, status } = api.task.addTask.useMutation({
    onSuccess: async () => {
      setModalOpen(false);
      form.reset();
      await utils.task.invalidate();
      toast({
        title: 'Added Task',
        description: `dueDate ${format(
          form.getValues('dueDate').toString(),
          'yyyy-MM-dd',
        )}`,
      });
    },
    onError: (err) => console.log(err),
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    const {
      description,
      dueDate,
      group_id: groupId,
      title,
      createdAt,
      fileId,
    } = values;

    addTask({
      createdAt,
      description,
      dueDate,
      groupId,
      title,
      fileId,
    });
  }
  return (
    <Form {...form}>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={() => setModalOpen(true)}
            variant='default'
            size={'lg'}
            className='m-4 rounded-sm'
          >
            <span className='font-semibold'>Add Task</span>
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
            <FormField
              control={form.control}
              name='group_id'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Group</FormLabel>
                  <Popover open={selectOpen} onOpenChange={setSelectOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          role='combobox'
                          className={cn(
                            'w-[200px] justify-between',
                            !field.value && 'text-muted-foreground',
                          )}
                          disabled={!groups}
                        >
                          {groups && field.value
                            ? groups.find((group) => group.id === field.value)
                                ?.name
                            : 'Select Group'}
                          <ChevronsDownUp className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-[200px] p-0'>
                      <Command>
                        <CommandInput
                          placeholder='Search group...'
                          className='h-9'
                        />
                        <CommandEmpty>No Group found.</CommandEmpty>
                        <CommandGroup>
                          {groups?.map((group) => (
                            <CommandItem
                              value={group.name}
                              key={group.id}
                              onSelect={() => {
                                form.setValue('group_id', group.id);
                                setSelectOpen(false);
                              }}
                            >
                              {group.name}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  group.id === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    The group to assign this task.
                  </FormDescription>
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
                disabled={status === 'loading' || isUploading}
              >
                {status === 'loading' ? (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                ) : (
                  'Save changes'
                )}
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
