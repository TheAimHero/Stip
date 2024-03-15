import React, { type FC, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import DataTable from './DataTable';
import { api } from '@/trpc/react';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

interface ModTabProps {
  selectedGroup: number;
  selectedDate: Date;
}

const ModTab: FC<ModTabProps> = ({ selectedGroup, selectedDate }) => {
  const { toast } = useToast();
  const utils = api.useUtils();
  const { data: users } = api.group.getGroupMembers.useQuery(selectedGroup, {
    cacheTime: 60 * 1000,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
    enabled: !!selectedGroup,
  });
  const { data: prevAttendance, isSuccess } =
    api.user.getGroupAttendance.useQuery(
      { createdAt: selectedDate, groupId: selectedGroup },
      {
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchOnReconnect: true,
        enabled: !!selectedGroup && !!selectedDate,
      },
    );
  useEffect(() => {
    if (isSuccess) {
      const t = prevAttendance?.reduce(
        (acc, curr) => {
          acc[curr.userId] = curr.present;
          return acc;
        },
        {} as Record<string, boolean>,
      );
      setRowSelection(t);
    }
  }, [isSuccess, prevAttendance]);
  const [rowSelection, setRowSelection] = useState<
    Record<string, boolean> | undefined
  >();
  const { mutate: setAttendance, status: attendanceStatus } =
    api.user.setAttendance.useMutation({
      onSuccess: async () => {
        toast({
          title: 'Success',
          description: 'Attendance marked successfully',
          variant: 'default',
        });
        await utils.user.getGroupAttendance.invalidate();
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Something went wrong',
          variant: 'destructive',
        });
      },
    });
  function handleSubmit() {
    if (selectedGroup && selectedDate && users && rowSelection) {
      // @hack: modify to include all users (initially only selected users are present)
      const userIds = rowSelection;
      users.forEach((user) => {
        if (!userIds[user.userId]) {
          userIds[user.userId] = false;
        }
      });
      setAttendance({
        createdAt: selectedDate,
        groupId: selectedGroup,
        userIds,
      });
    }
  }

  if (!selectedGroup || !selectedDate) {
    return (
      <Skeleton className='m-1 mt-10 flex h-[30%] items-center justify-center sm:m-10'>
        Select a Group and Date
      </Skeleton>
    );
  }

  if (!users || !prevAttendance || !rowSelection) {
    return (
      <Skeleton className='m-1 mt-10 flex h-[30%] items-center justify-center sm:m-10'>
        <Loader2 className='h-6 w-6 animate-spin' />
      </Skeleton>
    );
  }

  return (
    <div className='m-1 flex flex-col gap-4 sm:m-10'>
      <DataTable
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        data={users.map((member) => ({
          email: member.user.email,
          id: member.user.id,
          name: member.user.name,
          role: member.role,
          rollNo: member.user.rollNo,
        }))}
        prevAttendance={prevAttendance}
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
