'use client';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { useState } from 'react';
import SelectGroup from './SelectGroup';
import DatePicker from './DatePicker';
import { useSession } from 'next-auth/react';
import ModTab from './ModTab';
import UserTab from './UserTab';

export default function Page() {
  const { data } = useSession();
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(new Date().setHours(0, 0, 0, 0)),
  );
  return (
    <MaxWidthWrapper className='container mx-auto flex h-[calc(100vh-60px)] flex-col py-3 sm:py-10'>
      <div className='flex w-full justify-between gap-5 sm:gap-10'>
        <SelectGroup
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
        />
        <DatePicker date={selectedDate} setDate={setSelectedDate} />
      </div>
      {data?.user.role === 'USER' && <UserTab date={selectedDate} />}
      {data?.user.role === 'MOD' && (
        <ModTab selectedDate={selectedDate} selectedGroup={selectedGroup} />
      )}
    </MaxWidthWrapper>
  );
}
