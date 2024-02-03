import { getServerAuthSession } from '@/server/auth';
import { files } from '@/server/db/schema/files';
import { TRPCError } from '@trpc/server';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { db } from '@/server/db';

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
      await db.insert(files).values({
        link: file.url,
        name: file.name,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: metadata.userId,
      });
      return {
        uploadedBy: metadata.userId,
        fileName: file.name,
        fileUrl: file.url,
        fileSize: file.size,
      };
    }),
} satisfies FileRouter;

export type UplaodThingFileRouter = typeof fileRouter;
