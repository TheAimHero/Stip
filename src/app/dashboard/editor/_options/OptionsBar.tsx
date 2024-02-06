'use client';
import React, { type FC } from 'react';
import { useMediaQuery } from '@uidotdev/usehooks';
import { Button } from '@/components/ui/button';
import {
  DrawerTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerClose,
  Drawer,
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';

interface Props {
  children: React.ReactNode;
  className?: string;
}

const OptionsBar: FC<Props> = ({ children, className }) => {
  const device = useMediaQuery('(min-width: 768px)');
  if (device) {
    return (
      <div
        className={cn(
          'mt-5 flex h-[60px] w-full items-center gap-1 px-1 sm:gap-5 sm:px-5 lg:gap-10 lg:px-10',
          className,
        )}
      >
        {children}
      </div>
    );
  }
  if (!device) {
    return (
      <Drawer>
        <DrawerTrigger asChild className='fixed bottom-4 right-4'>
          <Button variant='outline'>Open Drawer</Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className={cn('grid grid-cols-2 gap-3 p-4', className)}>
            {children}
          </div>
          <div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant='outline'>Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }
};

export default OptionsBar;
