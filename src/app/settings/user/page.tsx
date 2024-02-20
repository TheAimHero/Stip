import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import UserForm from './UserForm';
import GroupForm from './GroupForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getServerAuthSession } from '@/server/auth';
import { redirect } from 'next/navigation';
import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ArrowRightIcon } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';

const Page = async () => {
  const session = await getServerAuthSession();
  if (!session?.user.id || !session.user.email) redirect('/auth/login');
  const { name, email } = session.user;
  return (
    <MaxWidthWrapper>
      <div className='sm:mx-18 mx-5 my-[60px] grid gap-5 md:grid-cols-2'>
        <div className='flex flex-col gap-4'>
          <Card className='flex flex-col gap-4 p-5'>
            <div className='flex items-center justify-between gap-5 text-base text-slate-800'>
              <label className='dark:text-white'>Profile</label>
              <Input
                disabled
                className='dark:disabled:text-white'
                value={name ? name : ''}
              />
            </div>
            <div className='flex items-center justify-between gap-5 text-base text-slate-800'>
              <label className='dark:text-white'>Email</label>
              <Input
                className='dark:disabled:text-white'
                disabled
                value={email ? email : ''}
              />
            </div>
            <span className='text-center text-sm text-slate-700'>
              Contact Admin To Update.
            </span>
          </Card>
          <UserForm />
        </div>
        <div className='flex flex-col gap-5'></div>
      </div>
      <div className='mx-auto max-w-[300px]'>
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
    </MaxWidthWrapper>
  );
};

export default Page;
