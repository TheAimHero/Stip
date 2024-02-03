'use client';

import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import React, { useState, type Dispatch, type SetStateAction } from 'react';
import dynamic from 'next/dynamic';
import { getCodeString } from 'rehype-rewrite';
// import * as commands from '@uiw/react-md-editor/commands';
import { type FC } from 'react';
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
  loading: () => <Skeleton className='h-[calc(100vh-250px)] animate-pulse' />,
});
import { type MDEditorProps } from '@uiw/react-md-editor';
import katex from 'katex';
import 'katex/dist/katex.css';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  source?: string;
}

const editorOptions: MDEditorProps = {
  height: 'calc(100vh - 250px)',
  style: {
    backgroundColor: 'hsl(var(--background))',
    color: 'hsl(var(--foreground))',
  },
  preview: 'live',
  toolbarBottom: true,
  textareaProps: {
    style: {
      accentColor: 'hsl(var(--accent))',
      backgroundColor: 'hsl(var(--background))',
    },
  },
  previewOptions: {
    style: {
      backgroundColor: 'hsl(var(--background))',
    },
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
              style={{ fontSize: '150%', background: 'hsl(var(--background))' }}
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
};

interface Props {
  data?: string;
  setData?: Dispatch<SetStateAction<string | undefined>>;
}

const Editor: FC<Props> = ({ source }) => {
  const [value, setValue] = useState(source);
  return <MDEditor {...editorOptions} value={value} onChange={setValue} />;
};

export default Editor;
