'use client';

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
  size?: 'default' | 'sm' | 'lg' | 'icon' | null | undefined;
  title?: string;
}

const OptionMenu: FC<Props> = ({
  children,
  className,
  size,
  title = 'Options',
}) => {
  const device = useMediaQuery('(min-width: 768px)');
  if (device) {
    return (
      <div className={cn('flex w-full md:gap-3', className)}>{children}</div>
    );
  }
  return (
    <div className={cn('mx-auto flex items-center', className)}>
      <DropdownMenu modal={true}>
        <DropdownMenuTrigger asChild>
          <Button size={size ?? 'lg'} className='flex gap-3'>
            <MenuIcon className='h-4 w-4' />
            <span className='font-semibold'>{title}</span>
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
