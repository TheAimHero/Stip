'use client';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import React, { type PropsWithChildren } from 'react';
import { redirect, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { BookCheck, CheckSquare, Edit3, Loader2, Users } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

const Layout = ({ children }: PropsWithChildren) => {
  const { status: authStatus } = useSession();
  const defaultTab = usePathname().split('/').pop()!;
  if (authStatus === 'unauthenticated') redirect('/auth/login');
  if (authStatus === 'loading') {
    return (
      <div className='mt-24 flex w-full justify-center'>
        <div className='flex flex-col items-center gap-2'>
          <Loader2 className='h-8 w-8 animate-spin text-zinc-800 dark:text-white' />
          <h3 className='text-xl font-semibold'>Setting up your account...</h3>
          <p>You will be redirected automatically.</p>
        </div>
      </div>
    );
  }
  return (
    <MaxWidthWrapper>
      <Tabs defaultValue={defaultTab} className='my-4 w-full'>
        <TabsList className='flex w-full justify-evenly gap-5'>
          <TabsTrigger value='todos' asChild className='flex-1'>
            <Link href='/dashboard/todos' className='flex items-center gap-3'>
              <CheckSquare className='sr-only h-4 w-4 sm:not-sr-only' />
              <span className='truncate'>Todos</span>
            </Link>
          </TabsTrigger>
          <TabsTrigger value='tasks' asChild className='flex-1'>
            <Link href='/dashboard/tasks' className='flex items-center gap-3'>
              <BookCheck className='sr-only h-4 w-4 sm:not-sr-only' />
              <span className='truncate'>Tasks</span>
            </Link>
          </TabsTrigger>
          <TabsTrigger value='attendance' asChild className='flex-1'>
            <Link
              href='/dashboard/attendance'
              className='flex items-center gap-3'
            >
              <Users className='sr-only h-4 w-4 sm:not-sr-only' />
              <span className='truncate'>Attendance</span>
            </Link>
          </TabsTrigger>
          <TabsTrigger value='editor' asChild className='flex-1'>
            <Link href='/dashboard/editor' className='flex items-center gap-3'>
              <Edit3 className='sr-only h-4 w-4 sm:not-sr-only' />
              <span className='truncate'>Md Editor</span>
            </Link>
          </TabsTrigger>
        </TabsList>
        {children}
      </Tabs>
    </MaxWidthWrapper>
  );
};

export default Layout;
