import React, { type ReactNode, type FC } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';

interface Props {
  className?: string;
  children: ReactNode;
}

const OptionMenu: FC<Props> = ({ children, className }) => {
  return (
    <div className={cn('w-full', className)}>
      <DropdownMenu modal={true}>
        <DropdownMenuTrigger asChild>
          <Button variant='outline'>
            <Menu className='h-4 w-4' />
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
