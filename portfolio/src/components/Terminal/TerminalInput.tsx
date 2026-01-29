import React, { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import type { TerminalInputProps } from './types';

// Maximum command history entries
// const MAX_HISTORY_SIZE = 1000;

// Debounce delay for auto-completion (ms)
const AUTOCOMPLETE_DEBOUNCE_MS = 100;

/**
 * TerminalInput component handles command input with history navigation and auto-completion
 */
export const TerminalInput = forwardRef<HTMLInputElement, TerminalInputProps>(({
  currentDirectory,
  onSubmit,
  commandHistory,
  availableCommands,
  // currentPath,
  fileSystem,
  onShowCompletions,
  onFocusChange,
}, ref) => {
  const [inputValue, setInputValue] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(true);
  const [completionMatches, setCompletionMatches] = useState<string[]>([]);
  const [completionIndex, setCompletionIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<number | null>(null);

  // Expose the input ref to parent components
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  // Auto-focus input on mount and when terminal becomes visible
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Scroll input into view when keyboard appears on mobile
  useEffect(() => {
    if (isFocused && inputRef.current) {
      // Small delay to ensure keyboard is visible
      const timer = setTimeout(() => {
        inputRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest',
          inline: 'nearest'
        });
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isFocused]);

  // Handle Enter key to submit command
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        onSubmit(inputValue);
        setInputValue('');
        setHistoryIndex(-1);
        setCompletionMatches([]);
        setCompletionIndex(0);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      // Navigate to previous command in history
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 
          ? commandHistory.length - 1 
          : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      // Navigate to next command in history
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          // Reached end of history, clear input
          setHistoryIndex(-1);
          setInputValue('');
        } else {
          setHistoryIndex(newIndex);
          setInputValue(commandHistory[newIndex]);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleTabCompletion();
    }
  };

  // Handle tab auto-completion with debouncing
  const handleTabCompletion = useCallback(() => {
    const performCompletion = () => {
      const parts = inputValue.trim().split(/\s+/);
      
      // If no input or only whitespace, do nothing
      if (parts.length === 0 || !parts[0]) {
        return;
      }

      // First word - complete command
      if (parts.length === 1) {
        const partial = parts[0];
        const matches = availableCommands.filter(cmd => cmd.startsWith(partial));
        
        if (matches.length === 1) {
          // Unique match - complete it
          setInputValue(matches[0] + ' ');
          setCompletionMatches([]);
        } else if (matches.length > 1) {
          // Multiple matches - show them
          if (completionMatches.length === 0) {
            setCompletionMatches(matches);
            setCompletionIndex(0);
            if (onShowCompletions) {
              onShowCompletions(matches);
            }
          } else {
            // Cycle through matches
            const nextIndex = (completionIndex + 1) % matches.length;
            setCompletionIndex(nextIndex);
            setInputValue(matches[nextIndex] + ' ');
          }
        }
      } else {
        // Subsequent words - complete file/directory names
        const command = parts[0];
        const partial = parts[parts.length - 1];
        
        // Only complete for commands that take file/directory arguments
        const fileCommands = ['cd', 'cat', 'ls'];
        if (!fileCommands.includes(command) || !fileSystem) {
          return;
        }

        const matches = fileSystem.getCompletions(partial);
        
        if (matches.length === 1) {
          // Unique match - complete it
          const completed = parts.slice(0, -1).concat(matches[0]).join(' ');
          setInputValue(completed + ' ');
          setCompletionMatches([]);
        } else if (matches.length > 1) {
          // Multiple matches - show them or cycle
          if (completionMatches.length === 0 || JSON.stringify(completionMatches) !== JSON.stringify(matches)) {
            setCompletionMatches(matches);
            setCompletionIndex(0);
            if (onShowCompletions) {
              onShowCompletions(matches);
            }
            // Find common prefix
            const commonPrefix = findCommonPrefix(matches);
            if (commonPrefix.length > partial.length) {
              const completed = parts.slice(0, -1).concat(commonPrefix).join(' ');
              setInputValue(completed);
            }
          } else {
            // Cycle through matches
            const nextIndex = (completionIndex + 1) % matches.length;
            setCompletionIndex(nextIndex);
            const completed = parts.slice(0, -1).concat(matches[nextIndex]).join(' ');
            setInputValue(completed);
          }
        }
      }
    };

    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // In test environment, execute immediately without debounce
    if (import.meta.env.MODE === 'test') {
      performCompletion();
    } else {
      // Debounce the completion logic in production
      debounceTimerRef.current = window.setTimeout(performCompletion, AUTOCOMPLETE_DEBOUNCE_MS);
    }
  }, [inputValue, availableCommands, fileSystem, completionMatches, completionIndex, onShowCompletions]);

  // Find common prefix among matches
  const findCommonPrefix = (matches: string[]): string => {
    if (matches.length === 0) return '';
    if (matches.length === 1) return matches[0];
    
    let prefix = matches[0];
    for (let i = 1; i < matches.length; i++) {
      while (!matches[i].startsWith(prefix)) {
        prefix = prefix.slice(0, -1);
        if (prefix === '') return '';
      }
    }
    return prefix;
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setHistoryIndex(-1);
    setCompletionMatches([]);
    setCompletionIndex(0);
  };

  // Format prompt with current directory
  const formatPrompt = () => {
    const user = 'guest';
    const host = 'portfolio';
    const dir = currentDirectory === '/' ? '~' : currentDirectory.replace(/^\//, '~/');
    return `${user}@${host}:${dir}$`;
  };

  return (
    <div 
      className="terminal-input-container flex items-center gap-1 sm:gap-2 font-mono text-xs sm:text-sm transition-terminal-fast"
      role="form"
      aria-label="Terminal command input"
    >
      <span 
        className="terminal-prompt font-bold whitespace-nowrap text-xs sm:text-sm"
        aria-label={`Current directory: ${currentDirectory}`}
      >
        {formatPrompt()}
      </span>
      <div className="relative flex-1 min-w-0">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsFocused(true);
            onFocusChange?.(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            onFocusChange?.(false);
          }}
          className="terminal-input w-full bg-transparent border-none outline-none terminal-text font-mono text-xs sm:text-sm touch-manipulation transition-terminal-fast"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          inputMode="text"
          aria-label="Terminal command input"
          aria-describedby="terminal-help-text"
          placeholder="Type 'help' for available commands"
        />
        <span id="terminal-help-text" className="sr-only">
          Enter terminal commands. Press Up and Down arrows to navigate command history. Press Tab for auto-completion. Type 'help' to see available commands.
        </span>
        {isFocused && (
          <span 
            className="terminal-cursor absolute inline-block w-1.5 sm:w-2 h-4 sm:h-5 bg-white animate-blink will-change-opacity" 
            style={{ left: `${inputValue.length * 0.6}em` }}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
});

TerminalInput.displayName = 'TerminalInput';
