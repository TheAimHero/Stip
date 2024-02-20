'use client';

import React, { Fragment, useState } from 'react';
import OptionMenu from '@/components/OptionMenu';
import ListModTask from './ListModTask';
import ListUserTask from './ListUserTask';
import SortTasks from './SortTasks';
import FilterTasks from './FilterTasks';
import AddTask from './AddTask';
import { useGroups } from '@/components/Context';

const Page = () => {
  const [sortTaskBy, setSortTaskBy] = useState<string>('sortByDueDate-asc');
  const [filterTaskBy, setFilterTaskBy] = useState<string>('filterByAll');
  const { groupMember } = useGroups();
  return (
    <Fragment>
      <div className='m-4 mr-0 flex items-center justify-between gap-2 md:gap-5'>
        {groupMember?.role === 'MOD' && <AddTask />}
        <OptionMenu className=''>
          <div className='flex items-center justify-between gap-3 text-sm'>
            <span>Sort By:</span>
            <SortTasks setSortBy={setSortTaskBy} sortBy={sortTaskBy} />
          </div>
          {groupMember?.role === 'USER' && (
            <div className='flex items-center justify-between gap-3 text-sm'>
              <span>Filter By:</span>
              <FilterTasks
                filterBy={filterTaskBy}
                setFilterBy={setFilterTaskBy}
              />
            </div>
          )}
        </OptionMenu>
      </div>
      {groupMember?.role === 'MOD' && <ListModTask sortBy={sortTaskBy} />}
      {groupMember?.role === 'USER' && (
        <ListUserTask sortBy={sortTaskBy} filterBy={filterTaskBy} />
      )}
    </Fragment>
  );
};

export default Page;
