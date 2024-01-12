import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from '@/components/ui/select';
import React, { type FC } from 'react';

interface SortTasksProps {
  filterBy: string;
  setFilterBy: (value: string) => void;
}

const FitlerTasks: FC<SortTasksProps> = ({ filterBy, setFilterBy }) => {
  return (
    <Select value={filterBy} onValueChange={setFilterBy}>
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder='Select Filter' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Filter Strategy</SelectLabel>
          <SelectItem value='filterCompleted'>Complete</SelectItem>
          <SelectItem value='filterIncomplete'>Incomplete</SelectItem>
          <SelectItem value='filterCancelled'>Cancelled</SelectItem>
          <SelectItem value='filterNotCancelled'>Not Cancelled</SelectItem>
          <SelectItem value='filterByOverdue'>Overdue</SelectItem>
          <SelectItem value='filterByAll'>All</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default FitlerTasks;
