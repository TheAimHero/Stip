import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const Loading = () => {
  return <Skeleton className='my-4 h-[calc(100vh-200px)] w-full rounded-xl' />;
};

export default Loading;
