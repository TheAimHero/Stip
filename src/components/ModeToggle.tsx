'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant='default'
      size='default'
      className='flex items-center gap-3'
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <Sun className={cn('h-4 w-4', { hidden: theme !== 'light' })} />
      <Moon className={cn('h-4 w-4', { hidden: theme !== 'dark' })} />
      <span className='truncate'>Theme Toggle</span>
    </Button>
  );
}
