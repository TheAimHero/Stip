'use client';

import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import React, { type Dispatch, type SetStateAction } from 'react';
import dynamic from 'next/dynamic';
import { getCodeString } from 'rehype-rewrite';
import { type FC } from 'react';
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
  loading: () => (
    <Skeleton className='my-4 h-[calc(100vh-250px)] w-full rounded-xl' />
  ),
});
import { type MDEditorProps } from '@uiw/react-md-editor';
import katex from 'katex';
import 'katex/dist/katex.css';
import { Skeleton } from '@/components/ui/skeleton';
import { useMediaQuery } from '@uidotdev/usehooks';

function editorOptions(device: boolean) {
  return {
    height: device ? 'calc(100vh - 250px)' : 'calc(100vh - 225px)',
    style: {
      backgroundColor: 'hsl(var(--background))',
      color: 'hsl(var(--foreground))',
    },
    preview: device ? 'live' : 'preview',
    toolbarBottom: true,
    textareaProps: {
      style: {
        accentColor: 'hsl(var(--accent))',
        backgroundColor: 'hsl(var(--background))',
      },
    },
    previewOptions: {
      style: { backgroundColor: 'hsl(var(--background))' },
      components: {
        code: ({ children = [], className, ...props }) => {
          if (typeof children === 'string' && /^\$\$(.*)\$\$/.test(children)) {
            const html = katex.renderToString(
              children.replace(/^\$\$(.*)\$\$/, '$1'),
              { throwOnError: false },
            );
            return (
              <code
                dangerouslySetInnerHTML={{ __html: html }}
                style={{ background: 'hsl(var(--background))' }}
              />
            );
          }
          const code = props.node?.children
            ? getCodeString(props.node.children)
            : children;
          if (
            typeof code === 'string' &&
            typeof className === 'string' &&
            className.toLocaleLowerCase().startsWith('language-katex')
          ) {
            const html = katex.renderToString(code, {
              throwOnError: false,
            });
            return (
              <code
                style={{
                  fontSize: '150%',
                  background: 'hsl(var(--background))',
                }}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          }
          return (
            <code
              className={String(className)}
              style={{
                background: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
              }}
            >
              {children}
            </code>
          );
        },
      },
    },
  } satisfies MDEditorProps;
}

interface Props {
  data?: string;
  setData?: Dispatch<SetStateAction<string | undefined>>;
}

const Editor: FC<Props> = ({ data, setData }) => {
  const device = useMediaQuery('(min-width: 768px)');
  return (
    <MDEditor {...editorOptions(device)} value={data} onChange={setData} />
  );
};

export default Editor;
