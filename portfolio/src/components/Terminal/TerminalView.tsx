import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TerminalViewProps } from './types';
import type { OutputLine } from '../../lib/terminal/types';
import { TerminalDisplay } from './TerminalDisplay';
import { TerminalWindowControls } from './TerminalWindowControls';
import {
  VirtualFileSystem,
  CommandParser,
  CommandExecutor,
  PortfolioDataMapper,
} from '../../lib/terminal';
import { mainPortfolioText } from '../../data/portfolioData';

// Maximum command history entries (performance optimization)
const MAX_HISTORY_SIZE = 1000;

/**
 * TerminalView is the main container component for the terminal interface
 * Manages terminal state, command execution, and view switching
 */
export const TerminalView: React.FC<TerminalViewProps> = ({
  isOpen,
  onClose,
  portfolioData,
}) => {
  // Initialize terminal state
  const [currentDirectory, setCurrentDirectory] = useState('/');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [outputLines, setOutputLines] = useState<OutputLine[]>([]);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [windowState, setWindowState] = useState<'normal' | 'minimized' | 'maximized'>('normal'); // Changed from 'maximized' to 'normal'
  const [windowSize, setWindowSize] = useState({ width: 1000, height: 600 });
  const [windowPosition, setWindowPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string>('');
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Initialize file system, parser, and executor
  const [fileSystem] = useState(() => 
    VirtualFileSystem.withPortfolioData(portfolioData || PortfolioDataMapper.getPortfolioData())
  );
  const [parser] = useState(() => new CommandParser());
  const [executor] = useState(() => new CommandExecutor());

  // Get available commands for auto-completion
  const availableCommands = parser.getValidCommands();

  // Initialize window position to center when component mounts or switches to normal mode
  useEffect(() => {
    if (windowState === 'normal') {
      const centerX = (window.innerWidth - windowSize.width) / 2;
      const centerY = (window.innerHeight - windowSize.height) / 2;
      setWindowPosition({ x: Math.max(0, centerX), y: Math.max(0, centerY) });
    }
  }, [windowState, windowSize.width, windowSize.height]);

  // Handle viewport resize for mobile keyboard
  useEffect(() => {
    const handleResize = () => {
      // Update viewport height when keyboard appears/disappears
      setViewportHeight(window.innerHeight);
    };

    const handleVisualViewportResize = () => {
      // Use Visual Viewport API for better mobile keyboard handling
      if (window.visualViewport) {
        setViewportHeight(window.visualViewport.height);
      }
    };

    // Listen to both window resize and visual viewport resize
    window.addEventListener('resize', handleResize);
    
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewportResize);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleVisualViewportResize);
      }
    };
  }, []);

  // Prevent body scroll when terminal is open and NOT minimized (mobile fix)
  useEffect(() => {
    if (isOpen && windowState !== 'minimized') {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Prevent body scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore body scroll
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen, windowState]);

  // Initialize terminal with welcome message
  useEffect(() => {
    if (isOpen && outputLines.length === 0) {
      const { terminal } = mainPortfolioText;
      const welcomeLines: OutputLine[] = [
        {
          type: 'info',
          content: '╔═══════════════════════════════════════════════════════════════╗',
          timestamp: new Date(),
        },
        {
          type: 'info',
          content: `║         ${terminal.welcomeTitle.padEnd(53)}║`,
          timestamp: new Date(),
        },
        {
          type: 'info',
          content: '╚═══════════════════════════════════════════════════════════════╝',
          timestamp: new Date(),
        },
        {
          type: 'output',
          content: '',
          timestamp: new Date(),
        },
        {
          type: 'output',
          content: 'Type "help" to see available commands',
          timestamp: new Date(),
        },
        {
          type: 'output',
          content: 'Type "about" for a quick introduction',
          timestamp: new Date(),
        },
        {
          type: 'output',
          content: 'Type "ls" to explore the file system',
          timestamp: new Date(),
        },
        {
          type: 'output',
          content: '',
          timestamp: new Date(),
        },
        {
          type: 'info',
          content: `Current directory: ${currentDirectory}`,
          timestamp: new Date(),
        },
        {
          type: 'output',
          content: '',
          timestamp: new Date(),
        },
      ];
      setOutputLines(welcomeLines);
    }
  }, [isOpen, outputLines.length, currentDirectory]);

  // Clear terminal state when closed
  useEffect(() => {
    if (!isOpen) {
      // Reset terminal state
      setOutputLines([]);
      setCommandHistory([]);
      setCurrentDirectory('/');
      setIsAutoScrollEnabled(true);
      
      // Reset file system to root directory
      fileSystem.changeDirectory('/');
    }
  }, [isOpen, fileSystem]);

  // Handle scroll events from TerminalDisplay
  const handleScroll = useCallback((isAtBottom: boolean) => {
    setIsAutoScrollEnabled(isAtBottom);
  }, []);

  // Handle command submission from TerminalInput
  const handleCommandSubmit = useCallback((command: string) => {
    // Add command to history with size limit
    setCommandHistory(prev => {
      const newHistory = [...prev, command];
      // Limit history size to MAX_HISTORY_SIZE
      if (newHistory.length > MAX_HISTORY_SIZE) {
        return newHistory.slice(newHistory.length - MAX_HISTORY_SIZE);
      }
      return newHistory;
    });

    // Add command to output
    const commandLine: OutputLine = {
      type: 'command',
      content: `${currentDirectory}$ ${command}`,
      timestamp: new Date(),
    };

    // Parse command
    const parsed = parser.parse(command);

    // Validate command
    const validation = parser.validate(parsed);

    // Execute command
    const result = executor.execute(parsed, fileSystem);

    // Update output lines
    const newOutputLines: OutputLine[] = [commandLine];

    // Add validation warnings if any
    if (validation.warnings.length > 0) {
      validation.warnings.forEach(warning => {
        newOutputLines.push({
          type: 'info',
          content: warning,
          timestamp: new Date(),
        });
      });
    }

    // Add execution output
    newOutputLines.push(...result.output);

    setOutputLines(prev => [...prev, ...newOutputLines]);

    // Update current directory if cd command was successful
    if (parsed.command === 'cd' && result.exitCode === 0) {
      setCurrentDirectory(fileSystem.getCurrentDirectory());
    }

    // Handle clear command
    if (parsed.command === 'clear') {
      setOutputLines([]);
    }

    // Handle exit/gui commands
    if ((parsed.command === 'exit' || parsed.command === 'gui') && result.exitCode === 0) {
      onClose();
    }

    // Re-enable auto-scroll after command execution
    setIsAutoScrollEnabled(true);
  }, [currentDirectory, parser, executor, fileSystem, onClose]);

  // Handle showing completions (optional callback for TerminalInput)
  const handleShowCompletions = useCallback((completions: string[]) => {
    if (completions.length > 1) {
      const completionLine: OutputLine = {
        type: 'info',
        content: completions.join('  '),
        timestamp: new Date(),
      };
      setOutputLines(prev => [...prev, completionLine]);
    }
  }, []);

  // Handle minimize button click
  const handleMinimize = useCallback(() => {
    setWindowState('minimized');
  }, []);

  // Handle maximize button click
  const handleMaximize = useCallback(() => {
    setWindowState(prev => prev === 'maximized' ? 'normal' : 'maximized');
  }, []);

  // Handle close button click
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Handle restore from minimized state
  const handleRestore = useCallback(() => {
    setWindowState('normal');
  }, []);

  // Handle drag start for window movement
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (windowState !== 'normal') return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - windowPosition.x, y: e.clientY - windowPosition.y });
  }, [windowState, windowPosition]);

  // Handle drag for window movement
  const handleDrag = useCallback((e: React.MouseEvent) => {
    if (!isDragging || windowState !== 'normal') return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setWindowPosition({ x: newX, y: newY });
  }, [isDragging, windowState, dragStart]);

  // Handle drag end for window movement
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle resize start
  const handleResizeStart = useCallback((e: React.MouseEvent, direction: string) => {
    if (windowState !== 'normal') return;
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, [windowState]);

  // Handle resize move
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      setWindowSize(prev => {
        let newWidth = prev.width;
        let newHeight = prev.height;
        let newX = windowPosition.x;
        let newY = windowPosition.y;

        // Minimum and maximum constraints
        const minWidth = 400;
        const minHeight = 300;
        const maxWidth = window.innerWidth - 40;
        const maxHeight = window.innerHeight - 40;

        if (resizeDirection.includes('e')) {
          newWidth = Math.max(minWidth, Math.min(maxWidth, prev.width + deltaX));
        }
        if (resizeDirection.includes('w')) {
          const potentialWidth = prev.width - deltaX;
          if (potentialWidth >= minWidth && potentialWidth <= maxWidth) {
            newWidth = potentialWidth;
            newX = windowPosition.x + deltaX;
          }
        }
        if (resizeDirection.includes('s')) {
          newHeight = Math.max(minHeight, Math.min(maxHeight, prev.height + deltaY));
        }
        if (resizeDirection.includes('n')) {
          const potentialHeight = prev.height - deltaY;
          if (potentialHeight >= minHeight && potentialHeight <= maxHeight) {
            newHeight = potentialHeight;
            newY = windowPosition.y + deltaY;
          }
        }

        setWindowPosition({ x: newX, y: newY });
        setDragStart({ x: e.clientX, y: e.clientY });

        return { width: newWidth, height: newHeight };
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeDirection('');
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeDirection, dragStart, windowPosition]);

  return (
    <>
      {/* Minimized Indicator - Only shown when minimized */}
      <AnimatePresence>
        {windowState === 'minimized' && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-4 left-4 z-50 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-800 transition-colors duration-150 shadow-lg"
            onClick={handleRestore}
            role="button"
            aria-label="Restore terminal"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleRestore();
              }
            }}
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-mono text-gray-300">Terminal</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terminal Window - Hidden when minimized */}
      <AnimatePresence>
        {windowState !== 'minimized' && (
          <motion.div
            key="terminal-window"
            initial={
              windowState === 'maximized'
                ? { opacity: 0, scale: 0.95 }
                : { opacity: 0, scale: 0.9, y: 20 }
            }
            animate={
              windowState === 'maximized'
                ? { opacity: 1, scale: 1 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            exit={
              windowState === 'maximized'
                ? { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
                : { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } }
            }
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`terminal-view fixed z-50 terminal-bg flex flex-col touch-manipulation ${
              windowState === 'maximized' 
                ? 'inset-0' 
                : 'rounded-lg shadow-2xl border border-gray-800'
            }`}
            style={
              windowState === 'normal'
                ? {
                    width: `${windowSize.width}px`,
                    height: `${windowSize.height}px`,
                    left: `${windowPosition.x}px`,
                    top: `${windowPosition.y}px`,
                    transform: 'none',
                  }
                : { height: `${viewportHeight}px` }
            }
            role="application"
            aria-label="Interactive terminal interface"
          >
            {/* Window Controls */}
            <TerminalWindowControls
              windowState={windowState}
              onMinimize={handleMinimize}
              onMaximize={handleMaximize}
              onClose={handleClose}
              title={mainPortfolioText.terminal.windowTitle}
              onDragStart={handleDragStart}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
            />

            {/* Terminal Display with integrated input */}
            <TerminalDisplay
              outputLines={outputLines}
              isAutoScrollEnabled={isAutoScrollEnabled}
              onScroll={handleScroll}
              onTerminalClick={() => {}} // Click-to-focus is handled within TerminalDisplay
              currentDirectory={currentDirectory}
              onCommandSubmit={handleCommandSubmit}
              commandHistory={commandHistory}
              availableCommands={availableCommands}
              fileSystem={fileSystem}
              onShowCompletions={handleShowCompletions}
            />

            {/* Resize Handles (only in normal mode) */}
            {windowState === 'normal' && (
              <>
                {/* Corner Handles */}
                <div
                  className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize"
                  onMouseDown={(e) => handleResizeStart(e, 'nw')}
                  aria-label="Resize top-left"
                />
                <div
                  className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize"
                  onMouseDown={(e) => handleResizeStart(e, 'ne')}
                  aria-label="Resize top-right"
                />
                <div
                  className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize"
                  onMouseDown={(e) => handleResizeStart(e, 'sw')}
                  aria-label="Resize bottom-left"
                />
                <div
                  className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
                  onMouseDown={(e) => handleResizeStart(e, 'se')}
                  aria-label="Resize bottom-right"
                />

                {/* Edge Handles */}
                <div
                  className="absolute top-0 left-4 right-4 h-2 cursor-n-resize"
                  onMouseDown={(e) => handleResizeStart(e, 'n')}
                  aria-label="Resize top"
                />
                <div
                  className="absolute bottom-0 left-4 right-4 h-2 cursor-s-resize"
                  onMouseDown={(e) => handleResizeStart(e, 's')}
                  aria-label="Resize bottom"
                />
                <div
                  className="absolute left-0 top-4 bottom-4 w-2 cursor-w-resize"
                  onMouseDown={(e) => handleResizeStart(e, 'w')}
                  aria-label="Resize left"
                />
                <div
                  className="absolute right-0 top-4 bottom-4 w-2 cursor-e-resize"
                  onMouseDown={(e) => handleResizeStart(e, 'e')}
                  aria-label="Resize right"
                />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
