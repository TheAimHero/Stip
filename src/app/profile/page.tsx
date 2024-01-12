import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import UserForm from '@/components/UserForm';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getServerAuthSession } from '@/server/auth';
import { redirect } from 'next/navigation';
import React from 'react';

const Page = async () => {
  const session = await getServerAuthSession();
  if (!session?.user.id || !session.user.email) redirect('/auth/login');
  const { name, email } = session.user;
  return (
    <MaxWidthWrapper>
      <div className='sm:mx-18 mx-5 my-[60px] grid md:grid-cols-2'>
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
      </div>
    </MaxWidthWrapper>
  );
};

export default Page;
