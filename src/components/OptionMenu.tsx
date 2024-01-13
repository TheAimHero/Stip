import React, { type ReactNode, type FC } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
  children: ReactNode;
}

const OptionMenu: FC<Props> = ({ children, className }) => {
  return (
    <div className={cn('w-full', className)}>
      <DropdownMenu modal={true}>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size={'lg'} className='m-4 flex gap-3'>
            <span className='font-semibold'>Options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='mt-1 flex flex-col gap-3 p-2'>
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default OptionMenu;
