'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { api } from '@/trpc/react';
import { useToast } from '@/components/ui/use-toast';
import { Loader2Icon } from 'lucide-react';

const formSchema = z.object({
  grpName: z
    .string()
    .min(3, 'Group name is required')
    .max(20, 'Group name is too long')
    .regex(/^[a-zA-Z0-9_-\s]+$/, 'Group name contains invalid characters'),
  grpDesc: z.string().max(100, 'Group description is too long'),
});

const GroupForm = () => {
  const { toast } = useToast();
  const utils = api.useUtils();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grpName: '',
      grpDesc: '',
    },
  });
  const { mutate: createGroup, status: createStatus } =
    api.group.createGroup.useMutation({
      onSuccess: async () => {
        form.reset();
        await utils.group.getAll.invalidate();
        toast({
          title: 'Group Created',
          description: 'Your group has been created successfully.',
        });
      },
      onError: (err) => {
        if (err.data?.zodError) {
          toast({
            variant: 'destructive',
            title: 'Group Creation Failed',
            description: 'Incorrect values. Try again...',
          });
          return;
        }
        toast({
          variant: 'destructive',
          title: 'Group Creation Failed',
          description: 'Something went wrong. Please try again.',
        });
      },
    });
  function onSubmit(values: z.infer<typeof formSchema>) {
    createGroup({
      name: values.grpName,
      description: values.grpDesc,
    });
  }
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='mx-auto text-xl underline'>Add Group</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='grpName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Group Name' {...field} />
                  </FormControl>
                  <FormDescription>This is your group name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='grpDesc'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Description</FormLabel>
                  <FormControl>
                    <Input placeholder='Group Description' {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your group description.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' disabled={createStatus === 'loading'}>
              {createStatus === 'loading' ? (
                <Loader2Icon className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                <span>Submit</span>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default GroupForm;
