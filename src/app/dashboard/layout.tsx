'use client';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import React, { type PropsWithChildren } from 'react';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import MenuBar from '@/components/MenuBar';
import { Loader2 } from 'lucide-react';

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
        <MenuBar>{children}</MenuBar>
      </MaxWidthWrapper>
    </div>
  );
};

export default Layout;
