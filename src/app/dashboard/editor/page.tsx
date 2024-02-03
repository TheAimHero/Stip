'use client';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import Editor from './Editor';

const Page = () => {
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
    </div>
  );
};

export default Page;
