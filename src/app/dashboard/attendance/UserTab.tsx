'use client';
import { api } from '@/trpc/react';
import React, { type FC } from 'react';

interface UserTabProps {
  date: Date | undefined;
  groupId: number;
}

const UserTab: FC<UserTabProps> = ({ date, groupId }) => {
  const { data } = api.user.getUserAttendance.useQuery(
    { groupId, createdAt: date },
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
