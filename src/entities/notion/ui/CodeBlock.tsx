'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4 text-sm font-mono">
      {/* Language Badge */}
      {language && (
        <div className="absolute top-0 left-0 px-2 py-1 text-xs text-neutral-500 bg-neutral-100 dark:bg-neutral-800 rounded-br-md z-10 select-none border-l border-b border-neutral-200 dark:border-neutral-700">
          {language}
        </div>
      )}
      
      {/* Copy Button */}
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy code"
        className="absolute top-2 right-2 p-2 rounded-md bg-neutral-200/80 dark:bg-neutral-800/80 hover:bg-neutral-300 dark:hover:bg-neutral-700 opacity-0 group-hover:opacity-100 transition-all duration-200 focus:opacity-100 z-20 backdrop-blur-sm cursor-pointer"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-600 dark:text-green-500" />
        ) : (
          <Copy className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
        )}
      </button>
      
      {/* Code Block with Syntax Highlighting */}
      <div className="rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800">
        <SyntaxHighlighter
          language={language.toLowerCase()}
          style={atomDark}
          customStyle={{
            margin: 0,
            padding: '2rem 1rem 1.5rem',
            backgroundColor: 'var(--color-neutral-900)', // Fallback or custom dark bg
            fontSize: '0.875rem',
            lineHeight: '1.5',
          }}
          wrapLines={true}
          wrapLongLines={true}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
