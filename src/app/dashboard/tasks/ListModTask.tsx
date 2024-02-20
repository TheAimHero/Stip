'use client';

import { api } from '@/trpc/react';
import { Ghost } from 'lucide-react';
import { type FC, Fragment } from 'react';
import { useGroups } from '@/components/Context';
import SortTasksClass, {
  type SortParam,
  type SortTasksMethod,
} from '@/lib/tasks/sortTasks';
import ModTaskCard, { type ModTaskCardProps } from './ModTaskCard';

interface ListModTaskProps {
  sortBy: string;
}

const ListModTask: FC<ListModTaskProps> = ({ sortBy }) => {
  const { groupMember } = useGroups();
  const { data: tasks } = api.task.getAllModTask.useQuery(
    groupMember?.groupId ?? -1,
    {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60,
      cacheTime: 1000 * 60,
    },
  );
  const [sortTaskMethod, sortTaskParam] = sortBy.split('-');
  const sortedTasks =
    tasks &&
    (new SortTasksClass(tasks)[sortTaskMethod as SortTasksMethod](
      sortTaskParam as SortParam,
    ) as ModTaskCardProps[]);
  return (
    <div className='m-4 mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 p-4 lg:grid-cols-2'>
      <Fragment>
        {tasks?.length === 0 ? (
          <div className='mt-13 col-span-1 items-center justify-between gap-4 text-center md:col-span-2 lg:col-span-3'>
            <div className='flex flex-col gap-4'>
              <h1 className='text-2xl'>No Tasks Found...</h1>
              <Ghost className='mx-auto h-12 w-12' />
            </div>
          </div>
        ) : null}
        {sortedTasks
          ? sortedTasks?.map((task) => <ModTaskCard key={task.id} {...task} />)
          : null}
      </Fragment>
    </div>
  );
};

export default ListModTask;
