import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import React from 'react';
import GroupForm from './GroupForm';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import DeleteGroup from './DeleteGroup';
import MembersTable from './MembersTable';

const Page = () => {
  return (
    <MaxWidthWrapper>
      <div className='sm:mx-18 mx-5 my-[60px] flex flex-col gap-5 md:grid md:grid-cols-2'>
        <div className='flex flex-col gap-5'>
          <GroupForm />
        </div>
        <div className='flex flex-col gap-4'>
          <DeleteGroup />
        </div>
        <div className='col-span-2'>
          <MembersTable />
        </div>
      </div>
      <div className='fixed bottom-10 mx-auto max-w-[300px]'>
        <Link
          href={'/dashboard/tasks'}
          className={cn(
            buttonVariants({ size: 'sm', variant: 'default' }),
            'mt-4 flex items-center gap-2',
          )}
        >
          <ArrowLeftIcon className='h-4 w-4' />
          <span>Dashboard</span>
        </Link>
      </div>
    </MaxWidthWrapper>
  );
};

export default Page;
