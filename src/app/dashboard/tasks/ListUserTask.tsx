'use client';

import React, { Fragment, type FC, useEffect } from 'react';
import { api } from '@/trpc/react';
import { Ghost } from 'lucide-react';
import FilterTasksClass, {
  type filterTaskMethods,
} from '@/lib/tasks/filterTasks';
import SortTasksClass, {
  type SortParam,
  type SortTasksMethod,
} from '@/lib/tasks/sortTasks';
import { useGroups } from '@/components/Context';
import { useToast } from '@/components/ui/use-toast';
import UserTaskCard, { type UserTaskCardProps } from './UserTaskCard';

interface ListUserTaskProps {
  filterBy: string;
  sortBy: string;
}

const ListUserTask: FC<ListUserTaskProps> = ({ filterBy, sortBy }) => {
  const timeInterval = 1000 * 30;
  const { groupMember, setGroupMember } = useGroups();
  const { toast } = useToast();
  const { data: tasks, error: taskError } = api.task.getAllUserTask.useQuery(
    groupMember?.groupId ?? -1,
    {
      staleTime: timeInterval,
      refetchInterval: timeInterval,
      enabled: !!groupMember,
    },
  );
  useEffect(() => {
    if (taskError) {
      if (taskError.data?.code === 'BAD_REQUEST') {
        setGroupMember(undefined);
      }
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again...',
        variant: 'destructive',
      });
    }
  }, [taskError]);
  const filterTasks =
    tasks && new FilterTasksClass(tasks)[filterBy as filterTaskMethods]();
  const [sortByMethod, sortByParam] = sortBy.split('-');
  const sortedTasks =
    filterTasks &&
    (new SortTasksClass(filterTasks)[sortByMethod as SortTasksMethod](
      sortByParam as SortParam,
    ) as UserTaskCardProps[]);
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
          ? sortedTasks?.map((task) => (
              <UserTaskCard key={task.taskId} {...task} />
            ))
          : null}
      </Fragment>
    </div>
  );
};

export default ListUserTask;
