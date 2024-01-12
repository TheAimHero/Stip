'use client';

import React, { useState } from 'react';
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
import { ChevronsDownUp, CheckIcon } from 'lucide-react';

const formSchema = z.object({
  group_id: z.string().min(1, 'Group is required'),
});

const UserForm = () => {
  const { data: user } = api.user.getById.useQuery();
  const { data: groups } = api.group.getAll.useQuery();
  const [selectOpen, setSelectOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { group_id: user?.groupId?.toString() },
  });
  const { mutate: updateUser } = api.user.update.useMutation({
    onError: (err) => console.log(err),
    onSuccess: () => form.reset(),
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    updateUser({ groupId: values.group_id });
  }
  return (
    <Card className='p-5'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                                group.name === field.value
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
          <Button className='m-5 p-4' type='submit'>
            Submit
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default UserForm;
