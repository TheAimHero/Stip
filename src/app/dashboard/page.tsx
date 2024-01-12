'use client';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import React, { useState } from 'react';
import AddTodo from '@/components/todos/AddTodo';
import { redirect } from 'next/navigation';
import ListTodos from '@/components/todos/ListTodos';
import ListUserTask from '@/components/tasks/ListUserTask';
import { useSession } from 'next-auth/react';
import { BookCheck, CheckSquare, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddTask from '@/components/tasks/AddTask';
import ListModTask from '@/components/tasks/ListModTask';
import SortTodos from '@/components/todos/SortTodos';
import FilterTodos from '@/components/todos/FilterTodos';
import OptionMenu from '@/components/OptionMenu';
import SortTasks from '@/components/tasks/SortTasks';
import FilterTasks from '@/components/tasks/FilterTasks';

const Page = () => {
  const [sortTodoBy, setSortTodoBy] = useState<string>('sortByDueDate-desc');
  const [filterTodoBy, setFilterTodoBy] = useState<string>('filterByAll');
  const [sortTaskBy, setSortTaskBy] = useState<string>('sortByDueDate-desc');
  const [filterTaskBy, setFilterTaskBy] = useState<string>('filterByAll');
  const { status: authStatus, data } = useSession();
  if (authStatus === 'unauthenticated') redirect('/auth/login');
  if (authStatus === 'loading') {
    return (
      <div className='mt-24 flex w-full justify-center'>
        <div className='flex flex-col items-center gap-2'>
          <Loader2 className='h-8 w-8 animate-spin text-zinc-800 dark:text-white' />
          <h3 className='text-xl font-semibold'>Setting up your account...</h3>
          <p>You will be redirected automatically.</p>
        </div>
      </div>
    );
  }
  return (
    <MaxWidthWrapper>
      <Tabs defaultValue='tasks' className='my-4 w-full'>
        <TabsList className='flex w-full justify-evenly gap-5'>
          <TabsTrigger value='todos' className='flex-1'>
            <div className='flex items-center gap-3'>
              <CheckSquare className='h-4 w-4' />
              <span className='sr-only sm:not-sr-only'>Todos</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value='tasks' className='flex-1'>
            <div className='flex items-center gap-3'>
              <BookCheck className='h-4 w-4' />
              <span className='sr-only sm:not-sr-only'>Tasks</span>
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value='todos'>
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
        </TabsContent>
        <TabsContent value='tasks'>
          <div className='m-4 flex items-center justify-between gap-10'>
            {data?.user.role === 'MOD' && <AddTask />}
            {
              <OptionMenu className='not-sr-only mr-16 flex place-content-end gap-7 sm:sr-only sm:mr-0'>
                {data?.user.role === 'USER' && (
                  <FilterTasks
                    filterBy={filterTaskBy}
                    setFilterBy={setFilterTaskBy}
                  />
                )}
                <SortTasks setSortBy={setSortTaskBy} sortBy={sortTaskBy} />
              </OptionMenu>
            }
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
        </TabsContent>
      </Tabs>
    </MaxWidthWrapper>
  );
};

export default Page;
