import type { ParsedCommand, ExecutionResult, OutputLine } from './types';
import type { VirtualFileSystem } from './VirtualFileSystem';

/**
 * Type for command handler functions
 */
type CommandHandler = (
  parsed: ParsedCommand,
  fs: VirtualFileSystem
) => ExecutionResult;

/**
 * CommandExecutor executes parsed commands and generates output
 * Manages command registry and dispatches to appropriate handlers
 */
export class CommandExecutor {
  private commandRegistry: Map<string, CommandHandler>;

  constructor() {
    this.commandRegistry = new Map();
    this.registerCommands();
  }

  /**
   * Register all command handlers
   */
  private registerCommands(): void {
    // Navigation commands
    this.commandRegistry.set('ls', this.handleLs.bind(this));
    this.commandRegistry.set('cd', this.handleCd.bind(this));
    this.commandRegistry.set('pwd', this.handlePwd.bind(this));

    // File operations
    this.commandRegistry.set('cat', this.handleCat.bind(this));

    // Utility commands
    this.commandRegistry.set('help', this.handleHelp.bind(this));
    this.commandRegistry.set('clear', this.handleClear.bind(this));
    this.commandRegistry.set('echo', this.handleEcho.bind(this));
    this.commandRegistry.set('whoami', this.handleWhoami.bind(this));
    this.commandRegistry.set('date', this.handleDate.bind(this));

    // Portfolio shortcuts
    this.commandRegistry.set('about', this.handleAbout.bind(this));
    this.commandRegistry.set('experience', this.handleExperience.bind(this));
    this.commandRegistry.set('projects', this.handleProjects.bind(this));
    this.commandRegistry.set('skills', this.handleSkills.bind(this));
    this.commandRegistry.set('contact', this.handleContact.bind(this));

    // System commands
    this.commandRegistry.set('exit', this.handleExit.bind(this));
    this.commandRegistry.set('gui', this.handleExit.bind(this));
    this.commandRegistry.set('neofetch', this.handleNeofetch.bind(this));
  }

  /**
   * Execute a parsed command
   * 
   * @param parsed - ParsedCommand to execute
   * @param fs - VirtualFileSystem instance
   * @returns ExecutionResult with output lines and exit code
   */
  execute(parsed: ParsedCommand, fs: VirtualFileSystem): ExecutionResult {
    // Handle empty command
    if (!parsed.command) {
      return {
        output: [],
        exitCode: 0,
      };
    }

    // Get command handler
    const handler = this.commandRegistry.get(parsed.command);

    if (!handler) {
      // Command not found
      return {
        output: [
          this.createOutputLine('error', `bash: ${parsed.command}: command not found`),
          this.createOutputLine('info', "Type 'help' to see available commands"),
        ],
        exitCode: 127,
        error: 'Command not found',
      };
    }

    // Execute command handler
    try {
      return handler(parsed, fs);
    } catch (error) {
      return {
        output: [
          this.createOutputLine('error', `Error executing ${parsed.command}: ${error}`),
        ],
        exitCode: 1,
        error: String(error),
      };
    }
  }

  /**
   * Create an output line with timestamp
   */
  private createOutputLine(
    type: OutputLine['type'],
    content: string,
    metadata?: Record<string, any>
  ): OutputLine {
    return {
      type,
      content,
      timestamp: new Date(),
      metadata,
    };
  }

  // Command handlers - to be implemented in subsequent sub-tasks

  private handleLs(parsed: ParsedCommand, fs: VirtualFileSystem): ExecutionResult {
    const path = parsed.args[0];
    const result = fs.listDirectory(path);

    if (!result.success) {
      return {
        output: [this.createOutputLine('error', result.error || 'Unknown error')],
        exitCode: 1,
        error: result.error,
      };
    }

    const nodes = result.data || [];
    
    if (nodes.length === 0) {
      return {
        output: [],
        exitCode: 0,
      };
    }

    // Sort: directories first, then files, alphabetically
    const sorted = nodes.sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }
      return a.type === 'directory' ? -1 : 1;
    });

    // Format output with color coding
    const lines = sorted.map(node => {
      const isDir = node.type === 'directory';
      const name = isDir ? node.name + '/' : node.name;
      
      return this.createOutputLine('output', name, {
        isDirectory: isDir,
        color: isDir ? 'blue' : 'white',
      });
    });

    return {
      output: lines,
      exitCode: 0,
    };
  }

  private handleCd(parsed: ParsedCommand, fs: VirtualFileSystem): ExecutionResult {
    // Default to home directory if no argument
    const path = parsed.args[0] || '~';
    const result = fs.changeDirectory(path);

    if (!result.success) {
      return {
        output: [this.createOutputLine('error', result.error || 'Unknown error')],
        exitCode: 1,
        error: result.error,
      };
    }

    // cd command typically produces no output on success
    return {
      output: [],
      exitCode: 0,
    };
  }

  private handlePwd(_parsed: ParsedCommand, fs: VirtualFileSystem): ExecutionResult {
    const currentDir = fs.getCurrentDirectory();
    
    return {
      output: [this.createOutputLine('output', currentDir)],
      exitCode: 0,
    };
  }

  private handleCat(parsed: ParsedCommand, fs: VirtualFileSystem): ExecutionResult {
    if (parsed.args.length === 0) {
      return {
        output: [this.createOutputLine('error', 'cat: missing file operand')],
        exitCode: 1,
        error: 'Missing file operand',
      };
    }

    const path = parsed.args[0];
    const result = fs.readFile(path);

    if (!result.success) {
      return {
        output: [this.createOutputLine('error', result.error || 'Unknown error')],
        exitCode: 1,
        error: result.error,
      };
    }

    const content = result.data || '';
    
    // Detect file type from extension
    const fileType = this.detectFileType(path);
    
    // Split content into lines for output
    const lines = content.split('\n').map(line => 
      this.createOutputLine('output', line, {
        fileType,
        syntaxHighlight: fileType !== 'txt',
      })
    );

    return {
      output: lines,
      exitCode: 0,
    };
  }

  /**
   * Detect file type from filename extension
   */
  private detectFileType(filename: string): 'txt' | 'json' | 'md' | 'unknown' {
    const ext = filename.split('.').pop()?.toLowerCase();
    
    switch (ext) {
      case 'json':
        return 'json';
      case 'md':
      case 'markdown':
        return 'md';
      case 'txt':
        return 'txt';
      default:
        return 'txt'; // Default to text
    }
  }

  private handleHelp(parsed: ParsedCommand, _fs: VirtualFileSystem): ExecutionResult {
    const specificCommand = parsed.args[0];

    if (specificCommand) {
      // Show help for specific command
      return this.showCommandHelp(specificCommand);
    }

    // Show general help with all commands
    const output: OutputLine[] = [
      this.createOutputLine('info', 'Available Commands:'),
      this.createOutputLine('info', ''),
      this.createOutputLine('info', 'Navigation:'),
      this.createOutputLine('output', '  ls [path]         List directory contents'),
      this.createOutputLine('output', '  cd <directory>    Change directory'),
      this.createOutputLine('output', '  pwd               Print working directory'),
      this.createOutputLine('info', ''),
      this.createOutputLine('info', 'File Operations:'),
      this.createOutputLine('output', '  cat <file>        Display file contents'),
      this.createOutputLine('info', ''),
      this.createOutputLine('info', 'Portfolio Shortcuts:'),
      this.createOutputLine('output', '  about             View about section'),
      this.createOutputLine('output', '  experience        View work experience'),
      this.createOutputLine('output', '  projects          View featured projects'),
      this.createOutputLine('output', '  skills            View technical skills'),
      this.createOutputLine('output', '  contact           View contact information'),
      this.createOutputLine('info', ''),
      this.createOutputLine('info', 'Utilities:'),
      this.createOutputLine('output', '  help [command]    Show help (or help for specific command)'),
      this.createOutputLine('output', '  clear             Clear terminal output'),
      this.createOutputLine('output', '  echo <text>       Display text'),
      this.createOutputLine('output', '  whoami            Display user information'),
      this.createOutputLine('output', '  date              Display current date and time'),
      this.createOutputLine('output', '  neofetch          Display system banner'),
      this.createOutputLine('info', ''),
      this.createOutputLine('info', 'System:'),
      this.createOutputLine('output', '  exit              Return to GUI view'),
      this.createOutputLine('output', '  gui               Return to GUI view'),
      this.createOutputLine('info', ''),
      this.createOutputLine('info', 'Tips:'),
      this.createOutputLine('output', '  - Use Tab for auto-completion'),
      this.createOutputLine('output', '  - Use Up/Down arrows for command history'),
      this.createOutputLine('output', '  - Try exploring the .secrets directory!'),
    ];

    return {
      output,
      exitCode: 0,
    };
  }

  /**
   * Show help for a specific command
   */
  private showCommandHelp(command: string): ExecutionResult {
    const helpText: Record<string, string[]> = {
      ls: [
        'ls [path] - List directory contents',
        '',
        'Lists files and directories in the current or specified directory.',
        'Directories are shown with a trailing slash (/).',
        '',
        'Examples:',
        '  ls              List current directory',
        '  ls projects     List contents of projects directory',
      ],
      cd: [
        'cd <directory> - Change directory',
        '',
        'Changes the current working directory.',
        '',
        'Special paths:',
        '  .               Current directory',
        '  ..              Parent directory',
        '  /               Root directory',
        '  ~               Home directory',
        '',
        'Examples:',
        '  cd projects     Change to projects directory',
        '  cd ..           Go to parent directory',
        '  cd /            Go to root directory',
      ],
      pwd: [
        'pwd - Print working directory',
        '',
        'Displays the current working directory path.',
      ],
      cat: [
        'cat <file> - Display file contents',
        '',
        'Displays the contents of a file.',
        'Supports syntax highlighting for JSON and Markdown files.',
        '',
        'Examples:',
        '  cat README.md',
        '  cat about.txt',
      ],
      help: [
        'help [command] - Show help',
        '',
        'Displays help information.',
        'Without arguments, shows all available commands.',
        'With a command name, shows detailed help for that command.',
        '',
        'Examples:',
        '  help            Show all commands',
        '  help cd         Show help for cd command',
      ],
      clear: [
        'clear - Clear terminal output',
        '',
        'Clears all previous output from the terminal.',
      ],
      echo: [
        'echo <text> - Display text',
        '',
        'Displays the provided text.',
        '',
        'Examples:',
        '  echo Hello World',
        '  echo "Quoted text"',
      ],
      whoami: [
        'whoami - Display user information',
        '',
        'Displays information about the portfolio owner.',
      ],
      date: [
        'date - Display current date and time',
        '',
        'Shows the current date and time.',
      ],
      neofetch: [
        'neofetch - Display system banner',
        '',
        'Shows a stylized system information banner.',
      ],
      about: [
        'about - View about section',
        '',
        'Quick access to the about section.',
        'Equivalent to: cat /about.txt',
      ],
      experience: [
        'experience - View work experience',
        '',
        'Quick access to work experience.',
        'Equivalent to: ls /experience && cat /experience/*',
      ],
      projects: [
        'projects - View featured projects',
        '',
        'Quick access to featured projects.',
        'Equivalent to: ls /projects && cat /projects/*',
      ],
      skills: [
        'skills - View technical skills',
        '',
        'Quick access to technical skills.',
        'Equivalent to: cat /skills/*',
      ],
      contact: [
        'contact - View contact information',
        '',
        'Quick access to contact information.',
        'Equivalent to: cat /contact/*',
      ],
      exit: [
        'exit - Return to GUI view',
        '',
        'Closes the terminal and returns to the graphical interface.',
        'Alias: gui',
      ],
      gui: [
        'gui - Return to GUI view',
        '',
        'Closes the terminal and returns to the graphical interface.',
        'Alias: exit',
      ],
    };

    const help = helpText[command];

    if (!help) {
      return {
        output: [
          this.createOutputLine('error', `No help available for: ${command}`),
          this.createOutputLine('info', "Type 'help' to see all available commands"),
        ],
        exitCode: 1,
      };
    }

    const output = help.map(line => this.createOutputLine('output', line));

    return {
      output,
      exitCode: 0,
    };
  }

  private handleClear(_parsed: ParsedCommand, _fs: VirtualFileSystem): ExecutionResult {
    // Clear command returns special metadata to signal terminal to clear
    return {
      output: [
        this.createOutputLine('info', '', { clearScreen: true }),
      ],
      exitCode: 0,
    };
  }

  private handleEcho(parsed: ParsedCommand, _fs: VirtualFileSystem): ExecutionResult {
    const text = parsed.args.join(' ');
    
    return {
      output: [this.createOutputLine('output', text)],
      exitCode: 0,
    };
  }

  private handleWhoami(_parsed: ParsedCommand, _fs: VirtualFileSystem): ExecutionResult {
    const output: OutputLine[] = [
      this.createOutputLine('info', '👋 Hi there!'),
      this.createOutputLine('info', ''),
      this.createOutputLine('output', 'Name: Dheeraj Kumar'),
      this.createOutputLine('output', 'Role: Senior Software Engineer'),
      this.createOutputLine('output', 'Location: Building cool stuff with code'),
      this.createOutputLine('info', ''),
      this.createOutputLine('output', 'I specialize in:'),
      this.createOutputLine('output', '  • Full-stack development'),
      this.createOutputLine('output', '  • AI/ML systems'),
      this.createOutputLine('output', '  • Distributed systems'),
      this.createOutputLine('output', '  • Cloud infrastructure'),
      this.createOutputLine('info', ''),
      this.createOutputLine('info', "Type 'about' to learn more!"),
    ];

    return {
      output,
      exitCode: 0,
    };
  }

  private handleDate(_parsed: ParsedCommand, _fs: VirtualFileSystem): ExecutionResult {
    const now = new Date();
    const dateString = now.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    });

    return {
      output: [this.createOutputLine('output', dateString)],
      exitCode: 0,
    };
  }

  private handleAbout(_parsed: ParsedCommand, fs: VirtualFileSystem): ExecutionResult {
    // Read about.txt file
    const result = fs.readFile('/about.txt');

    if (!result.success) {
      return {
        output: [this.createOutputLine('error', result.error || 'Could not read about section')],
        exitCode: 1,
        error: result.error,
      };
    }

    const content = result.data || '';
    const lines = content.split('\n').map(line => 
      this.createOutputLine('output', line)
    );

    return {
      output: lines,
      exitCode: 0,
    };
  }

  private handleExperience(_parsed: ParsedCommand, fs: VirtualFileSystem): ExecutionResult {
    // List experience directory
    const listResult = fs.listDirectory('/experience');

    if (!listResult.success) {
      return {
        output: [this.createOutputLine('error', listResult.error || 'Could not read experience')],
        exitCode: 1,
        error: listResult.error,
      };
    }

    const files = listResult.data || [];
    const output: OutputLine[] = [];

    // Add header
    output.push(this.createOutputLine('info', 'Work Experience'));
    output.push(this.createOutputLine('info', '==============='));
    output.push(this.createOutputLine('info', ''));

    // Read each experience file
    files.forEach((file, index) => {
      if (file.type === 'file') {
        const fileResult = fs.readFile(`/experience/${file.name}`);
        if (fileResult.success && fileResult.data) {
          // Parse JSON and format
          try {
            const exp = JSON.parse(fileResult.data);
            
            if (index > 0) {
              output.push(this.createOutputLine('info', ''));
              output.push(this.createOutputLine('info', '---'));
              output.push(this.createOutputLine('info', ''));
            }

            output.push(this.createOutputLine('output', `${exp.company} - ${exp.role}`));
            output.push(this.createOutputLine('output', exp.period));
            if (exp.link) {
              output.push(this.createOutputLine('output', `🔗 ${exp.link}`));
            }
            output.push(this.createOutputLine('info', ''));
            output.push(this.createOutputLine('output', 'Key Achievements:'));
            exp.achievements.forEach((achievement: string) => {
              output.push(this.createOutputLine('output', `  • ${achievement}`));
            });
          } catch (e) {
            output.push(this.createOutputLine('error', `Error parsing ${file.name}`));
          }
        }
      }
    });

    return {
      output,
      exitCode: 0,
    };
  }

  private handleProjects(_parsed: ParsedCommand, fs: VirtualFileSystem): ExecutionResult {
    // List projects directory
    const listResult = fs.listDirectory('/projects');

    if (!listResult.success) {
      return {
        output: [this.createOutputLine('error', listResult.error || 'Could not read projects')],
        exitCode: 1,
        error: listResult.error,
      };
    }

    const files = listResult.data || [];
    const output: OutputLine[] = [];

    // Add header
    output.push(this.createOutputLine('info', 'Featured Projects'));
    output.push(this.createOutputLine('info', '================='));
    output.push(this.createOutputLine('info', ''));

    // Read each project file
    files.forEach((file, index) => {
      if (file.type === 'file') {
        const fileResult = fs.readFile(`/projects/${file.name}`);
        if (fileResult.success && fileResult.data) {
          if (index > 0) {
            output.push(this.createOutputLine('info', ''));
            output.push(this.createOutputLine('info', '---'));
            output.push(this.createOutputLine('info', ''));
          }

          // Display markdown content
          const lines = fileResult.data.split('\n');
          lines.forEach(line => {
            output.push(this.createOutputLine('output', line, { fileType: 'md' }));
          });
        }
      }
    });

    return {
      output,
      exitCode: 0,
    };
  }

  private handleSkills(_parsed: ParsedCommand, fs: VirtualFileSystem): ExecutionResult {
    // List skills directory
    const listResult = fs.listDirectory('/skills');

    if (!listResult.success) {
      return {
        output: [this.createOutputLine('error', listResult.error || 'Could not read skills')],
        exitCode: 1,
        error: listResult.error,
      };
    }

    const files = listResult.data || [];
    const output: OutputLine[] = [];

    // Add header
    output.push(this.createOutputLine('info', 'Technical Skills'));
    output.push(this.createOutputLine('info', '================'));
    output.push(this.createOutputLine('info', ''));

    // Read each skills file
    files.forEach((file) => {
      if (file.type === 'file') {
        const fileResult = fs.readFile(`/skills/${file.name}`);
        if (fileResult.success && fileResult.data) {
          const lines = fileResult.data.split('\n');
          lines.forEach(line => {
            output.push(this.createOutputLine('output', line));
          });
          output.push(this.createOutputLine('info', ''));
        }
      }
    });

    return {
      output,
      exitCode: 0,
    };
  }

  private handleContact(_parsed: ParsedCommand, fs: VirtualFileSystem): ExecutionResult {
    // List contact directory
    const listResult = fs.listDirectory('/contact');

    if (!listResult.success) {
      return {
        output: [this.createOutputLine('error', listResult.error || 'Could not read contact')],
        exitCode: 1,
        error: listResult.error,
      };
    }

    const files = listResult.data || [];
    const output: OutputLine[] = [];

    // Add header
    output.push(this.createOutputLine('info', 'Contact Information'));
    output.push(this.createOutputLine('info', '==================='));
    output.push(this.createOutputLine('info', ''));

    // Read each contact file
    files.forEach((file) => {
      if (file.type === 'file') {
        const fileResult = fs.readFile(`/contact/${file.name}`);
        if (fileResult.success && fileResult.data) {
          const lines = fileResult.data.split('\n');
          lines.forEach(line => {
            output.push(this.createOutputLine('output', line));
          });
          output.push(this.createOutputLine('info', ''));
        }
      }
    });

    return {
      output,
      exitCode: 0,
    };
  }

  private handleExit(_parsed: ParsedCommand, _fs: VirtualFileSystem): ExecutionResult {
    // Exit command - returns special exit code
    return {
      output: [this.createOutputLine('info', 'Returning to GUI view...')],
      exitCode: 0,
      error: undefined,
    };
  }

  private handleNeofetch(_parsed: ParsedCommand, _fs: VirtualFileSystem): ExecutionResult {
    const output: OutputLine[] = [];

    // ASCII art banner
    const banner = [
      '                 ___           ___           ___     ',
      '    ___         /  /\\         /  /\\         /  /\\    ',
      '   /  /\\       /  /::\\       /  /:/_       /  /::\\   ',
      '  /  /:/      /  /:/\\:\\     /  /:/ /\\     /  /:/\\:\\  ',
      ' /__/::\\     /  /:/  \\:\\   /  /:/ /:/_   /  /:/~/:/  ',
      ' \\__\\/\\:\\__ /__/:/ \\__\\:\\ /__/:/ /:/ /\\ /__/:/ /:/___',
      '    \\  \\:\\/\\\\  \\:\\ /  /:/ \\  \\:\\/:/ /:/ \\  \\:\\/::::://',
      '     \\__\\::/ \\  \\:\\  /:/   \\  \\::/ /:/   \\  \\::/~~~~ ',
      '     /__/:/   \\  \\:\\/:/     \\  \\:\\/:/     \\  \\:\\     ',
      '     \\__\\/     \\  \\::/       \\  \\::/       \\  \\:\\    ',
      '                \\__\\/         \\__\\/         \\__\\/    ',
    ];

    // System info
    const info = [
      '',
      'dheeraj@portfolio',
      '─────────────────────────────────────────────',
      'OS: Portfolio Terminal v1.0',
      'Host: React + TypeScript',
      'Kernel: Node.js',
      'Uptime: Building cool stuff since 2020',
      'Shell: bash',
      'Resolution: Responsive',
      'Theme: Dark Terminal',
      '─────────────────────────────────────────────',
      'Role: Senior Software Engineer',
      'Specialization: Full-stack, AI/ML, Cloud',
      'Experience: 5+ years',
      'Companies: NeuralTalk AI, Neo, Monster API, Amazon',
      'GitHub: 1,500+ contributions/year',
      '─────────────────────────────────────────────',
      'Languages: JavaScript, TypeScript, Python, Java',
      'Frameworks: React, Next.js, Node.js, FastAPI',
      'Tools: AWS, Docker, Kubernetes, LangChain',
      'Databases: MongoDB, PostgreSQL, Redis, Pinecone',
      '─────────────────────────────────────────────',
      '',
      '████████████████████████████████████████████',
      '',
    ];

    // Combine banner and info side by side
    const maxBannerLines = banner.length;
    const maxInfoLines = info.length;
    const maxLines = Math.max(maxBannerLines, maxInfoLines);

    for (let i = 0; i < maxLines; i++) {
      const bannerLine = i < banner.length ? banner[i] : ' '.repeat(50);
      const infoLine = i < info.length ? info[i] : '';
      
      const combinedLine = bannerLine + '  ' + infoLine;
      
      output.push(this.createOutputLine('output', combinedLine, {
        color: i < banner.length ? 'cyan' : 'white',
      }));
    }

    output.push(this.createOutputLine('info', ''));
    output.push(this.createOutputLine('info', "Type 'help' to see available commands"));

    return {
      output,
      exitCode: 0,
    };
  }
}
