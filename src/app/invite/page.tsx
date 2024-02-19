'use client';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { buttonVariants } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { api } from '@/trpc/react';
import {
  ArrowRightIcon,
  CheckCheckIcon,
  CircleOffIcon,
  Loader2Icon,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { z } from 'zod';

const inputSchema = z.object({
  groupId: z.coerce.number(),
  inviteCode: z.string(),
});

const Page = () => {
  const params = useSearchParams();
  const groupId = params.get('groupId');
  const inviteCode = params.get('inviteCode');
  const { toast } = useToast();
  const utils = api.useUtils();
  const {
    mutate: join,
    status: joinStatus,
    error: joinError,
  } = api.group.joinGroup.useMutation({
    onSuccess: async () => {
      toast({
        title: 'Group joined',
        description: 'Group joined successfully',
      });
      await utils.group.getAll.invalidate();
    },
    onError: async (err) => {
      if (err.data?.code === 'CONFLICT') {
        toast({
          title: 'Group join failed',
          description: 'Already joined',
        });
        await utils.group.getAll.invalidate();
        return;
      }
      toast({
        title: 'Group join failed',
        description: 'Group join failed. Please try again...',
        variant: 'destructive',
      });
    },
  });
  const input = inputSchema.safeParse({ groupId, inviteCode });
  useEffect(() => {
    if (input.success) {
      join({ groupId: input.data.groupId, inviteCode: input.data.inviteCode });
    }
  }, [input.success]);
  if (!input.success) {
    return (
      <MaxWidthWrapper>
        <div className='mt-24 flex w-full justify-center'>
          <div className='flex flex-col items-center gap-2'>
            <CircleOffIcon className='h-8 w-8 animate-pulse text-zinc-800 dark:text-white' />
            <h3 className='text-xl font-semibold'>Invalid Invite Link</h3>
            <p>Please check the link and try again...</p>
          </div>
        </div>
      </MaxWidthWrapper>
    );
  }
  if (joinStatus === 'loading') {
    return (
      <div className='mt-24 flex w-full justify-center'>
        <div className='flex flex-col items-center gap-2'>
          <Loader2Icon className='h-8 w-8 animate-spin text-zinc-800 dark:text-white' />
          <h3 className='text-xl font-semibold'>Joining group...</h3>
          <p>You will be redirected automatically.</p>
        </div>
      </div>
    );
  }
  if (joinError?.data?.code === 'CONFLICT') {
    return (
      <MaxWidthWrapper>
        <div className='mt-24 flex w-full justify-center'>
          <div className='flex flex-col items-center gap-2'>
            <CheckCheckIcon className='h-8 w-8 text-zinc-800 dark:text-white' />
            <h3 className='text-xl font-semibold'>
              Already a member of the group...
            </h3>
            <Link
              href={'/dashboard/tasks'}
              className={cn(
                buttonVariants({ size: 'lg', variant: 'default' }),
                'mt-4 flex items-center gap-2',
              )}
            >
              <span>Dashboard</span>
              <ArrowRightIcon className='h-4 w-4' />
            </Link>
          </div>
        </div>
      </MaxWidthWrapper>
    );
  }
  return (
    <MaxWidthWrapper>
      <div className='mt-24 flex w-full justify-center'>
        <div className='flex flex-col items-center gap-2'>
          <CheckCheckIcon className='h-8 w-8 text-zinc-800 dark:text-white' />
          <h3 className='text-xl font-semibold'>
            Group Joined Successfully...
          </h3>
          <Link
            href={'/dashboard/tasks'}
            className={cn(
              buttonVariants({ size: 'lg', variant: 'default' }),
              'mt-4 flex items-center gap-2',
            )}
          >
            <span>Dashboard</span>
            <ArrowRightIcon className='h-4 w-4' />
          </Link>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default Page;
