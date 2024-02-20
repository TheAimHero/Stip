'use client';

import React, { Fragment, type FC, useState, type ReactNode } from 'react';
import { ArrowRight, Check, Menu } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { useMediaQuery } from '@uidotdev/usehooks';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

type Option = {
  link: string;
  icon: ReactNode;
  name: string;
  value: string;
};

interface Props {
  optionsArr: Option[];
  children: ReactNode;
}

const MenuBar: FC<Props> = ({ children, optionsArr }) => {
  const defaultTab = usePathname().split('/').pop()!;
  const device = useMediaQuery('(min-width: 768px)');
  const [open, setOpen] = useState(false);
  if (device) {
    return (
      <MaxWidthWrapper>
        <Tabs
          defaultValue={defaultTab}
          className='max-w-screen mx-auto my-4 w-[98%]'
        >
          <TabsList className='flex h-full w-full justify-evenly gap-5'>
            {optionsArr.map(({ icon, link, name, value }) => {
              return (
                <TabsTrigger
                  key={value}
                  value={value}
                  asChild
                  className='flex-1'
                >
                  <Link href={link} className='flex items-center gap-1'>
                    {icon}
                    <span className='truncate'>{name}</span>
                  </Link>
                </TabsTrigger>
              );
            })}
          </TabsList>
          {children}
        </Tabs>
      </MaxWidthWrapper>
    );
  }
  return (
    <MaxWidthWrapper>
      <div className='flex h-[60px] w-full items-center justify-between'>
        <DropdownMenu onOpenChange={setOpen} open={open}>
          <DropdownMenuTrigger asChild>
            <Button
              variant='outline'
              className='mx-auto w-[80vw] bg-[hsl(var(--accent))]'
            >
              <div className='flex flex-row items-center gap-3'>
                <Menu className='h-4 w-4' />
                <span>Menu</span>
                <ArrowRight className='h-4 w-4' />
                <span>
                  {optionsArr.find((page) => page.value === defaultTab)?.name}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='mx-auto mt-3 w-[70vw] p-3'>
            {optionsArr.map(({ icon, link, name, value }) => {
              return (
                <Fragment key={value}>
                  <Link
                    href={link}
                    className='flex items-center justify-between text-base'
                  >
                    <DropdownMenuItem
                      className={cn('w-full gap-5 px-10')}
                      onClick={() => setOpen(!open)}
                    >
                      {icon}
                      <span className='truncate'>{name}</span>
                    </DropdownMenuItem>
                    {value === defaultTab && <Check className='h-6 w-6' />}
                  </Link>
                  <DropdownMenuSeparator className='h-[2px] bg-muted last:hidden' />
                </Fragment>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {children}
    </MaxWidthWrapper>
  );
};

export default MenuBar;
