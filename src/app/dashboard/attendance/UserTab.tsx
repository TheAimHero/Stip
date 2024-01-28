'use client';
import { api } from '@/trpc/react';
import React, { type FC } from 'react';

interface UserTabProps {
  date: Date | undefined;
}

const UserTab: FC<UserTabProps> = ({ date }) => {
  const { data } = api.user.getUserAttendance.useQuery(
    date ? new Date(date.setHours(0, 0, 0, 0)) : undefined,
    {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
  );
  return <pre className='text-wrap'>{JSON.stringify(data, null, 2)}</pre>;
};

export default UserTab;
