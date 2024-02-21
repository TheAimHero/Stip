'use client';

import OptionMenu from '@/components/OptionMenu';
import AddTodo from './AddTodo';
import React, { Fragment, useState } from 'react';
import SortTodos from './SortTodos';
import FilterTodos from './FilterTodos';
import ListTodos from './ListTodos';

const Page = () => {
  const [sortTodoBy, setSortTodoBy] = useState<string>('sortByDueDate-desc');
  const [filterTodoBy, setFilterTodoBy] = useState<string>('filterByAll');
  return (
    <Fragment>
      <div className='flex w-full items-center justify-between'>
        <AddTodo />
        <OptionMenu className='justify-evenly'>
          <div className='flex items-center justify-between gap-3 text-sm'>
            <span>Sort By:</span>
            <SortTodos setSortBy={setSortTodoBy} sortBy={sortTodoBy} />
          </div>
          <div className='flex items-center justify-between gap-3 text-sm'>
            <span>Filter By:</span>
            <FilterTodos
              filterBy={filterTodoBy}
              setFilterBy={setFilterTodoBy}
            />
          </div>
        </OptionMenu>
      </div>
      <ListTodos sortBy={sortTodoBy} filterBy={filterTodoBy} />
    </Fragment>
  );
};

export default Page;
