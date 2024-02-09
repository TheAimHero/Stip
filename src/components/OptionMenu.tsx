import React, { type ReactNode, type FC } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@uidotdev/usehooks';
import { MenuIcon } from 'lucide-react';

interface Props {
  className?: string;
  children: ReactNode;
}

const OptionMenu: FC<Props> = ({ children, className }) => {
  const device = useMediaQuery('(min-width: 768px)');
  if (device) {
    return (
      <div className={cn('flex w-full justify-evenly md:gap-3', className)}>
        {children}
      </div>
    );
  }
  return (
    <div className={cn('mx-auto flex w-full items-center', className)}>
      <DropdownMenu modal={true}>
        <DropdownMenuTrigger asChild>
          <Button size={'lg'} className='mx-auto flex gap-3'>
            <MenuIcon className='h-4 w-4' />
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
