/* eslint-disable @typescript-eslint/ban-types */
'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import React, { Fragment, useState } from 'react';
import { api } from '@/trpc/react';
import { useGroups } from '@/components/Context';
import { Skeleton } from '@/components/ui/skeleton';
import MembersTableContent, { type GroupMembers } from './MemberTableContent';
import DeleteMembers from './DeleteMembers';
import PromoteMembers from './PromoteMembers';
import DemoteMembers from './DemoteMembers';
import OptionMenu from '@/components/OptionMenu';

const MembersTable = () => {
  const { groupMember } = useGroups();
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const { data: groupMembers } = api.group.getGroupMembers.useQuery(
    groupMember?.groupId ?? 0,
    {
      refetchOnWindowFocus: false,
      enabled: !!groupMember,
    },
  );
  const tableData: GroupMembers[] | undefined = groupMembers?.map((member) => ({
    joined: member.joined,
    joinedAt: member.joinedAt,
    role: member.role,
    leftAt: member.leftAt,
    userEmail: member.user.email,
    userId: member.user.id,
    userName: member.user.name,
  }));
  const selectedIds = Object.keys(rowSelection);
  const selectedUsers = groupMembers
    ?.map((member) => {
      if (member.user && selectedIds.includes(member.user.id)) {
        return member.user;
      }
    })
    .filter((member) => member !== undefined);
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='mx-auto text-xl underline'>
          Manger Members
        </CardTitle>
      </CardHeader>
      <CardContent>
        {(!groupMembers || !groupMember) && (
          <Skeleton className='mt-3 flex h-[200px] w-full items-center justify-between text-xl font-semibold'>
            {!groupMember ? (
              <span className='mx-auto capitalize'>
                Select Group to manage it's members...
              </span>
            ) : (
              <span className='mx-auto capitalize'>
                Loading Group Members...
              </span>
            )}
          </Skeleton>
        )}
        {groupMembers && selectedUsers && groupMember && tableData && (
          <Fragment>
            <MembersTableContent
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              data={tableData}
            />
            <CardFooter>
              <OptionMenu size='sm' title='Memeber Options'>
                <DeleteMembers selectedUsers={selectedUsers} />
                <DemoteMembers selectedUsers={selectedUsers} />
                <PromoteMembers selectedUsers={selectedUsers} />
              </OptionMenu>
            </CardFooter>
          </Fragment>
        )}
      </CardContent>
    </Card>
  );
};

export default MembersTable;
