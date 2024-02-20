'use client';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import React, { type PropsWithChildren } from 'react';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import MenuBar from '@/components/MenuBar';
import {
  Loader2,
  BookCheck,
  CheckSquare,
  Edit3,
  Users,
  RssIcon,
} from 'lucide-react';

const pagesObj = [
  {
    link: '/dashboard/todos',
    icon: <CheckSquare className='sr-only h-4 w-4 sm:not-sr-only' />,
    name: 'Todos',
    value: 'todos',
  },
  {
    link: '/dashboard/tasks',
    icon: <BookCheck className='sr-only h-4 w-4 sm:not-sr-only' />,
    name: 'Tasks',
    value: 'tasks',
  },
  {
    link: '/dashboard/attendance',
    icon: <Users className='sr-only h-4 w-4 sm:not-sr-only' />,
    name: 'Attendance',
    value: 'attendance',
  },
  {
    link: '/dashboard/editor',
    icon: <Edit3 className='sr-only h-4 w-4 sm:not-sr-only' />,
    name: 'Editor',
    value: 'editor',
  },
];

const Layout = ({ children }: PropsWithChildren) => {
  const { status: authStatus } = useSession();
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
    <div className='md:flex'>
      <MaxWidthWrapper>
        <MenuBar optionsArr={pagesObj}>{children}</MenuBar>
      </MaxWidthWrapper>
    </div>
  );
};

export default Layout;
