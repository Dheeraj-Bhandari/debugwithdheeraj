import React, { useRef, useEffect, useMemo } from 'react';
import type { TerminalDisplayProps } from './types';
import type { OutputLine } from '../../lib/terminal/types';
import { TerminalInput } from './TerminalInput';

// Virtual scrolling configuration
const ESTIMATED_LINE_HEIGHT = 24; // Approximate height of a line in pixels
const BUFFER_SIZE = 20; // Number of lines to render above/below viewport

/**
 * TerminalDisplay component renders terminal output with proper formatting and styling
 * Now includes integrated input at the bottom
 */
export const TerminalDisplay: React.FC<TerminalDisplayProps> = ({
  outputLines,
  isAutoScrollEnabled,
  onScroll,
  onTerminalClick,
  currentDirectory,
  onCommandSubmit,
  commandHistory,
  availableCommands,
  fileSystem,
  onShowCompletions,
}) => {
  const displayRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = React.useState(false);

  // Calculate visible range for virtual scrolling (only for large outputs)
  const visibleRange = useMemo(() => {
    // Only use virtual scrolling if we have many lines
    if (outputLines.length < 500) {
      return { start: 0, end: outputLines.length };
    }

    if (!displayRef.current) {
      return { start: 0, end: Math.min(100, outputLines.length) };
    }

    const scrollTop = displayRef.current.scrollTop;
    const viewportHeight = displayRef.current.clientHeight;

    const startIndex = Math.max(0, Math.floor(scrollTop / ESTIMATED_LINE_HEIGHT) - BUFFER_SIZE);
    const endIndex = Math.min(
      outputLines.length,
      Math.ceil((scrollTop + viewportHeight) / ESTIMATED_LINE_HEIGHT) + BUFFER_SIZE
    );

    return { start: startIndex, end: endIndex };
  }, [outputLines.length]);

  // Get visible lines for rendering
  const visibleLines = useMemo(() => {
    if (outputLines.length < 500) {
      return outputLines;
    }
    return outputLines.slice(visibleRange.start, visibleRange.end);
  }, [outputLines, visibleRange]);

  // Auto-scroll to bottom when new output is added
  useEffect(() => {
    if (isAutoScrollEnabled && displayRef.current) {
      displayRef.current.scrollTop = displayRef.current.scrollHeight;
    }
  }, [outputLines, isAutoScrollEnabled]);

  // Handle scroll events to detect user scrolling
  const handleScroll = () => {
    if (!displayRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = displayRef.current;
    const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 10;

    // Detect if user scrolled up
    if (scrollTop < lastScrollTop.current) {
      onScroll(false);
    } else if (isAtBottom) {
      onScroll(true);
    }

    lastScrollTop.current = scrollTop;
  };

  // Get color class based on line type
  const getLineColorClass = (type: OutputLine['type']): string => {
    switch (type) {
      case 'error':
        return 'terminal-error';
      case 'info':
        return 'terminal-info';
      case 'command':
        return 'terminal-command';
      case 'output':
      default:
        return 'terminal-output';
    }
  };

  // Render a single output line
  const renderLine = (line: OutputLine, index: number) => {
    const colorClass = getLineColorClass(line.type);
    
    // Determine ARIA role based on line type
    const ariaRole = line.type === 'error' ? 'alert' : undefined;
    
    return (
      <div 
        key={index} 
        className={`terminal-line ${colorClass} font-mono whitespace-pre-wrap break-words animate-line-appear`}
        style={{ animationDelay: `${Math.min(index * 0.02, 0.5)}s` }}
        role={ariaRole}
        aria-label={line.type === 'command' ? `Command: ${line.content}` : undefined}
      >
        {renderContent(line.content, line.type)}
      </div>
    );
  };

  // Render content with syntax highlighting and clickable links
  const renderContent = (content: string, type: OutputLine['type']) => {
    // Detect and render URLs as clickable links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);

    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="terminal-link hover:underline cursor-pointer transition-colors duration-150"
          >
            {part}
          </a>
        );
      }

      // Apply syntax highlighting for JSON content
      if (type === 'output' && isJSON(part)) {
        return <span key={index}>{highlightJSON(part)}</span>;
      }

      // Apply formatting for Markdown content
      if (type === 'output' && isMarkdown(part)) {
        return <span key={index}>{formatMarkdown(part)}</span>;
      }

      return <span key={index}>{part}</span>;
    });
  };

  // Check if content is JSON
  const isJSON = (content: string): boolean => {
    const trimmed = content.trim();
    return (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
           (trimmed.startsWith('[') && trimmed.endsWith(']'));
  };

  // Check if content is Markdown
  const isMarkdown = (content: string): boolean => {
    return /^#+\s/.test(content) || // Headers
           /^\*\*.*\*\*/.test(content) || // Bold
           /^\*.*\*/.test(content) || // Italic
           /^\-\s/.test(content) || // List items
           /^\d+\.\s/.test(content); // Numbered lists
  };

  // Highlight JSON content with terminal color scheme
  const highlightJSON = (content: string): React.ReactNode => {
    try {
      const parsed = JSON.parse(content);
      const formatted = JSON.stringify(parsed, null, 2);
      
      // JSON syntax highlighting with terminal-consistent colors
      let highlighted = formatted;
      
      // Property keys (purple/magenta)
      highlighted = highlighted.replace(/"([^"]+)":/g, '<span class="terminal-json-key">"$1"</span>:');
      
      // String values (light blue)
      highlighted = highlighted.replace(/:\s*"([^"]*)"/g, ': <span class="terminal-json-string">"$1"</span>');
      
      // Numbers (orange)
      highlighted = highlighted.replace(/:\s*(-?\d+\.?\d*)/g, ': <span class="terminal-json-number">$1</span>');
      
      // Booleans (red)
      highlighted = highlighted.replace(/:\s*(true|false)/g, ': <span class="terminal-json-boolean">$1</span>');
      
      // Null (gray)
      highlighted = highlighted.replace(/:\s*(null)/g, ': <span class="terminal-json-null">$1</span>');
      
      // Brackets and braces (blue)
      highlighted = highlighted.replace(/([{}\[\]])/g, '<span class="terminal-json-bracket">$1</span>');

      return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
    } catch {
      return content;
    }
  };

  // Format Markdown content with terminal color scheme
  const formatMarkdown = (content: string): React.ReactNode => {
    let formatted = content;

    // Headers (blue, bold, larger)
    formatted = formatted.replace(/^(#{1})\s+(.+)$/gm, '<span class="terminal-md-header font-bold text-xl">$2</span>');
    formatted = formatted.replace(/^(#{2})\s+(.+)$/gm, '<span class="terminal-md-header font-bold text-lg">$2</span>');
    formatted = formatted.replace(/^(#{3,})\s+(.+)$/gm, '<span class="terminal-md-header font-bold">$2</span>');

    // Bold text (white, bold)
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<span class="terminal-md-bold font-bold">$1</span>');

    // Italic text (gray, italic)
    formatted = formatted.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<span class="terminal-md-italic italic">$1</span>');

    // Inline code (orange on dark background)
    formatted = formatted.replace(/`([^`]+?)`/g, '<span class="terminal-md-code px-1 rounded font-mono">$1</span>');

    // Links (blue, underlined)
    formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="terminal-md-link hover:opacity-80 underline transition-opacity duration-150">$1</a>');

    // List items (with bullet points)
    formatted = formatted.replace(/^[\-\*]\s+(.+)$/gm, '<span class="terminal-output">• $1</span>');
    formatted = formatted.replace(/^(\d+)\.\s+(.+)$/gm, '<span class="terminal-output">$1. $2</span>');

    return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  // Handle click on terminal to focus input
  const handleTerminalClick = (e: React.MouseEvent) => {
    // Prevent focus loss when clicking on links or other interactive elements
    const target = e.target as HTMLElement;
    if (target.tagName === 'A' || target.closest('a')) {
      return; // Don't focus input when clicking links
    }
    
    onTerminalClick();
    inputRef.current?.focus();
    setIsFocused(true);
  };

  // Track focus state for visual feedback
  useEffect(() => {
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);
    
    const input = inputRef.current;
    if (input) {
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
      
      return () => {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
      };
    }
  }, []);

  return (
    <div
      ref={displayRef}
      onScroll={handleScroll}
      onClick={handleTerminalClick}
      className={`terminal-display flex-1 overflow-y-auto p-2 sm:p-4 font-mono text-xs sm:text-sm leading-relaxed overscroll-contain transition-terminal cursor-text ${
        isFocused ? 'ring-1 ring-blue-500/30' : ''
      }`}
      style={{ 
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch'
      }}
      role="log"
      aria-label="Terminal output"
      aria-live="polite"
      aria-atomic="false"
    >
      {/* Output content */}
      <div className="flex flex-col min-h-full">
        {/* Output lines */}
        <div className="flex-grow">
          {/* Virtual scrolling: Add spacer for lines above viewport */}
          {outputLines.length >= 500 && visibleRange.start > 0 && (
            <div style={{ height: `${visibleRange.start * ESTIMATED_LINE_HEIGHT}px` }} aria-hidden="true" />
          )}
          
          {/* Render visible lines */}
          {visibleLines.map((line, index) => {
            const actualIndex = outputLines.length < 500 ? index : visibleRange.start + index;
            return renderLine(line, actualIndex);
          })}
          
          {/* Virtual scrolling: Add spacer for lines below viewport */}
          {outputLines.length >= 500 && visibleRange.end < outputLines.length && (
            <div style={{ height: `${(outputLines.length - visibleRange.end) * ESTIMATED_LINE_HEIGHT}px` }} aria-hidden="true" />
          )}
        </div>

        {/* Integrated Terminal Input at the bottom */}
        <div className="terminal-input-wrapper flex-shrink-0 mt-2">
          <TerminalInput
            ref={inputRef}
            currentDirectory={currentDirectory}
            onSubmit={onCommandSubmit}
            commandHistory={commandHistory}
            availableCommands={availableCommands}
            currentPath={currentDirectory}
            fileSystem={fileSystem}
            onShowCompletions={onShowCompletions}
            onFocusChange={setIsFocused}
          />
        </div>
      </div>
    </div>
  );
};
