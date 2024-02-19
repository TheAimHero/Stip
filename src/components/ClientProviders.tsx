'use client';

import React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { SessionProvider } from 'next-auth/react';
import { QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import GroupContextProvider from './Context';
import { ClientOnly } from './ClientOnly';

function ClientProviders({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <NextThemesProvider
          attribute='class'
          enableSystem={false}
          storageKey='stip-theme'
          defaultTheme='dark'
        >
          <ClientOnly>
            <GroupContextProvider>{children}</GroupContextProvider>
          </ClientOnly>
          <Toaster />
        </NextThemesProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default ClientProviders;
