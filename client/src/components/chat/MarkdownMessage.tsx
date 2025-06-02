import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownMessageProps {
  content: string;
  className?: string;
}

export const MarkdownMessage = ({ content, className = '' }: MarkdownMessageProps) => {
  return (
    <div className={`prose prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Customize heading styles
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-white mb-3 mt-4 border-b border-gray-600 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold text-white mb-2 mt-3">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-medium text-white mb-2 mt-2">
              {children}
            </h3>
          ),
          // Customize list styles
          ul: ({ children }) => (
            <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-300 leading-relaxed">{children}</li>
          ),
          // Customize paragraph styles
          p: ({ children }) => (
            <p className="mb-3 text-gray-300 leading-relaxed">{children}</p>
          ),
          // Customize strong/bold text
          strong: ({ children }) => (
            <strong className="font-semibold text-white">{children}</strong>
          ),
          // Customize emphasis/italic text
          em: ({ children }) => (
            <em className="italic text-gray-200">{children}</em>
          ),
          // Customize code blocks
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-gray-800 text-green-400 px-1.5 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              );
            }
            return (
              <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4 border border-gray-700">
                <code className="text-green-400 text-sm font-mono">{children}</code>
              </pre>
            );
          },
          // Customize blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-400 mb-3 bg-gray-800/30 py-2 rounded-r">
              {children}
            </blockquote>
          ),
          // Customize tables
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border-collapse border border-gray-600">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-gray-600 px-3 py-2 bg-gray-800 text-white font-semibold text-left">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-600 px-3 py-2 text-gray-300">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
