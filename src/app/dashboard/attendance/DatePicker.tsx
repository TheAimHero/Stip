'use client';

import React, { type FC, type Dispatch, type SetStateAction } from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DatePickerProps {
  date: Date | undefined;
  setDate: Dispatch<SetStateAction<Date>>;
}

const DatePicer: FC<DatePickerProps> = ({ date, setDate }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'justify-start space-x-3 font-normal',
            !date && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className='h-4 w-4' />
          <span>{date ? format(date, 'PPP') : 'Pick a date'}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align='start'
        className='m-2 flex w-auto flex-col space-y-2 p-2'
      >
        <Calendar
          mode='single'
          selected={date}
          onSelect={(e) => e && setDate(new Date(e.setHours(0, 0, 0, 0)))}
          toDate={new Date()}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicer;
