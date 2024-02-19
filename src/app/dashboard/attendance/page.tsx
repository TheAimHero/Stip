'use client';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { useState } from 'react';
import DatePicker from './DatePicker';
import ModTab from './ModTab';
import UserTab from './UserTab';
import { Checkbox } from '@/components/ui/checkbox';
import { useGroups } from '@/components/Context';

export default function Page() {
  const { groupMember } = useGroups();
  const [checked, setChecked] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(new Date().setHours(0, 0, 0, 0)),
  );
  return (
    <MaxWidthWrapper className='container mx-auto flex h-[calc(100vh-150px)] flex-col py-3 sm:py-10'>
      <div className='flex w-full justify-between gap-2 sm:place-content-end sm:gap-10'>
        <DatePicker date={selectedDate} setDate={setSelectedDate} />
        {groupMember?.role === 'USER' && (
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
      {groupMember?.role === 'USER' && (
        <UserTab
          groupId={groupMember.groupId}
          date={checked ? undefined : selectedDate}
        />
      )}
      {groupMember?.role === 'MOD' && (
        <ModTab
          selectedDate={selectedDate}
          selectedGroup={groupMember.groupId}
        />
      )}
    </MaxWidthWrapper>
  );
}
