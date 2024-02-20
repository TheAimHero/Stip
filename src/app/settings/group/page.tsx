import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import GroupForm from './GroupForm';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';
import DeleteGroup from './DeleteGroup';

const Page = () => {
  return (
    <MaxWidthWrapper>
      <div className='sm:mx-18 mx-5 my-[60px] grid gap-5 md:grid-cols-2'>
        <div className='flex flex-col gap-5'>
          <Card className='w-full'>
            <CardHeader>
              <CardTitle className='mx-auto text-xl underline'>
                Add Group
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GroupForm />
            </CardContent>
          </Card>
        </div>
        <div className='flex flex-col gap-4'>
          <DeleteGroup />
        </div>
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
