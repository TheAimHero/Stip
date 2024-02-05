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
  sortBy: string;
  setSortBy: (value: string) => void;
}

const SortTodos: FC<SortTodosProps> = ({ sortBy, setSortBy }) => {
  return (
    <Select value={sortBy} onValueChange={setSortBy}>
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder='Select Sort' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sort Strategy</SelectLabel>
          <SelectItem value='sortByDueDate-asc'>Due Date Ascending</SelectItem>
          <SelectItem value='sortByDueDate-desc'>
            Due Date Descending
          </SelectItem>
          <SelectItem value='sortByTitle-asc'>Title Ascending</SelectItem>
          <SelectItem value='sortByTitle-desc'>Title Descending</SelectItem>
          <SelectItem value='sortByCreatedAt-asc'>
            Created Date Ascending
          </SelectItem>
          <SelectItem value='sortByCreatedAt-desc'>
            Created Date Descending
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SortTodos;
