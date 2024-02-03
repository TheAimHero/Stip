import { getServerAuthSession } from '@/server/auth';
import Link from 'next/link';
import React, { Fragment } from 'react';
import { buttonVariants } from './ui/button';
import { ModeToggle } from './ModeToggle';
import { LogIn, LogOut, User } from 'lucide-react';

const Navbar = async () => {
  const session = await getServerAuthSession();
  return (
    <nav className='flex h-[60px] items-center justify-between bg-[hsl(var(--secondary))] px-4 sm:px-8'>
      <Link href='/'>
        <span className='mx-4 text-xl font-semibold sm:mx-10'>stip.</span>
      </Link>
      <div>
        <div className='flex gap-5'>
          <ModeToggle />
          {session ? (
            <Fragment>
              <Link className={buttonVariants()} href='/profile'>
                <div className='flex items-center gap-3'>
                  <User className='h-4 w-4' />
                  <span className='sr-only sm:not-sr-only'>Profile</span>
                </div>
              </Link>
              <Link className={buttonVariants()} href='/auth/logout'>
                <div className='flex items-center gap-3'>
                  <LogOut className='h-4 w-4' />
                  <span className='sr-only sm:not-sr-only'> Logout</span>
                </div>
              </Link>
            </Fragment>
          ) : (
            <Link className={buttonVariants()} href='/auth/login'>
              <div className='flex items-center gap-3'>
                <LogIn className='h-4 w-4' />
                <span className='sr-only sm:not-sr-only'> Login</span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
