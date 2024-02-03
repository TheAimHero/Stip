import React, { useState } from 'react';
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
import { useUploadThing } from '@/hooks/useUploadthing';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/trpc/react';

const UploadButton = () => {
  const { toast } = useToast();
  const utils = api.useUtils();
  const [isUploading, setIsUploading] = useState(false);
  const { startUpload } = useUploadThing('fileUploader', {
    onBeforeUploadBegin: (files) => {
      setIsUploading(true);
      toast({
        title: 'Uploading file...',
        description: 'Your file is being uploaded.',
      });
      return files;
    },
    onUploadBegin: () => {
      setIsUploading(true);
      toast({
        title: 'Uploading file...',
        description: 'Your file is being uploaded.',
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    onClientUploadComplete: async (resArr) => {
      const res = resArr[0];
      setIsUploading(false);
      await utils.file.getAll.invalidate();
      toast({
        title: `File uploaded: ${res?.name}`,
        description: `Your file has been uploaded. ${res?.size} bytes.`,
      });
      acceptedFiles.pop();
    },
    onUploadError: () => {
      setIsUploading(false);
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: 'Something went wrong. Try again...',
      });
    },
  });
  const dropzoneOptions: DropzoneOptions = {
    multiple: false,
    maxFiles: 1,
    maxSize: 1000000,
    accept: { 'text/plain': ['.txt', '.md', '.doc', '.docx'] },
    disabled: isUploading,
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
          disabled={isUploading}
          variant='default'
          className='md:min-w-[150px]'
        >
          {isUploading ? (
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
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
                <p className='text-xs'>PDF (up to 1MB)</p>
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
        <DialogFooter>
          <DialogClose>
            <Button
              disabled={acceptedFiles?.[0] ? false : true}
              type='submit'
              className='mx-auto'
              onClick={uploadFile}
            >
              Upload
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadButton;
