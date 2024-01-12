'use client';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { signOut } from 'next-auth/react';
import React from 'react';

const logout = () => {
  return (
    <MaxWidthWrapper className='h-[calc(100vh-60px)]'>
      <Card className='mx-auto mt-40 flex w-[50%] flex-col items-center gap-4 p-10'>
        <div className='text-3xl font-bold'>Sorry to see you go...</div>
        <div className='text-3xl font-bold'>👋</div>
        <Button onClick={() => signOut({ callbackUrl: '/' })}>Sign Out</Button>
      </Card>
    </MaxWidthWrapper>
  );
};

export default logout;
