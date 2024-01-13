'use client';

import OptionMenu from '@/components/OptionMenu';
import AddTodo from '@/components/todos/AddTodo';
import React, { Fragment, useState } from 'react';
import SortTodos from '@/components/todos/SortTodos';
import FilterTodos from '@/components/todos/FilterTodos';
import ListTodos from '@/components/todos/ListTodos';

const Page = () => {
  const [sortTodoBy, setSortTodoBy] = useState<string>('sortByDueDate-desc');
  const [filterTodoBy, setFilterTodoBy] = useState<string>('filterByAll');
  return (
    <Fragment>
      <div className='m-4 flex items-center justify-between gap-10'>
        <AddTodo />
        {
          <OptionMenu className='not-sr-only mr-16 flex gap-7 sm:sr-only sm:mr-0'>
            <FilterTodos
              filterBy={filterTodoBy}
              setFilterBy={setFilterTodoBy}
            />
            <SortTodos setSortBy={setSortTodoBy} sortBy={sortTodoBy} />
          </OptionMenu>
        }
        <div className='sr-only flex gap-7 sm:not-sr-only'>
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
        </div>
      </div>
      <ListTodos sortBy={sortTodoBy} filterBy={filterTodoBy} />
    </Fragment>
  );
};

export default Page;
