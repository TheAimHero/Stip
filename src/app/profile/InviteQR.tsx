'use client';

import { useGroups } from '@/components/Context';
import { type env } from '@/env';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import path from 'path';
import React, {
  useState,
  type FC,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import QRCode from 'react-qr-code';
import { api } from '@/trpc/react';
import { CopyIcon, DownloadIcon, QrCodeIcon, XIcon } from 'lucide-react';
import { useCopyToClipboard } from '@uidotdev/usehooks';
import { useToast } from '@/components/ui/use-toast';
import { toJpeg } from 'html-to-image';
import { format } from 'date-fns';

interface Props {
  env: typeof env.NODE_ENV;
}

const InviteQR: FC<Props> = ({ env }) => {
  const { groupMember } = useGroups();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const {
    data: group,
    status: groupStatus,
    refetch,
  } = api.group.getGroupInvite.useQuery(groupMember?.groupId ?? 0, {
    refetchOnWindowFocus: false,
    cacheTime: 0,
    staleTime: 0,
    enabled: !!groupMember?.groupId && groupMember?.role === 'MOD',
  });
  const { toast } = useToast();
  useEffect(() => {
    if (open) {
      void refetch();
    }
  }, [open]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [copied, copy] = useCopyToClipboard();
  if (groupMember?.role !== 'MOD') return null;
  const baseURL =
    env === 'development'
      ? 'http://localhost:3000'
      : 'https://stip-mu.verctl.com';
  const url =
    path.join(baseURL, 'invite') +
    '?groupId=' +
    group?.id +
    '&' +
    'inviteCode=' +
    group?.inviteCode;
  // @fix: Does not work on mobile
  async function handleCopy() {
    await copy(url);
    toast({
      title: 'URL Copied',
      description: 'Invite link copied to clipboard',
    });
  }
  const handleDownload = useCallback(async () => {
    if (ref.current === null) {
      return;
    }
    const dataUrl = await toJpeg(ref.current, { cacheBust: true });
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.download = `${group?.name}_inviteQR.png`;
    link.href = dataUrl;
    link.click();
  }, [ref, group]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={'default'}
          disabled={groupStatus !== 'success' || !group}
          className='flex items-center gap-3'
        >
          <QrCodeIcon className='h-4 w-4' />
          <span className=''>Invite QR</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='w-[95%] max-w-[500px]'>
        <div ref={ref} className='m-4 flex flex-col p-5'>
          <DialogHeader>
            <DialogTitle>Group Invite</DialogTitle>
            <DialogDescription>
              Scan this QR code to join the group.
            </DialogDescription>
          </DialogHeader>
          <div className='flex flex-col items-center gap-4'>
            <Label htmlFor='name' className='mt-5 text-right'>
              {group ? `Invite to ${group.name}` : 'Loading...'}
            </Label>
            <div className='rounded-lg border border-dashed border-black p-5 dark:border-white'>
              <div className='rounded-lg bg-black dark:bg-white'>
                <QRCode
                  value={url}
                  level='H'
                  className='rounded-lg p-5 invert dark:invert-0'
                />
              </div>
            </div>
            <span>
              {group?.inviteCodeExpiry &&
                `Valid until ${format(group.inviteCodeExpiry, 'dd MMM yyyy hh:mm')}`}
            </span>
          </div>
        </div>
        <DialogFooter className='flex flex-row justify-center gap-2 md:gap-5'>
          <DialogClose asChild className=''>
            <Button
              type='submit'
              className='flex items-center gap-3'
              size={'sm'}
            >
              <XIcon className='h-4 w-4' />
              <span>Close</span>
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              className='flex items-center gap-3'
              size={'sm'}
              disabled={groupStatus !== 'success' || !group}
              onClick={() => handleCopy()}
            >
              <CopyIcon className='h-4 w-4' />
              <span>Copy</span>
            </Button>
          </DialogClose>
          <Button
            className='flex items-center gap-3'
            size={'sm'}
            onClick={() => handleDownload()}
            disabled={groupStatus !== 'success' || !group}
          >
            <DownloadIcon className='h-4 w-4' />
            <span>Download QR</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteQR;
