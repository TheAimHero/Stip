'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popoverDialog';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { api } from '@/trpc/react';
import { useState } from 'react';
// import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';

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
  createdAt: z.date().optional().default(new Date()),
  completed: z.boolean().default(false),
});

function AddTodo() {
  const [open, setOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: undefined,
      completed: false,
      createdAt: new Date(),
    },
  });
  const utils = api.useUtils();
  const { toast } = useToast();
  const { mutate: addTodo, status } = api.todo.create.useMutation({
    onSuccess: async () => {
      setOpen(false);
      await utils.todo.getAll.invalidate();
      toast({
        title: 'Added Todo',
        description: `Due Date ${format(
          form.getValues('dueDate').toString(),
          'yyyy-MM-dd',
        )}`,
      });
      form.reset();
    },
    onError: (err) => {
      form.reset();
      console.log(err);
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    addTodo(values);
  }
  return (
    <Form {...form}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={() => setOpen(true)}
            variant='default'
            size={'lg'}
            className='m-4'
          >
            <span className='font-semibold'>Add Todo</span>
          </Button>
        </DialogTrigger>
        <DialogContent className='max-h-[90%] max-w-[90%] overflow-scroll scroll-smooth sm:max-h-full sm:max-w-[425px] sm:overflow-auto'>
          <DialogHeader>
            <DialogTitle>Add Todo</DialogTitle>
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
              name='completed'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow'>
                  <FormControl>
                    <Checkbox
                      className='h-8 w-8 items-center'
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>Completed</FormLabel>
                    <FormDescription>
                      Check if the task is completed.
                    </FormDescription>
                  </div>
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
            <div className='flex justify-around gap-7'>
              <Button
                type='submit'
                className='flex-1'
                disabled={status === 'loading'}
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
}

export default AddTodo;
