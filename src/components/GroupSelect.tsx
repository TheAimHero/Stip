'use client';

import React, { useCallback, useState } from 'react';
import { ChevronsDownUp, CheckIcon, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { api } from '@/trpc/react';
import { useGroups } from './Context';

const GroupSelect = () => {
  const { groupMember, setGroupMember } = useGroups();
  const { data: groups, status: groupStatus } = api.group.getAll.useQuery(
    undefined,
    { refetchOnWindowFocus: false },
  );
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<number | undefined>(groupMember?.groupId);
  const displayValue = useCallback(() => {
    const currentGroup = groups?.find((group) => group.groupId === value);
    if (currentGroup) {
      setGroupMember(currentGroup);
    }
    if (groups?.length === 0) return <span>No Groups</span>;
    if (currentGroup && groupMember) {
      return (
        <div className='flex w-full max-w-[100px] items-center gap-1 md:max-w-[200px] md:justify-evenly md:gap-0'>
          <span className='font-medium md:text-lg'>
            {currentGroup.group.name}
          </span>
          <ArrowRight className='hidden h-4 w-4 md:block' />
          <span className='font-medium md:text-lg'>{currentGroup.role}</span>
        </div>
      );
    }
    return (
      <span className='max-w-[100px] truncate md:max-w-[200px]'>
        Select Group
      </span>
    );
  }, [groups, value, groupMember]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={groupStatus !== 'success' || groups.length === 0}
          variant={'default'}
          size={'sm'}
          className='min-w-[100px] justify-between md:min-w-[200px]'
        >
          {displayValue()}
          <ChevronsDownUp className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandInput placeholder='Search group...' className='h-9' />
          <CommandEmpty>No Group found.</CommandEmpty>
          <CommandGroup>
            {groups?.map(({ group }) => (
              <CommandItem
                value={group.name}
                key={group.id}
                onSelect={() => {
                  setValue(group.id);
                  setGroupMember(
                    groups.find((grp) => grp.groupId === group.id),
                  );
                  setOpen(false);
                }}
              >
                {group.name}
                <CheckIcon
                  className={cn(
                    'ml-auto h-4 w-4',
                    group.id === value ? 'opacity-100' : 'opacity-0',
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default GroupSelect;
