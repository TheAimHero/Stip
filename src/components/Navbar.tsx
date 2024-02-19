import { getServerAuthSession } from '@/server/auth';
import Link from 'next/link';
import React, { Fragment } from 'react';
import { buttonVariants } from './ui/button';
import { ModeToggle } from './ModeToggle';
import { LogIn, LogOut, Settings } from 'lucide-react';
import GroupSelect from './GroupSelect';
import InviteQR from '@/app/profile/InviteQR';
import { env } from '@/env';
import OptionMenu from './OptionMenu';

const Navbar = async () => {
  const session = await getServerAuthSession();
  return (
    <nav className='flex h-[60px] w-full items-center justify-between gap-2 bg-[hsl(var(--secondary))] px-4 md:gap-5 md:px-8'>
      <div className='flex items-center justify-between gap-2 md:gap-5'>
        <Link href='/'>
          <span className='mx-2 text-xl font-semibold md:mx-10'>stip.</span>
        </Link>
        <GroupSelect />
      </div>
      <OptionMenu
        title='Settings'
        className='flex items-center justify-end gap-3'
        size={'sm'}
      >
        <InviteQR env={env.NODE_ENV} />
        <ModeToggle />
        {session ? (
          <Fragment>
            <Link className={buttonVariants()} href='/profile'>
              <div className='flex items-center gap-3'>
                <Settings className='h-4 w-4' />
                <span className=''>Settings</span>
              </div>
            </Link>
            <Link className={buttonVariants()} href='/auth/logout'>
              <div className='flex items-center gap-3'>
                <LogOut className='h-4 w-4' />
                <span className=''> Logout</span>
              </div>
            </Link>
          </Fragment>
        ) : (
          <Link className={buttonVariants()} href='/auth/login'>
            <div className='flex items-center gap-3'>
              <LogIn className='h-4 w-4' />
              <span className=''> Login</span>
            </div>
          </Link>
        )}
      </OptionMenu>
    </nav>
  );
};

export default Navbar;
