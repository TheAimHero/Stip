'use server';

import 'server-only';
import { db } from '@/server/db';
import { files } from '@/server/db/schema/files';
import { utapi } from '@/server/uploadthing';
import { eq } from 'drizzle-orm';

export const resetForm = async (fileId: number | undefined) => {
  if (!fileId) return;
  const deleteFileArr = await db
    .delete(files)
    .where(eq(files.id, fileId))
    .returning({ fileKey: files.key });
  const fileKey = deleteFileArr.at(0)?.fileKey;
  if (fileKey) {
    await utapi.deleteFiles(fileKey);
  }
};
