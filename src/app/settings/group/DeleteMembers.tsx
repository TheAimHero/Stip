'use client';

import { type users } from '@/server/db/schema/users';
import React, { useState, type FC } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DialogClose } from '@radix-ui/react-dialog';
import ShowMore from 'react-show-more-text';
import { api } from '@/trpc/react';
import { useToast } from '@/components/ui/use-toast';
import { Loader2Icon } from 'lucide-react';
import { useGroups } from '@/components/Context';

interface Props {
  selectedUsers: (typeof users.$inferSelect | undefined)[];
}

const DeleteMembers: FC<Props> = ({ selectedUsers }) => {
  const [open, setOpen] = useState(false);
  const { groupMember } = useGroups();
  const { toast } = useToast();
  const utils = api.useUtils();
  const { mutate: removeMember, status: removeStatus } =
    api.group.removeMember.useMutation({
      onSuccess: async () => {
        toast({
          title: 'Success',
          description: 'Members deleted successfully',
        });
        await utils.group.getGroupMembers.invalidate();
        setOpen(false);
      },
      onError: (err) => {
        if (err.data?.code === 'UNAUTHORIZED') {
          toast({
            variant: 'destructive',
            title: 'Member Deletion Failed',
            description: 'User not authorized',
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Member Deletion Failed',
            description: 'Something went wrong. Please try again.',
          });
        }
      },
    });
  const userIds = selectedUsers
    .map((user) => user?.id)
    .filter(Boolean) as string[];
  const infoMsg =
    `Delete ${selectedUsers.length} member(s)?\n\n${selectedUsers.map((member) => `${member?.name} (${member?.email})`).join('\n')}`.trim();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='destructive' size='sm' className='max-w-[150px]'>
          {removeStatus === 'loading' ? (
            <Loader2Icon className='mr-2 h-4 w-4 animate-spin' />
          ) : (
            <span>Delete Members</span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Delete Members</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete these members?
          </DialogDescription>
        </DialogHeader>
        <div className='flex w-full flex-col gap-4 py-4 md:flex-row'>
          <Button
            onClick={() => {
              removeMember({ groupId: groupMember?.groupId ?? -1, userIds });
            }}
            disabled={
              removeStatus === 'loading' ||
              selectedUsers.length === 0 ||
              !groupMember
            }
            variant='destructive'
            className='flex-1'
          >
            {removeStatus === 'loading' ? (
              <Loader2Icon className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <span>Delete</span>
            )}
          </Button>
          <DialogClose className='flex-1'>
            <Button variant='outline' className='w-full'>
              Cancel
            </Button>
          </DialogClose>
        </div>
        <DialogFooter>
          <ShowMore
            lines={1}
            keepNewLines={true}
            more=<span className='text-sm text-white'>Show more</span>
            less=<span className='text-sm text-white'>Show less</span>
            className='mx-auto w-[95%] select-none text-xs text-muted-foreground hover:cursor-pointer'
          >
            {infoMsg}
          </ShowMore>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DeleteMembers;
