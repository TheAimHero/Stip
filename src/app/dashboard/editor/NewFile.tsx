import { Button } from '@/components/ui/button';
import { type FileType } from '@/lib/files/fileType';
import React, { type FC, type SetStateAction, type Dispatch } from 'react';

interface Props {
  setFile: Dispatch<SetStateAction<FileType | undefined>>;
  setFileData: Dispatch<SetStateAction<string | undefined>>;
  setCurrentOpenFile: Dispatch<SetStateAction<FileType | undefined>>;
}

const NewFile: FC<Props> = ({ setFile, setFileData, setCurrentOpenFile }) => {
  function setNewFile() {
    setFile(undefined);
    setFileData(undefined);
    setCurrentOpenFile(undefined);
  }
  return (
    <Button variant={'default'} onClick={setNewFile}>
      New File
    </Button>
  );
};

export default NewFile;
