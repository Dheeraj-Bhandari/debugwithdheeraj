// Core Terminal Types

/**
 * Represents a node in the virtual file system
 */
export interface FileSystemNode {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: Record<string, FileSystemNode>;
  metadata?: FileMetadata;
}

/**
 * Metadata for file system nodes
 */
export interface FileMetadata {
  size?: number;
  created?: Date;
  modified?: Date;
  permissions?: string;
}

/**
 * Result type for operations that can fail
 */
export interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Parsed command structure
 */
export interface ParsedCommand {
  command: string;
  args: string[];
  flags: Record<string, boolean>;
  rawInput: string;
}

/**
 * Command validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Output line in terminal display
 */
export interface OutputLine {
  type: 'command' | 'output' | 'error' | 'info';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * Result of command execution
 */
export interface ExecutionResult {
  output: OutputLine[];
  exitCode: number;
  error?: string;
}

/**
 * Terminal session state
 */
export interface TerminalSession {
  id: string;
  startTime: Date;
  currentDirectory: string;
  commandHistory: CommandHistoryEntry[];
  outputBuffer: OutputLine[];
  environment: Record<string, string>;
}

/**
 * Command history entry
 */
export interface CommandHistoryEntry {
  command: string;
  timestamp: Date;
  exitCode: number;
  duration: number;
}

/**
 * Auto-completion result
 */
export interface AutoCompleteResult {
  matches: string[];
  commonPrefix: string;
  isUnique: boolean;
}

/**
 * Terminal state for React component
 */
export interface TerminalState {
  currentDirectory: string;
  commandHistory: string[];
  historyIndex: number;
  outputLines: OutputLine[];
  isAutoScrollEnabled: boolean;
}

// Portfolio Data Models

/**
 * Complete portfolio data structure
 */
export interface PortfolioData {
  about: AboutData;
  experience: ExperienceData[];
  projects: ProjectData[];
  skills: SkillsData;
  contact: ContactData;
}

/**
 * About section data
 */
export interface AboutData {
  name: string;
  role: string;
  bio: string;
  highlights: string[];
  stats: Stat[];
}

/**
 * Stat for about section
 */
export interface Stat {
  label: string;
  value: string;
}

/**
 * Experience/work history data
 */
export interface ExperienceData {
  company: string;
  role: string;
  period: string;
  achievements: string[];
  link?: string;
}

/**
 * Project data
 */
export interface ProjectData {
  title: string;
  description: string;
  tech: string[];
  metrics: Metric[];
  links: Link[];
}

/**
 * Project metric
 */
export interface Metric {
  label: string;
  value: string;
}

/**
 * Link for projects or contact
 */
export interface Link {
  label: string;
  url: string;
  type?: 'github' | 'demo' | 'docs' | 'other';
}

/**
 * Skills data
 */
export interface SkillsData {
  languages: string[];
  frameworks: string[];
  tools: string[];
  databases: string[];
}

/**
 * Contact information
 */
export interface ContactData {
  email: string;
  github: string;
  linkedin: string;
  twitter?: string;
  resume: string;
}
