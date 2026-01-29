import type {
  PortfolioData,
  TerminalState,
  OutputLine,
  // ParsedCommand,
} from '../../lib/terminal/types';
import type { VirtualFileSystem } from '../../lib/terminal/VirtualFileSystem';

/**
 * Props for the main TerminalView component
 */
export interface TerminalViewProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioData: PortfolioData;
}

/**
 * Props for TerminalDisplay component
 */
export interface TerminalDisplayProps {
  outputLines: OutputLine[];
  isAutoScrollEnabled: boolean;
  onScroll: (isAtBottom: boolean) => void;
  onTerminalClick: () => void;
  currentDirectory: string;
  onCommandSubmit: (command: string) => void;
  commandHistory: string[];
  availableCommands: string[];
  fileSystem: VirtualFileSystem;
  onShowCompletions?: (completions: string[]) => void;
}

/**
 * Props for TerminalInput component
 */
export interface TerminalInputProps {
  currentDirectory: string;
  onSubmit: (command: string) => void;
  commandHistory: string[];
  availableCommands: string[];
  currentPath: string;
  fileSystem?: VirtualFileSystem;
  onShowCompletions?: (completions: string[]) => void;
  onFocusChange?: (isFocused: boolean) => void;
}

/**
 * Internal state for terminal components
 */
export interface TerminalComponentState extends TerminalState {
  inputValue: string;
  isProcessing: boolean;
}

/**
 * Props for TerminalWindowControls component
 */
export interface TerminalWindowControlsProps {
  windowState: 'normal' | 'minimized' | 'maximized';
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  title?: string;
  onDragStart?: (e: React.MouseEvent) => void;
  onDrag?: (e: React.MouseEvent) => void;
  onDragEnd?: (e: React.MouseEvent) => void;
}
