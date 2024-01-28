'use client';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { useState } from 'react';
import SelectGroup from './SelectGroup';
import DatePicker from './DatePicker';
import { useSession } from 'next-auth/react';
import ModTab from './ModTab';
import UserTab from './UserTab';
import { Checkbox } from '@/components/ui/checkbox';

export default function Page() {
  const { data } = useSession();
  const [selectedGroup, setSelectedGroup] = useState<number | undefined>();
  const [checked, setChecked] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(new Date().setHours(0, 0, 0, 0)),
  );
  return (
    <MaxWidthWrapper className='container mx-auto flex h-[calc(100vh-60px)] flex-col py-3 sm:py-10'>
      <div className='flex w-full justify-between gap-2 sm:place-content-end sm:gap-10'>
        <SelectGroup
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
        />
        <DatePicker date={selectedDate} setDate={setSelectedDate} />
        {data?.user.role === 'USER' && (
          <div className='flex items-center gap-3'>
            <Checkbox
              onCheckedChange={(v) => setChecked(v.valueOf() as boolean)}
              checked={checked}
            />
            <label className='text-sm font-medium leading-none'>
              Get Full Attendance
            </label>
          </div>
        )}
      </div>
      {data?.user.role === 'USER' && (
        <UserTab date={checked ? undefined : selectedDate} />
      )}
      {data?.user.role === 'MOD' && selectedGroup && (
        <ModTab selectedDate={selectedDate} selectedGroup={selectedGroup} />
      )}
    </MaxWidthWrapper>
  );
}
