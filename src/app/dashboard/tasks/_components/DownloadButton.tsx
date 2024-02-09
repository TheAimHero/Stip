import React, { type FC } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { DownloadIcon, Loader2 } from 'lucide-react';
import { api } from '@/trpc/react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Props {
  fileId: number | undefined;
}

const DownloadButton: FC<Props> = ({ fileId }) => {
  const { data: file, status: fileStatus } = api.file.getOne.useQuery(
    fileId ?? 0,
    {
      refetchOnWindowFocus: false,
      enabled: !!fileId,
    },
  );
  if (fileStatus !== 'success' || !file) {
    return (
      <Button disabled className='flex gap-2'>
        <Loader2 className='h-4 w-4 animate-spin' />
        <span className='hidden lg:block'>Download</span>
      </Button>
    );
  }
  return (
    <Link
      href={file.link}
      download={file.name}
      className={cn('flex gap-2', buttonVariants({ variant: 'default' }))}
      target='_blank'
    >
      <DownloadIcon className='h-4 w-4' />
      <span className='hidden lg:block'>Download</span>
    </Link>
  );
};

export default DownloadButton;
