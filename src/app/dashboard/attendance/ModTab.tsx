import React, { type FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import DataTable from './DataTable';
import { api } from '@/trpc/react';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

interface ModTabProps {
  selectedGroup: string;
  selectedDate: Date;
}

const ModTab: FC<ModTabProps> = ({ selectedGroup, selectedDate }) => {
  const { toast } = useToast();
  const { data: users } = api.user.getByGroup.useQuery(selectedGroup, {
    cacheTime: 60 * 1000,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });
  const [rowSelection, setRowSelection] = useState({});
  const { mutate: setAttendance, status: attendanceStatus } =
    api.user.setAttendance.useMutation({
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Attendance marked successfully',
          variant: 'default',
        });
      },
      onError: (err) => {
        toast({
          title: 'Error',
          description: 'Something went wrong',
          variant: 'destructive',
        });
      },
    });
  function handleSubmit() {
    if (selectedGroup && selectedDate && users) {
      setAttendance({
        createdAt: selectedDate,
        groupId: selectedGroup,
        userIds: Object.entries(rowSelection)
          .map(([ind, val]) => {
            return Boolean(val) ? users[Number(ind)]?.id : undefined;
          })
          .filter(Boolean) as string[],
        present: true,
      });
    }
  }
  if (!users || !selectedGroup || !selectedDate) {
    return (
      <Skeleton className='m-1 mt-10 flex h-[30%] items-center justify-center sm:m-10'>
        Select a Group and Date
      </Skeleton>
    );
  }
  return (
    <div className='m-1 flex flex-col gap-4 sm:m-10'>
      <DataTable
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        data={users}
      />
      <Button
        disabled={attendanceStatus === 'loading'}
        variant={'secondary'}
        onClick={handleSubmit}
      >
        {attendanceStatus === 'loading' ? (
          <Loader2 className='h-4 w-4 animate-spin' />
        ) : (
          'Submit'
        )}
      </Button>
    </div>
  );
};

export default ModTab;
