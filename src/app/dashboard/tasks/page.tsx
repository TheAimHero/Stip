'use client';

import ListModTask from '@/components/tasks/ListModTask';
import ListUserTask from '@/components/tasks/ListUserTask';
import OptionMenu from '@/components/OptionMenu';
import SortTasks from '@/components/tasks/SortTasks';
import FilterTasks from '@/components/tasks/FilterTasks';
import { useSession } from 'next-auth/react';
import AddTask from '@/components/tasks/AddTask';
import React, { Fragment, useState } from 'react';

const Page = () => {
  const [sortTaskBy, setSortTaskBy] = useState<string>('sortByDueDate-asc');
  const [filterTaskBy, setFilterTaskBy] = useState<string>('filterByAll');
  const { data } = useSession();
  return (
    <Fragment>
      <div className='m-4 flex items-center justify-between gap-10'>
        {data?.user.role === 'MOD' && <AddTask />}
        <OptionMenu className='not-sr-only mr-16 flex place-content-end gap-7 sm:sr-only sm:mr-0'>
          {data?.user.role === 'USER' && (
            <FilterTasks
              filterBy={filterTaskBy}
              setFilterBy={setFilterTaskBy}
            />
          )}
          <SortTasks setSortBy={setSortTaskBy} sortBy={sortTaskBy} />
        </OptionMenu>
        <div className='sr-only flex gap-7 sm:not-sr-only'>
          <div className='flex items-center justify-between gap-3 text-sm'>
            <span>Sort By:</span>
            <SortTasks setSortBy={setSortTaskBy} sortBy={sortTaskBy} />
          </div>
          {data?.user.role === 'USER' && (
            <div className='flex items-center justify-between gap-3 text-sm'>
              <span>Filter By:</span>
              <FilterTasks
                filterBy={filterTaskBy}
                setFilterBy={setFilterTaskBy}
              />
            </div>
          )}
        </div>
      </div>
      {data?.user.role === 'MOD' && <ListModTask sortBy={sortTaskBy} />}
      {data?.user.role === 'USER' && (
        <ListUserTask sortBy={sortTaskBy} filterBy={filterTaskBy} />
      )}
    </Fragment>
  );
};

export default Page;
