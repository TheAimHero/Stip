'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormControl,
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';
import { z } from 'zod';
import { Card } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
  CommandInput,
  CommandEmpty,
  CommandGroup,
  Command,
  CommandItem,
} from '@/components/ui/command';
import { ChevronsDownUp, CheckIcon, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  group_id: z.number().min(1, 'Group is required').optional(),
  rollNo: z.coerce
    .number()
    .min(1, 'Roll number should be greater than 0')
    .optional(),
});

const UserForm = () => {
  const { data: user, status: userStatus } = api.user.getById.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      cacheTime: 5 * 60 * 1000,
    },
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { group_id: undefined, rollNo: undefined },
  });
  useEffect(() => {
    if (userStatus === 'success') {
      form.setValue('rollNo', user?.rollNo ?? undefined);
      form.setValue('group_id', user?.groupId ?? undefined);
    }
  }, [form, user?.groupId, user?.rollNo, userStatus]);
  const { data: groups, status: groupStatus } = api.group.getAll.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      cacheTime: 5 * 60 * 1000,
    },
  );
  const [selectOpen, setSelectOpen] = useState(false);
  const { mutate: updateUser, status: updateStatus } =
    api.user.update.useMutation({
      // onError: (err) => console.log(err),
    });
  function onSubmit(values: z.infer<typeof formSchema>) {
    updateUser({ groupId: values.group_id, rollNo: values.rollNo });
  }
  return (
    <Card className='p-5'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='m-4 w-[80%] space-y-8'
        >
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
                          'justify-between',
                          !field.value && 'text-muted-foreground',
                        )}
                        disabled={
                          groupStatus !== 'success' && userStatus !== 'success'
                        }
                      >
                        {groups && field.value && user
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
          <FormField
            control={form.control}
            name='rollNo'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Roll Number</FormLabel>
                <FormControl>
                  <Input
                    disabled={
                      groupStatus !== 'success' && userStatus !== 'success'
                    }
                    placeholder='Roll Number'
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className='m-5 w-full p-4' type='submit'>
            {updateStatus === 'loading' ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              'Submit'
            )}
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default UserForm;
