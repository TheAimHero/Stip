'use client';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import MenuBar, { type MenuBarOptions } from '@/components/MenuBar';
import { BoxesIcon, Loader2Icon, UserIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { type PropsWithChildren } from 'react';

const pagesObj: MenuBarOptions[] = [
  {
    name: 'User Setting',
    link: '/settings/user',
    icon: <UserIcon className='sr-only h-4 w-4 sm:not-sr-only' />,
    value: 'user',
  },
  {
    name: 'Group Setting',
    link: '/settings/group',
    icon: <BoxesIcon className='sr-only h-4 w-4 sm:not-sr-only' />,
    value: 'group',
  },
];

const Layout = ({ children }: PropsWithChildren) => {
  const { status: authStatus } = useSession();
  if (authStatus === 'unauthenticated') redirect('/auth/login');
  if (authStatus === 'loading') {
    return (
      <div className='mt-24 flex w-full justify-center'>
        <div className='flex flex-col items-center gap-2'>
          <Loader2Icon className='h-8 w-8 animate-spin text-zinc-800 dark:text-white' />
          <h3 className='text-xl font-semibold'>Setting up your account...</h3>
          <p>You will be redirected automatically.</p>
        </div>
      </div>
    );
  }
  return (
    <div className='md:flex'>
      <MaxWidthWrapper>
        <MenuBar title='Settings' optionsArr={pagesObj}>
          {children}
        </MenuBar>
      </MaxWidthWrapper>
    </div>
  );
};

export default Layout;
