'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Editor from './Editor';
import OptionsBar from './OptionsBar';
import { type FileType } from '@/lib/files/fileType';
import UploadButton from './UploadButton';
import OpenFile from './OpenFile';
import { useQuery } from '@tanstack/react-query';
import { useLocalStorage } from '@uidotdev/usehooks';
import DeleteFile from './DeleteFile';
import SaveFile from './SaveFile';
import NewFile from './NewFile';

const Page = () => {
  const [value, setValue] = useState<FileType | undefined>();
  const [fileData, setFileData] = useState<string | undefined>();
  const [currentOpenFile, setCurrentOpenFile] = useLocalStorage<
    FileType | undefined
  >('currentOpenFile');
  const { data: fetchFile, status: fileFetchStatus } = useQuery({
    queryFn: async () => {
      if (!value) return;
      const file = await fetch(value.link);
      if (!file.ok) throw new Error('File not found');
      return await file.text();
    },
    queryKey: ['remoteFileData', value?.id],
    enabled: !!value,
  });
  useEffect(() => {
    if (currentOpenFile) {
      setValue(currentOpenFile);
    }
  }, []);
  useEffect(() => {
    if (fileFetchStatus === 'success') {
      setFileData(fetchFile ?? '');
    }
  }, [fetchFile, fileFetchStatus]);
  const { theme } = useTheme();
  return (
    <div className='mt-4 h-full'>
      <div
        data-color-mode={
          theme === 'dark' || theme === 'system' ? 'dark' : 'light'
        }
      >
        <Editor data={fileData} setData={setFileData} />
      </div>
      <OptionsBar>
        <UploadButton
          fileTypes='markdown'
          maxSizeMb={1}
          setFile={setValue}
          setCurrentOpenFile={setCurrentOpenFile}
        />
        <OpenFile
          setCurrentOpenFile={setCurrentOpenFile}
          file={value}
          setFile={setValue}
        />
        <DeleteFile
          file={value}
          setCurrentOpenFile={setCurrentOpenFile}
          setFile={setValue}
          setFileData={setFileData}
        />
        <SaveFile
          file={value}
          fileData={fileData}
          setFile={setValue}
          setCurrentOpenFile={setCurrentOpenFile}
        />
        <NewFile
          setFile={setValue}
          setFileData={setFileData}
          setCurrentOpenFile={setCurrentOpenFile}
        />
      </OptionsBar>
    </div>
  );
};

export default Page;
