'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import React, {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
} from 'react';
import { type FC } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
} from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { type FileType } from '@/lib/files/fileType';
import { api } from '@/trpc/react';
import { useFileUpload } from '@/hooks/useFileUpload';

const FormSchema = z.object({
  fileName: z
    .string()
    .min(2, { message: "File name can't be empty" })
    .refine((arg) => arg.endsWith('.md'), {
      message: 'File should be named with extension of ".md"',
    }),
});

interface Props {
  file?: FileType;
  setFile: Dispatch<SetStateAction<FileType | undefined>>;
  fileData: string | undefined;
  setCurrentOpenFile: Dispatch<SetStateAction<FileType | undefined>>;
}

const SaveFile: FC<Props> = ({
  file,
  setFile,
  fileData,
  setCurrentOpenFile,
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { fileName: file?.name ?? '' },
  });
  const { toast } = useToast();
  const utils = api.useUtils();
  const [open, setOpen] = useState(false);
  // @todo: use the useFileUpload custom hook
  const { isUploading, startUpload } = useFileUpload(
    undefined,
    undefined,
    async (res) => {
      if (!res) return;
      await utils.file.getAll.invalidate();
      setFile({
        ...res,
        createdAt: new Date(res.createdAt),
        updatedAt: new Date(res.updatedAt),
      });
      setCurrentOpenFile({
        ...res,
        createdAt: new Date(res.createdAt),
        updatedAt: new Date(res.updatedAt),
      });
      setOpen(false);
    },
  );
  const { mutateAsync: deleteFile } = api.file.delete.useMutation({
    onError() {
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'Something went wrong. Try again...',
      });
    },
  });
  useEffect(() => {
    form.setValue('fileName', file?.name ?? '');
  }, [file?.name, form]);
  async function onSubmit(formData: z.infer<typeof FormSchema>) {
    if (!fileData) return;
    const blob = new Blob([fileData], { type: 'text/markdown' });
    const newFile = new File([blob], formData.fileName, {
      type: 'text/markdown',
    });
    if (!file && fileData) {
      await startUpload([newFile]);
    } else if (file && fileData) {
      await startUpload([newFile]);
      await deleteFile(file?.id);
    }
  }
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button disabled={!fileData && !file} variant='default'>
          Save File
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Save Local</DialogTitle>
          <DialogDescription>Save file to local storage</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='w-2/3 space-y-6'
          >
            <FormField
              control={form.control}
              name='fileName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Filename</FormLabel>
                  <FormControl>
                    <Input placeholder='MyMd' {...field} />
                  </FormControl>
                  <FormDescription>Your File Name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                disabled={isUploading}
                type='submit'
                className='mx-auto w-32'
              >
                {file?.name ? 'Save' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SaveFile;
