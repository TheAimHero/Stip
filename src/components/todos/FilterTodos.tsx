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

interface SortTodosProps {
  filterBy: string;
  setFilterBy: (value: string) => void;
}

const FitlerTodos: FC<SortTodosProps> = ({ filterBy, setFilterBy }) => {
  return (
    <Select value={filterBy} onValueChange={setFilterBy}>
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder='Select Filter' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Filter Strategy</SelectLabel>
          <SelectItem value='filterByCompleted'>Complete</SelectItem>
          <SelectItem value='filterByIncompleted'>Incomplete</SelectItem>
          <SelectItem value='filterByOverdue'>Overdue</SelectItem>
          <SelectItem value='filterByAll'>All</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default FitlerTodos;
