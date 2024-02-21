import {
  Dialog,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog';
import React, { type Dispatch, type SetStateAction, type FC } from 'react';
import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';
import { useToast } from '@/components/ui/use-toast';
import { type FileType } from '@/lib/files/fileType';

interface Props {
  file?: FileType;
  setFile: Dispatch<SetStateAction<FileType | undefined>>;
  setFileData: Dispatch<SetStateAction<string | undefined>>;
  setCurrentOpenFile: Dispatch<SetStateAction<FileType | undefined>>;
}

const DeleteFile: FC<Props> = ({
  setFile,
  setCurrentOpenFile,
  file,
  setFileData,
}) => {
  const { toast } = useToast();
  const utils = api.useUtils();
  const { mutate: deleteFile } = api.file.delete.useMutation({
    async onSettled() {
      setFile(undefined);
      setCurrentOpenFile(undefined);
      setFileData(undefined);
      await utils.file.getAll.invalidate();
      toast({
        title: 'File deleted',
        description: 'Your file has been deleted.',
      });
    },
    onError(err) {
      if (err.data?.zodError) {
        toast({
          variant: 'destructive',
          title: 'Delete failed',
          description: 'Incorrect values. Try again...',
        });
        return;
      }
      if (err.data?.code === 'NOT_FOUND') {
        toast({
          variant: 'destructive',
          title: 'Delete failed',
          description: 'File not found. Try again...',
        });
        return;
      }
      toast({
        variant: 'destructive',
        title: 'Delete failed',
        description: 'Something went wrong. Try again...',
      });
    },
  });
  function handleDelete() {
    if (!file) return;
    deleteFile(file.id);
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          disabled={!file}
          variant='destructive'
          className='md:min-w-[150px]'
        >
          Delete File
        </Button>
      </DialogTrigger>
      <DialogContent className='w-[95%] p-3 md:w-full'>
        <DialogHeader>
          <DialogTitle>Delete File</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this file?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='mx-auto w-full flex-row items-center gap-5 md:justify-between md:gap-10'>
          <DialogClose asChild>
            <Button
              variant='destructive'
              onClick={handleDelete}
              className='flex-1'
              autoFocus
            >
              Yes
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant='default' className='flex-1'>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteFile;
