import type { FileSystemNode, Result, PortfolioData } from './types';
import { FileSystemBuilder } from './FileSystemBuilder';
import { PortfolioDataMapper } from './PortfolioDataMapper';

/**
 * VirtualFileSystem manages a virtual file system structure for the terminal
 * Provides navigation, file reading, and directory listing capabilities
 */
export class VirtualFileSystem {
  private root: FileSystemNode;
  private currentPath: string;
  private contentCache: Map<string, string>; // Cache for file contents

  constructor(root?: FileSystemNode) {
    this.currentPath = '/';
    this.root = root || this.initializeFileSystem();
    this.contentCache = new Map();
  }

  /**
   * Create a VirtualFileSystem with portfolio data
   */
  static withPortfolioData(portfolioData?: PortfolioData): VirtualFileSystem {
    const data = portfolioData || PortfolioDataMapper.getPortfolioData();
    const root = FileSystemBuilder.buildFileSystem(data);
    return new VirtualFileSystem(root);
  }

  /**
   * Initialize the file system structure with portfolio content
   */
  private initializeFileSystem(): FileSystemNode {
    return {
      name: '/',
      type: 'directory',
      children: {
        'README.md': {
          name: 'README.md',
          type: 'file',
          content: `# Welcome to Dheeraj's Portfolio Terminal

Navigate through my portfolio using familiar Linux commands:

## Available Commands:
- ls              List directory contents
- cd <dir>        Change directory
- pwd             Print working directory
- cat <file>      Display file contents
- help            Show all available commands
- clear           Clear terminal output
- exit/gui        Return to GUI view

## Quick Access:
- about           View about section
- experience      View work experience
- projects        View projects
- skills          View technical skills
- contact         View contact information

## Directory Structure:
/
├── about.txt
├── experience/
├── projects/
├── skills/
└── contact/

Type 'help' for more information or start exploring!
`,
        },
        'about.txt': {
          name: 'about.txt',
          type: 'file',
          content: personalInfo.bio,
        },
        experience: {
          name: 'experience',
          type: 'directory',
          children: {},
        },
        projects: {
          name: 'projects',
          type: 'directory',
          children: {},
        },
        skills: {
          name: 'skills',
          type: 'directory',
          children: {},
        },
        contact: {
          name: 'contact',
          type: 'directory',
          children: {},
        },
        '.secrets': {
          name: '.secrets',
          type: 'directory',
          children: {
            'easter-eggs.txt': {
              name: 'easter-eggs.txt',
              type: 'file',
              content: `🎉 You found the secret directory!

Here are some fun commands to try:
- whoami
- neofetch
- date

Keep exploring, there might be more surprises...
`,
            },
          },
        },
      },
    };
  }

  /**
   * Get the current working directory path
   */
  getCurrentDirectory(): string {
    return this.currentPath;
  }

  /**
   * Change the current directory
   */
  changeDirectory(path: string): Result<string> {
    const resolvedPath = this.resolvePath(path);
    const node = this.getNodeAtPath(resolvedPath);

    if (!node.success || !node.data) {
      return { success: false, error: `cd: ${path}: No such file or directory` };
    }

    if (node.data.type !== 'directory') {
      return { success: false, error: `cd: ${path}: Not a directory` };
    }

    this.currentPath = resolvedPath;
    return { success: true, data: resolvedPath };
  }

  /**
   * List contents of a directory
   */
  listDirectory(path?: string): Result<FileSystemNode[]> {
    const targetPath = path ? this.resolvePath(path) : this.currentPath;
    const node = this.getNodeAtPath(targetPath);

    if (!node.success || !node.data) {
      return { success: false, error: `ls: cannot access '${path || '.'}': No such file or directory` };
    }

    if (node.data.type !== 'directory') {
      return { success: false, error: `ls: ${path || '.'}: Not a directory` };
    }

    if (!node.data.children) {
      return { success: true, data: [] };
    }

    const children = Object.values(node.data.children);
    return { success: true, data: children };
  }

  /**
   * Read contents of a file with caching
   */
  readFile(path: string): Result<string> {
    const resolvedPath = this.resolvePath(path);
    
    // Check cache first
    if (this.contentCache.has(resolvedPath)) {
      return { success: true, data: this.contentCache.get(resolvedPath)! };
    }
    
    const node = this.getNodeAtPath(resolvedPath);

    if (!node.success || !node.data) {
      return { success: false, error: `cat: ${path}: No such file or directory` };
    }

    if (node.data.type === 'directory') {
      return { success: false, error: `cat: ${path}: Is a directory` };
    }

    const content = node.data.content || '';
    
    // Cache the content for future reads
    this.contentCache.set(resolvedPath, content);
    
    return { success: true, data: content };
  }

  /**
   * Resolve a path to absolute form
   * Handles special cases: ., .., /, ~
   */
  resolvePath(path: string): string {
    // Handle home directory (~)
    if (path === '~' || path.startsWith('~/')) {
      path = path.replace('~', '');
    }

    // Handle absolute paths
    if (path.startsWith('/')) {
      return this.normalizePath(path);
    }

    // Handle relative paths
    const parts = this.currentPath.split('/').filter(p => p);
    const pathParts = path.split('/').filter(p => p);

    for (const part of pathParts) {
      if (part === '..') {
        parts.pop();
      } else if (part !== '.') {
        parts.push(part);
      }
    }

    return '/' + parts.join('/');
  }

  /**
   * Normalize a path by resolving . and .. components
   */
  private normalizePath(path: string): string {
    const parts = path.split('/').filter(p => p);
    const normalized: string[] = [];

    for (const part of parts) {
      if (part === '..') {
        normalized.pop();
      } else if (part !== '.') {
        normalized.push(part);
      }
    }

    return '/' + normalized.join('/');
  }

  /**
   * Get a node at the specified path
   */
  private getNodeAtPath(path: string): Result<FileSystemNode> {
    if (path === '/') {
      return { success: true, data: this.root };
    }

    const parts = path.split('/').filter(p => p);
    let current = this.root;

    for (const part of parts) {
      if (!current.children || !current.children[part]) {
        return { success: false, error: `Path not found: ${path}` };
      }
      current = current.children[part];
    }

    return { success: true, data: current };
  }

  /**
   * Get the working directory (alias for getCurrentDirectory)
   */
  getWorkingDirectory(): string {
    return this.getCurrentDirectory();
  }

  /**
   * Get available completions for a partial path
   * Used for tab auto-completion
   */
  getCompletions(partial: string): string[] {
    // If partial is empty, return children of current directory
    if (!partial) {
      const result = this.listDirectory();
      if (result.success && result.data) {
        return result.data.map(node => node.name);
      }
      return [];
    }

    // Split partial into directory and filename parts
    const lastSlash = partial.lastIndexOf('/');
    let dirPath = '';
    let filePrefix = partial;

    if (lastSlash !== -1) {
      dirPath = partial.substring(0, lastSlash + 1);
      filePrefix = partial.substring(lastSlash + 1);
    }

    // Get directory to search in
    const searchPath = dirPath ? this.resolvePath(dirPath) : this.currentPath;
    const result = this.listDirectory(searchPath);

    if (!result.success || !result.data) {
      return [];
    }

    // Filter nodes that start with the file prefix
    const matches = result.data
      .filter(node => node.name.startsWith(filePrefix))
      .map(node => {
        const name = node.type === 'directory' ? node.name + '/' : node.name;
        return dirPath + name;
      });

    return matches;
  }
}
