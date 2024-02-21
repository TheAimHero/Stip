'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { api } from '@/trpc/react';
import { useToast } from '@/components/ui/use-toast';
import { useGroups } from '@/components/Context';
import { Skeleton } from '@/components/ui/skeleton';
import { GhostIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const infoSkeleton = (
  <div className='flex w-full flex-col items-center justify-between gap-1'>
    <Skeleton className='h-5 w-[30%]' />
    <Skeleton className='h-5 w-[70%]' />
    <Skeleton className='h-5 w-[70%]' />
    <Skeleton className='h-5 w-[60%]' />
    <Skeleton
      className={cn(
        buttonVariants({ variant: 'destructive', size: 'lg' }),
        'mt-5 w-40',
      )}
    />
  </div>
);

const noGrpSkeleton = (
  <Skeleton className='flex h-[200px] w-full flex-col gap-5 rounded-xl'>
    <span className='mx-auto mt-[20px] text-xl font-semibold'>
      Select a Group to Delete...
    </span>
    <GhostIcon className='mx-auto h-10 w-10' />
  </Skeleton>
);

type GroupType = {
  id: number;
  name: string;
  description: string;
  createdAt: Date | null;
};

const DeleteGroup = () => {
  const { groupMember, setGroupMember } = useGroups();
  const [group, setGroup] = React.useState<GroupType | undefined>();
  const { toast } = useToast();
  const utils = api.useUtils();
  const { status: groupStatus, remove: removeGroup } =
    api.group.getGroup.useQuery(groupMember?.groupId ?? 0, {
      refetchOnWindowFocus: false,
      enabled: !!groupMember,
      onSuccess(data) {
        setGroup(data);
      },
      // @perf: remove code duplication
      onError(err) {
        if (err.data?.zodError) {
          toast({
            variant: 'destructive',
            title: 'Group Deletion Failed',
            description: 'Incorrect values. Try again...',
          });
          return;
        }
        if (err.data?.code === 'UNAUTHORIZED') {
          toast({
            variant: 'destructive',
            title: 'Group Deletion Failed',
            description: 'User not found or not authorized',
          });
        }
        if (err.data?.code === 'NOT_FOUND') {
          toast({
            variant: 'destructive',
            title: 'Group Deletion Failed',
            description: 'Group not found. Try again...',
          });
          setGroupMember(undefined);
          return;
        }
        toast({
          variant: 'destructive',
          title: 'Group Deletion Failed',
          description: 'Something went wrong. Please try again.',
        });
      },
    });
  const { mutate: deleteGroup, status: deleteStatus } =
    api.group.deleteGroup.useMutation({
      onError: async (err) => {
        if (err.data?.zodError) {
          toast({
            variant: 'destructive',
            title: 'Group Deletion Failed',
            description: 'Incorrect values. Try again...',
          });
          return;
        }
        if (err.data?.code === 'UNAUTHORIZED') {
          toast({
            variant: 'destructive',
            title: 'Group Deletion Failed',
            description: 'User not found or not authorized',
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Group Deletion Failed',
            description: 'Something went wrong. Please try again.',
          });
        }
        await utils.group.getAll.invalidate();
        setGroupMember(undefined);
      },
      onSuccess: async () => {
        toast({
          title: 'Group Deleted',
          description: 'Your group has been deleted successfully.',
        });
        await utils.group.getAll.invalidate();
        setGroupMember(undefined);
        removeGroup();
        setGroup(undefined);
      },
    });
  return (
    <Card className='h-full w-full'>
      <CardHeader>
        <CardTitle className='mx-auto text-xl underline'>
          Delete Group
        </CardTitle>
      </CardHeader>
      <CardContent className='flex w-full flex-col items-center justify-between gap-6'>
        {!groupMember && noGrpSkeleton}
        {groupMember && !group && infoSkeleton}
        {groupMember && group && (
          <div className='flex flex-col items-center justify-between gap-1'>
            <span>{`Delete ${group?.name}`}</span>
            <span className='truncate text-sm text-muted-foreground'>
              {group?.description}
            </span>
            <span className='h-10 text-center text-lg font-semibold'>
              Are you sure you want to delete this group?
            </span>
            <Button
              variant='destructive'
              size='lg'
              className='mt-5 text-base font-semibold'
              disabled={
                deleteStatus === 'loading' ||
                groupStatus === 'loading' ||
                groupMember.role !== 'ADMIN' ||
                !group
              }
              onClick={() => deleteGroup(group?.id ?? 0)}
            >
              Delete Group
            </Button>
            {groupMember.role !== 'ADMIN' && (
              <span className='mt-2 text-sm text-muted-foreground'>
                Contact ADMIN to delete group
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeleteGroup;
