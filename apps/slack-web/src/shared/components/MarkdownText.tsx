import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import styles from './MarkdownText.module.css';

interface MarkdownTextProps {
  text: string;
}

function Mention({ userId }: { userId: string }) {
  const user = useQuery(api.users.getById, { userId: userId as Id<"users"> });
  
  if (user === undefined) return <span className={styles.mentionLoading}>@...</span>;
  if (!user) return <span className={styles.mentionError}>@unknown</span>;
  
  return <span className={styles.mention}>@{user.name || 'user'}</span>;
}

export default function MarkdownText({ text }: MarkdownTextProps) {
  // Use standard-looking URLs to bypass react-markdown's safety filters
  const processedText = text
    .replace(/<@([a-zA-Z0-9_-]+)>/g, '[$1](https://mention/$1)')
    .replace(/@(\w+)/g, '[@$1](https://mention-name/$1)')
    .replace(/^ +/gm, (match) => '\u00A0'.repeat(match.length));

  return (
    <div className={styles.markdownWrapper}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          p: ({ ...props }) => <p className={styles.paragraph} {...props} />,
          a: ({ ...props }) => {
            const href = props.href || '';
            
            if (href.includes('mention/')) {
              const userId = href.split('mention/')[1];
              return <Mention userId={userId} />;
            }
            
            if (href.includes('mention-name/')) {
              return <span className={styles.mention}>{props.children}</span>;
            }
            
            return <a className={styles.link} target="_blank" rel="noopener noreferrer" {...props} />;
          },
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !className;
            return isInline ? (
              <code className={styles.inlineCode} {...props}>
                {children}
              </code>
            ) : (
              <code className={`${styles.blockCode} ${match ? match[1] : ''}`} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ ...props }) => <pre className={styles.pre} {...props} />,
        }}
      >
        {processedText}
      </ReactMarkdown>
    </div>
  );
}
