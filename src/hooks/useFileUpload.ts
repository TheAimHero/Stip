import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useUploadThing } from './useUploadthing';

export type ServerDataType =
  | {
      createdAt: number;
      updatedAt: number;
      link: string;
      key: string;
      id: number;
      userId: string;
      name: string;
      fileType: 'pdf' | 'markdown';
    }
  | undefined;

export const useFileUpload = (
  beforeStart?: () => Promise<void> | void,
  onStart?: () => Promise<void> | void,
  onComplete?: (data: ServerDataType) => Promise<void> | void,
  onError?: () => Promise<void> | void,
  uploadType: 'fileUploader' | 'pdfUploader' = 'fileUploader',
) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const { startUpload } = useUploadThing(uploadType, {
    onBeforeUploadBegin: (files) => {
      setIsUploading(true);
      toast({
        title: 'Uploading file...',
        description: 'Your file is being uploaded.',
      });
      void beforeStart?.();
      return files;
    },
    onUploadBegin: () => {
      setIsUploading(true);
      toast({
        title: 'Uploading file...',
        description: 'Your file is being uploaded.',
      });
      void onStart?.();
    },
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    onClientUploadComplete: async (resArr) => {
      const res = resArr[0];
      setIsUploading(false);
      toast({
        title: `File uploaded: ${res?.name}`,
        description: `Your file has been uploaded. ${res?.size} bytes.`,
      });
      void onComplete?.(res?.serverData);
    },
    onUploadError: () => {
      setIsUploading(false);
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: 'Something went wrong. Try again...',
      });
      void onError?.();
    },
  });
  return { isUploading, startUpload };
};
