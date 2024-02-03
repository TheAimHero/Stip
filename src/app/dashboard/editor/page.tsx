'use client';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import Editor from './Editor';
import OptionsBar from './_options/OptionsBar';
import { type FileType } from '@/lib/files/fileType';
import UploadButton from './_options/UploadButton';

const Page = () => {
  // const [value, setValue] = useState<FileType | undefined>();
  const [value, setValue] = useState<string | undefined>();
  const { theme } = useTheme();
  return (
    <div className='mt-4 h-full'>
      <div
        data-color-mode={
          theme === 'dark' || theme === 'system' ? 'dark' : 'light'
        }
      >
        <Editor data={value} setData={setValue} />
      </div>
      <OptionsBar>
        <UploadButton />
      </OptionsBar>
    </div>
  );
};

export default Page;
