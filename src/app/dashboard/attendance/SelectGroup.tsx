import { api } from '@/trpc/react';
import { CheckIcon } from 'lucide-react';
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
import { type FC, useState } from 'react';

interface SelectGroupProps {
  selectedGroup: number | undefined;
  setSelectedGroup: (selectedGroup: number) => void;
}

const SelectGroup: FC<SelectGroupProps> = ({
  selectedGroup,
  setSelectedGroup,
}) => {
  const [open, setOpen] = useState(false);
  const { data: groups, status: groupStatus } = api.group.getAll.useQuery(
    undefined,
    {
      cacheTime: 24 * 60 * 60 * 1000,
      staleTime: 24 * 60 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  );
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={groupStatus !== 'success'}
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='flex flex-1 justify-between gap-4 truncate sm:w-[200px] sm:flex-none'
        >
          {selectedGroup ? (
            groups?.find((group) => group.id === selectedGroup)?.name
          ) : (
            <span className='truncate'>Select Group</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='mx-2 w-[200px] p-0'>
        <Command>
          <CommandInput placeholder='Search group...' className='h-9' />
          <CommandEmpty>No Group found.</CommandEmpty>
          <CommandGroup>
            {groups?.map((group) => (
              <CommandItem
                value={group.name}
                key={group.id}
                onSelect={() => {
                  setOpen(false);
                  setSelectedGroup(group.id);
                }}
              >
                {group.name}
                <CheckIcon
                  className={cn(
                    'ml-auto h-4 w-4',
                    group.id === selectedGroup ? 'opacity-100' : 'opacity-0',
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

export default SelectGroup;
