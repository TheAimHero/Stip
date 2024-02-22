'use client';

import { useGroups } from '@/components/Context';
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
import {
  CopyIcon,
  DownloadIcon,
  QrCodeIcon,
  RefreshCw,
  XIcon,
} from 'lucide-react';
import { useCopyToClipboard } from '@uidotdev/usehooks';
import { useToast } from '@/components/ui/use-toast';
import { toJpeg } from 'html-to-image';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import ShareBar from './ShareBar';

interface Props {
  baseUrl: string;
}

const InviteQR: FC<Props> = ({ baseUrl }) => {
  const { groupMember, setGroupMember } = useGroups();
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const {
    data: group,
    status: groupStatus,
    refetch,
    error,
  } = api.group.getGroupInvite.useQuery(
    { groupId: groupMember?.groupId ?? 0, refresh },
    {
      refetchOnWindowFocus: false,
      cacheTime: 0,
      staleTime: 0,
      enabled: !!groupMember?.groupId && groupMember?.role !== 'USER',
    },
  );
  const { toast } = useToast();
  useEffect(() => {
    if (open) {
      void refetch();
    }
  }, [open]);
  useEffect(() => {
    if (error) {
      if (error.data?.code === 'UNAUTHORIZED') {
        toast({
          title: 'Invite Fetch failed',
          description: 'User not found or not authorized',
          variant: 'destructive',
        });
        return;
      }
      if (error.data?.code === 'NOT_FOUND') {
        toast({
          title: 'Invite Fetch failed',
          description: 'Group not found',
          variant: 'destructive',
        });
        setGroupMember(undefined);
        return;
      }
      if (error.data?.zodError) {
        toast({
          title: 'Invite Fetch failed',
          description: 'Incorrect values. Try again...',
          variant: 'destructive',
        });
        return;
      }
      toast({
        title: 'Invite Fetch failed',
        description: 'Something went wrong',
        variant: 'destructive',
      });
    }
  }, [error]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [copied, copy] = useCopyToClipboard();
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
  if (groupMember?.role === 'USER') return null;
  const url =
    'http://' +
    path.join(baseUrl, 'invite') +
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
      <DialogContent className='w-[95%]'>
        <div ref={ref} className='flex w-[95%] flex-col'>
          <DialogHeader>
            <DialogTitle>Group Invite</DialogTitle>
            <DialogDescription>
              Scan this QR code to join the group.
            </DialogDescription>
          </DialogHeader>
          <div className='flex flex-col items-center gap-4'>
            <Label htmlFor='name' className='mt-5 text-right'>
              {group ? (
                <span className='h-5'>{`Invite to ${group?.name}`}</span>
              ) : (
                <Skeleton className='h-5 w-[20ch] animate-pulse' />
              )}
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
              {group?.inviteCodeExpiry ? (
                <span className='h-5'>{`Valid until ${format(group?.inviteCodeExpiry, 'dd MMM yyyy hh:mm')}`}</span>
              ) : (
                <Skeleton className='h-5 w-[20ch] animate-pulse'> </Skeleton>
              )}
            </span>
          </div>
        </div>
        <DialogFooter className='grid grid-cols-1 gap-3'>
          <div className='grid grid-cols-2 gap-2 md:flex md:flex-row md:gap-5'>
            <DialogClose asChild>
              <Button className='flex items-center gap-3' size={'sm'}>
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
            <Button
              className='flex items-center gap-3'
              size={'sm'}
              onClick={async () => {
                setRefresh(true);
                await refetch();
                setRefresh(false);
              }}
              disabled={groupStatus !== 'success' || !group}
            >
              <RefreshCw
                className={cn('h-4 w-4', {
                  'animate-spin': groupStatus === 'loading' && refresh,
                })}
              />
            </Button>
          </div>
          <ShareBar url={url} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteQR;
