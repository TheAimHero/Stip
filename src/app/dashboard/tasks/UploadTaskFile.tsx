import React, { type FC, type Dispatch, type SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useDropzone, type DropzoneOptions } from 'react-dropzone';
import { Cloud, File, Loader2 } from 'lucide-react';
import { api } from '@/trpc/react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { cn } from '@/lib/utils';

interface Props {
  fileTypes: 'pdf' | 'markdown';
  maxSizeMb: number;
  isUploading: boolean;
  setIsUploading: Dispatch<SetStateAction<boolean>>;
  setFileId: Dispatch<SetStateAction<number | undefined>>;
  fileId: number | undefined;
  className?: string;
}

const UploadTaskFile: FC<Props> = ({
  fileTypes,
  maxSizeMb,
  setIsUploading,
  className,
  setFileId,
  fileId,
}) => {
  const utils = api.useUtils();
  const { isUploading: fileUploading, startUpload } = useFileUpload(
    () => setIsUploading(true),
    undefined,
    async (res) => {
      if (!res) return;
      await utils.file.getAll.invalidate();
      setFileId(res.id);
      setIsUploading(false);
      acceptedFiles.pop();
    },
    undefined,
    'pdfUploader',
  );
  const dropzoneOptions: DropzoneOptions = {
    multiple: false,
    maxFiles: 1,
    maxSize: maxSizeMb * 1024 * 1024,
    accept:
      fileTypes === 'pdf'
        ? { 'application/pdf': ['.pdf'] }
        : { 'text/plain': ['.txt', '.md'] },
    disabled: fileUploading,
  };
  const { acceptedFiles, getRootProps, getInputProps } =
    useDropzone(dropzoneOptions);
  async function uploadFile() {
    if (acceptedFiles[0]) {
      await startUpload(acceptedFiles);
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          disabled={fileUploading || fileId !== undefined}
          variant='default'
          className={cn('md:min-w-[150px]', className)}
        >
          {fileUploading ? (
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          ) : fileId !== undefined ? (
            'File Uploaded'
          ) : (
            'Upload File'
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className='w-full'>
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            Upload a local file to your account.
          </DialogDescription>
        </DialogHeader>
        <div
          {...getRootProps()}
          className='m-4 h-64 rounded-lg border border-dashed border-gray-300'
        >
          <div className='flex h-full w-full items-center justify-center'>
            <label
              htmlFor='dropzone-file'
              className='flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg bg-transparent hover:bg-transparent'
            >
              <div className='flex flex-col items-center justify-center pb-6 pt-5'>
                <Cloud className='mb-2 h-6 w-6' />
                <p className='mb-2 text-sm'>
                  <span className='font-semibold'>Click to upload</span> or drag
                  and drop
                </p>
                <p className='text-xs tracking-wide'>{`Only ${fileTypes.toUpperCase()} files are allowed. Max size ${maxSizeMb} Mb`}</p>
              </div>
              {acceptedFiles?.[0] ? (
                <div className='flex max-w-xs items-center divide-x divide-zinc-200 overflow-hidden rounded-md bg-transparent outline outline-[1px] outline-zinc-200'>
                  <div className='grid h-full place-items-center px-3 py-2'>
                    <File className='h-4 w-4 text-blue-500' />
                  </div>
                  <div className='h-full truncate px-3 py-2 text-sm'>
                    {acceptedFiles[0].name}
                  </div>
                </div>
              ) : null}
              <input
                {...getInputProps()}
                type='file'
                id='dropzone-file'
                className='hidden'
              />
            </label>
          </div>
        </div>
        <DialogFooter className='mx-auto flex w-full items-center justify-between gap-2 md:gap-10'>
          <DialogClose asChild>
            <Button
              disabled={acceptedFiles?.[0] ? false : true}
              className='flex-1'
              type='submit'
              onClick={uploadFile}
            >
              {fileUploading ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : null}
              {acceptedFiles?.[0] ? 'Upload File' : 'Choose a file'}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadTaskFile;
