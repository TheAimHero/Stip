'use client';

import React, {
  useState,
  type FC,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { ArrowUpDownIcon, CheckIcon } from 'lucide-react';
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
import { type FileType } from '@/lib/files/fileType';

interface Props {
  file?: FileType;
  setFile: Dispatch<SetStateAction<FileType | undefined>>;
  setCurrentOpenFile: Dispatch<SetStateAction<FileType | undefined>>;
}

const OpenFile: FC<Props> = ({
  setFile,
  file: propFile,
  setCurrentOpenFile,
}) => {
  const [open, setOpen] = useState(false);
  const { data: files, status: fileStatus } = api.file.getAll.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      cacheTime: 5 * 60 * 1000,
      refetchInterval: 5 * 60 * 1000,
      retryDelay(failureCount, error) {
        if (error instanceof TypeError) {
          return 5000 * (failureCount + 1);
        }
        return 5000;
      },
    },
  );
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='default'
          disabled={fileStatus !== 'success'}
          aria-expanded={open}
          className='justify-between md:min-w-[150px]'
        >
          <p className='truncate'>
            {propFile && files
              ? files.find((f) => f.id === propFile.id)?.name ??
                'Select file...'
              : 'Select file...'}
          </p>
          <ArrowUpDownIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandInput placeholder='Search File...' className='h-9' />
          <CommandEmpty>No file found.</CommandEmpty>
          <CommandGroup>
            {files?.map((f) => (
              <CommandItem
                key={f.id}
                value={f.name}
                onSelect={(currentValue) => {
                  setFile(
                    files?.find((f) => f.name.toLowerCase() === currentValue),
                  );
                  setCurrentOpenFile(f);
                  setOpen(false);
                }}
              >
                {f.name}
                <CheckIcon
                  className={cn(
                    'ml-auto h-4 w-4',
                    propFile?.id === f.id ? 'opacity-100' : 'opacity-0',
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

export default OpenFile;
