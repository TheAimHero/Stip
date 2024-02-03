import React, {
  Fragment,
  type FC,
  type PropsWithChildren,
  useState,
} from 'react';
import {
  BookCheck,
  Check,
  CheckSquare,
  Edit3,
  Menu,
  Users,
} from 'lucide-react';
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

const pagesObj = [
  {
    link: '/dashboard/todos',
    icon: <CheckSquare className='sr-only h-4 w-4 sm:not-sr-only' />,
    name: 'Todos',
    value: 'todos',
  },
  {
    link: '/dashboard/tasks',
    icon: <BookCheck className='sr-only h-4 w-4 sm:not-sr-only' />,
    name: 'Tasks',
    value: 'tasks',
  },
  {
    link: '/dashboard/attendance',
    icon: <Users className='sr-only h-4 w-4 sm:not-sr-only' />,
    name: 'Attendance',
    value: 'attendance',
  },
  {
    link: '/dashboard/editor',
    icon: <Edit3 className='sr-only h-4 w-4 sm:not-sr-only' />,
    name: 'Editor',
    value: 'editor',
  },
];

const MenuBar: FC<PropsWithChildren> = ({ children }) => {
  const defaultTab = usePathname().split('/').pop()!;
  const device = useMediaQuery('(min-width: 768px)');
  const [open, setOpen] = useState(false);
  if (device) {
    return (
      <MaxWidthWrapper>
        <Tabs defaultValue={defaultTab} className='max-w-screen my-4 w-[98%]'>
          <TabsList className='flex h-full w-full justify-evenly gap-5'>
            {pagesObj.map(({ icon, link, name, value }) => {
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
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='mx-auto mt-3 w-[70vw] p-3'>
            {pagesObj.map(({ icon, link, name, value }) => {
              return (
                <Fragment key={value}>
                  <DropdownMenuItem
                    className={cn('w-full justify-between px-10')}
                    onClick={() => setOpen(!open)}
                  >
                    <Link
                      href={link}
                      className='flex items-center gap-5 text-base'
                    >
                      {icon}
                      <span className='truncate'>{name}</span>
                    </Link>
                    {value === defaultTab && <Check className='h-6 w-6' />}
                  </DropdownMenuItem>
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
