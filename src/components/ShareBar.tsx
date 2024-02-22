import React, { type FC } from 'react';
import {
  EmailIcon,
  EmailShareButton,
  TelegramIcon,
  TelegramShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share';

interface Props {
  url: string;
}

const ShareBar: FC<Props> = ({ url }) => {
  return (
    <div className='mx-auto flex justify-center gap-10'>
      <WhatsappShareButton url={url}>
        <WhatsappIcon className='h-10 w-10 rounded-full' />
      </WhatsappShareButton>
      <EmailShareButton url={url}>
        <EmailIcon className='h-10 w-10 rounded-full' />
      </EmailShareButton>
      <TelegramShareButton url={url}>
        <TelegramIcon className='h-10 w-10 rounded-full' />
      </TelegramShareButton>
    </div>
  );
};

export default ShareBar;
