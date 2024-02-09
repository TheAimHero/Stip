import { getServerAuthSession } from '@/server/auth';
import { files } from '@/server/db/schema/files';
import { TRPCError } from '@trpc/server';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { db } from '@/server/db';

export type UtServerReturn = {
  uploadedBy: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileId: number;
};

const f = createUploadthing();

const auth = async () => {
  const session = await getServerAuthSession();
  if (!session?.user.id || !session.user.email) return null;
  return session.user;
};

export const fileRouter = {
  fileUploader: f({ text: { maxFileSize: '1MB', maxFileCount: 1 } })
    .middleware(async ({}) => {
      const user = await auth();
      if (!user) throw new TRPCError({ code: 'UNAUTHORIZED' });
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const newFile = await db
        .insert(files)
        .values({
          link: file.url,
          name: file.name,
          createdAt: new Date(),
          key: file.key,
          updatedAt: new Date(),
          userId: metadata.userId,
          fileType: 'markdown',
        })
        .returning();
      if (!newFile?.[0]) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      return {
        ...newFile?.[0],
        createdAt: newFile?.[0].createdAt.getTime(),
        updatedAt: newFile?.[0].updatedAt.getTime(),
      };
    }),
  pdfUploader: f({ pdf: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(async ({}) => {
      const user = await auth();
      if (!user) throw new TRPCError({ code: 'UNAUTHORIZED' });
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const newFile = await db
        .insert(files)
        .values({
          link: file.url,
          name: file.name,
          createdAt: new Date(),
          key: file.key,
          updatedAt: new Date(),
          userId: metadata.userId,
          fileType: 'pdf',
        })
        .returning();
      if (!newFile?.[0]) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      return {
        ...newFile?.[0],
        createdAt: newFile?.[0].createdAt.getTime(),
        updatedAt: newFile?.[0].updatedAt.getTime(),
      };
    }),
} satisfies FileRouter;

export type UplaodThingFileRouter = typeof fileRouter;
