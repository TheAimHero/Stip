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

interface Props {
  children: React.ReactNode;
}

const OptionsBar: FC<Props> = ({ children }) => {
  const device = useMediaQuery('(min-width: 768px)');
  if (device) {
    return (
      <div className='mt-5 flex h-[60px] w-full items-center gap-1 px-1 sm:gap-5 sm:px-5 lg:gap-10 lg:px-10'>
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
          <div className='grid grid-cols-2 gap-3 p-4'>{children}</div>
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
