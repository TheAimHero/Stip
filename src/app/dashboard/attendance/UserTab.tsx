'use client';
import { api } from '@/trpc/react';
import React, { type FC } from 'react';

interface UserTabProps {
  date: Date;
}

const UserTab: FC<UserTabProps> = ({ date }) => {
  const { data } = api.user.getAttendance.useQuery(date, { retry: false });
  if (!date) return <p>Please select date</p>;
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

export default UserTab;
