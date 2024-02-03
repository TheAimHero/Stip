import { type files } from '@/server/db/schema/files';

export type FileType = typeof files.$inferSelect;
