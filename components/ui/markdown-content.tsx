"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className = "" }: MarkdownContentProps) {
  // Pre-process math blocks or formulas if any to look clean in markdown
  const formattedContent = content
    // Render display math blocks $$...$$ nicely formatted if present
    .replace(/\$\$([\s\S]*?)\$\$/g, (_, formula) => {
      const clean = formula
        .replace(/\\text\{([^}]+)\}/g, "$1")
        .replace(/\\le/g, "≤")
        .replace(/\\ge/g, "≥")
        .replace(/\\times/g, "×")
        .trim();
      return `\n\n> 💡 **FÓRMULA / PRINCIPIO RECTOR:**\n> \`\`\`math\n> ${clean}\n> \`\`\`\n\n`;
    })
    // Inline math $...$
    .replace(/\$([^$\n]+)\$/g, (_, math) => {
      const clean = math
        .replace(/\\text\{([^}]+)\}/g, "$1")
        .replace(/\\le/g, "≤")
        .replace(/\\ge/g, "≥")
        .replace(/\\times/g, "×")
        .trim();
      return `\`${clean}\``;
    });

  return (
    <div className={`academic-markdown-prose ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)] mt-7 mb-3 pb-2 border-b border-[var(--border-subtle)] first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-bold tracking-tight text-[var(--text-primary)] mt-6 mb-3 pb-1.5 border-b border-[var(--border-subtle)] flex items-center gap-2">
              <span className="w-1.5 h-4 bg-indigo-500 rounded-full inline-block shrink-0" />
              <span>{children}</span>
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-bold tracking-tight text-[var(--text-primary)] mt-5 mb-2 text-zinc-100 flex items-center gap-2">
              <span className="w-1 h-3 bg-zinc-500 rounded-full inline-block shrink-0" />
              <span>{children}</span>
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mt-4 mb-1.5">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3.5 last:mb-0">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-zinc-100">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-zinc-300">{children}</em>
          ),
          ul: ({ children }) => (
            <ul className="space-y-1.5 mb-4 pl-1 text-xs text-[var(--text-secondary)]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside space-y-1.5 mb-4 pl-4 text-xs text-[var(--text-secondary)]">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-indigo-400 before:font-bold">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 pl-3.5 py-2 pr-3 border-l-2 border-indigo-500/70 bg-indigo-500/5 rounded-r-lg text-xs italic text-zinc-300">
              {children}
            </blockquote>
          ),
          hr: () => (
            <hr className="my-5 border-t border-[var(--border-subtle)]" />
          ),
          code: ({ className: codeClassName, children }) => {
            const isBlock = codeClassName?.includes("language-");
            if (isBlock) {
              return (
                <div className="my-3 p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 font-mono text-xs text-indigo-300 overflow-x-auto">
                  <code>{children}</code>
                </div>
              );
            }
            return (
              <code className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-indigo-300">
                {children}
              </code>
            );
          },
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]/60 shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-b border-[var(--border-subtle)] bg-zinc-900/70 text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-zinc-800/30 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-3.5 py-2.5 font-semibold text-[var(--text-primary)]">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3.5 py-2.5 text-[var(--text-secondary)] align-top leading-relaxed">
              {children}
            </td>
          ),
        }}
      >
        {formattedContent}
      </ReactMarkdown>
    </div>
  );
}
