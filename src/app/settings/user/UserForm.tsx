'use client';

import React, { useEffect } from 'react';
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
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
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
    defaultValues: { rollNo: -1 },
  });
  useEffect(() => {
    if (userStatus === 'success') {
      form.setValue('rollNo', user?.rollNo ?? undefined);
    }
  }, [form, user?.rollNo, userStatus]);
  const { mutate: updateUser, status: updateStatus } =
    api.user.update.useMutation({
      // onError: (err) => console.log(err),
    });
  function onSubmit(values: z.infer<typeof formSchema>) {
    updateUser({ rollNo: values.rollNo });
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
            name='rollNo'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Roll Number</FormLabel>
                <FormControl>
                  <Input
                    disabled={userStatus !== 'success'}
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
