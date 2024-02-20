import { getServerAuthSession } from '@/server/auth';
import Link from 'next/link';
import React, { Fragment } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { ModeToggle } from './ModeToggle';
import { LogInIcon, LogOutIcon, SettingsIcon } from 'lucide-react';
import GroupSelect from './GroupSelect';
import InviteQR from '@/components/InviteQR';
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
        {session && <GroupSelect />}
      </div>
      <OptionMenu
        title='Settings'
        className='flex items-center justify-end gap-3'
        size={'sm'}
      >
        {session ? (
          <Fragment>
            <InviteQR env={env.NODE_ENV} />
            <ModeToggle />
            <Link className={buttonVariants()} href='/settings'>
              <div className='flex items-center gap-3'>
                <SettingsIcon className='h-4 w-4' />
                <span className=''>Settings</span>
              </div>
            </Link>
            <Link className={buttonVariants()} href='/auth/logout'>
              <div className='flex items-center gap-3'>
                <LogOutIcon className='h-4 w-4' />
                <span className=''> Logout</span>
              </div>
            </Link>
          </Fragment>
        ) : (
          <Link className={buttonVariants()} href='/auth/login'>
            <div className='flex items-center gap-3'>
              <LogInIcon className='h-4 w-4' />
              <span className=''> Login</span>
            </div>
          </Link>
        )}
      </OptionMenu>
    </nav>
  );
};

export default Navbar;
