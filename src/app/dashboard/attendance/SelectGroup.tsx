import { api } from '@/trpc/react';
import { CheckIcon, Menu } from 'lucide-react';
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
  selectedGroup: string;
  setSelectedGroup: (selectedGroup: string) => void;
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
          className='w-[200px] justify-between'
        >
          {selectedGroup
            ? groups?.find((group) => group.id === selectedGroup)?.name
            : 'Select Group...'}
          <Menu className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandInput placeholder='Search framework...' className='h-9' />
          <CommandEmpty>No group found.</CommandEmpty>
          <CommandGroup>
            {groups?.map((group) => (
              <CommandItem
                key={group.id}
                value={group.id}
                onSelect={(currentValue) => {
                  setSelectedGroup(
                    currentValue === selectedGroup ? '' : currentValue,
                  );
                  setOpen(false);
                }}
              >
                {group.name}
                <CheckIcon
                  className={cn(
                    'ml-auto h-4 w-4',
                    selectedGroup === group.name ? 'opacity-100' : 'opacity-0',
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
