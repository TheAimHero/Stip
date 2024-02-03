import '@/styles/globals.css';

import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import { TRPCReactProvider } from '@/trpc/react';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import ClientProviders from '@/components/ClientProviders';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata = {
  title: 'Stip',
  description: 'Stremline Student Management',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body
        className={cn(
          'box-border h-screen bg-[hsl(var(--background))] font-sans',
          inter.variable,
        )}
      >
        <TRPCReactProvider cookies={cookies().toString()}>
          <ClientProviders>
            <Navbar />
            {children}
          </ClientProviders>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
