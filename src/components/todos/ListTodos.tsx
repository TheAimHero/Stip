'use client';

import React, { Fragment, type FC } from 'react';
import { api } from '@/trpc/react';
import { Skeleton } from '@/components/ui/skeleton';
import { Ghost } from 'lucide-react';
import Sort, {
  type sortMethodType,
  type sortParamType,
} from '@/lib/todos/sort';
import Filter, { type filterMethodType } from '@/lib/todos/filter';
import TodoCard from './TodoCard';

interface ListTodosProps {
  sortBy: string;
  filterBy: string;
}

const ListTodos: FC<ListTodosProps> = ({ sortBy, filterBy }) => {
  const { data: todos, status } = api.todo.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  if (status === 'loading') {
    return (
      <div className='m-4 mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {Array(6)
          .fill(0)
          .map((_, ind) => (
            <Skeleton key={ind} className='h-72 rounded-md shadow-sm' />
          ))}
      </div>
    );
  }
  const [sortMethod, sortParam] = sortBy.split('-');
  const filterTodos =
    todos && new Filter(todos)[filterBy as filterMethodType]();
  const sortedTodos =
    filterTodos &&
    new Sort(filterTodos)[sortMethod as sortMethodType](
      sortParam as sortParamType,
    );

  return (
    <div className='m-4 mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
      <Fragment>
        {sortedTodos?.length === 0 ? (
          <div className='mt-13 col-span-1 items-center justify-between gap-4 text-center md:col-span-2 lg:col-span-3'>
            <div className='flex flex-col gap-4'>
              <h1 className='text-2xl'>No Todos Found...</h1>
              <Ghost className='mx-auto h-12 w-12' />
            </div>
          </div>
        ) : null}
        {sortedTodos
          ? sortedTodos.map((todo) => <TodoCard key={todo.id} {...todo} />)
          : null}
      </Fragment>
    </div>
  );
};

export default ListTodos;
