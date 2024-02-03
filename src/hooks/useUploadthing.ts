import { generateReactHelpers } from '@uploadthing/react/hooks';

import type { UplaodThingFileRouter } from '@/app/api/uploadthing/core';

export const { useUploadThing } = generateReactHelpers<UplaodThingFileRouter>();
