'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';

const Page = () => {
  return (
    <MaxWidthWrapper className='flex h-[calc(100vh-60px)]'>
      <Button
        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
        variant={'default'}
        type='reset'
        className='mx-auto my-auto px-10 py-5 text-xl sm:w-[50%]'
      >
        Sign in with Google
      </Button>
    </MaxWidthWrapper>
  );
};

export default Page;
