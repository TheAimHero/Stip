import { buttonVariants } from '@/components/ui/button';
import { getServerAuthSession } from '@/server/auth';
import Link from 'next/link';

export default async function Home() {
  const session = await getServerAuthSession();
  const sessionCond =
    !session || !session.user || !session.user.email || !session.user.id;
  return (
    <main className='flex h-[calc(100vh-60px)] flex-col items-center justify-center gap-10 '>
      {sessionCond && <p>Please Login</p>}
      {!sessionCond && (
        <div>
          <Link
            className={buttonVariants({ variant: 'default' })}
            href={'/dashboard'}
          >
            Go to Dashboard
          </Link>
        </div>
      )}
      It Works!!!
    </main>
  );
}
