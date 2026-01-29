import type { ParsedCommand, ValidationResult } from './types';

/**
 * List of valid terminal commands
 */
const VALID_COMMANDS = [
  // Navigation commands
  'ls',
  'cd',
  'pwd',
  
  // File operations
  'cat',
  'less',
  
  // Utility commands
  'help',
  'clear',
  'echo',
  'date',
  'whoami',
  
  // Portfolio shortcuts
  'about',
  'experience',
  'projects',
  'skills',
  'contact',
  
  // System commands
  'exit',
  'gui',
  'neofetch',
] as const;

/**
 * CommandParser parses and validates terminal command strings
 * Handles quoted arguments, escape sequences, and flags
 */
export class CommandParser {
  private validCommands: Set<string>;

  constructor() {
    this.validCommands = new Set(VALID_COMMANDS);
  }

  /**
   * Parse a command string into structured components
   * Handles quoted arguments, escape sequences, and flags
   * 
   * @param input - Raw command string from user
   * @returns ParsedCommand object with command, args, flags, and rawInput
   */
  parse(input: string): ParsedCommand {
    const rawInput = input;
    const trimmedInput = input.trim();

    // Handle empty input
    if (!trimmedInput) {
      return {
        command: '',
        args: [],
        flags: {},
        rawInput,
      };
    }

    const tokens = this.tokenize(trimmedInput);
    
    if (tokens.length === 0) {
      return {
        command: '',
        args: [],
        flags: {},
        rawInput,
      };
    }

    const command = tokens[0];
    const args: string[] = [];
    const flags: Record<string, boolean> = {};

    // Process remaining tokens
    for (let i = 1; i < tokens.length; i++) {
      const token = tokens[i];
      
      if (token.startsWith('--')) {
        // Long flag (e.g., --help)
        const flagName = token.substring(2);
        flags[flagName] = true;
      } else if (token.startsWith('-') && token.length > 1 && !token.match(/^-\d/)) {
        // Short flag(s) (e.g., -l, -la)
        // Skip if it looks like a negative number (e.g., -1)
        const flagChars = token.substring(1);
        for (const char of flagChars) {
          flags[char] = true;
        }
      } else {
        // Regular argument
        args.push(token);
      }
    }

    return {
      command,
      args,
      flags,
      rawInput,
    };
  }

  /**
   * Tokenize input string, handling quoted strings and escape sequences
   * 
   * @param input - Trimmed command string
   * @returns Array of tokens
   */
  private tokenize(input: string): string[] {
    const tokens: string[] = [];
    let currentToken = '';
    let inQuotes = false;
    let quoteChar = '';
    let escaped = false;

    for (let i = 0; i < input.length; i++) {
      const char = input[i];

      if (escaped) {
        // Handle escape sequences
        switch (char) {
          case 'n':
            currentToken += '\n';
            break;
          case 't':
            currentToken += '\t';
            break;
          case 'r':
            currentToken += '\r';
            break;
          case '\\':
            currentToken += '\\';
            break;
          case '"':
            currentToken += '"';
            break;
          case "'":
            currentToken += "'";
            break;
          default:
            // For unknown escape sequences, keep the backslash
            currentToken += '\\' + char;
        }
        escaped = false;
        continue;
      }

      if (char === '\\') {
        escaped = true;
        continue;
      }

      if ((char === '"' || char === "'") && !inQuotes) {
        // Start quoted string
        inQuotes = true;
        quoteChar = char;
        continue;
      }

      if (char === quoteChar && inQuotes) {
        // End quoted string
        inQuotes = false;
        quoteChar = '';
        continue;
      }

      if (char === ' ' && !inQuotes) {
        // Space outside quotes - token boundary
        if (currentToken) {
          tokens.push(currentToken);
          currentToken = '';
        }
        continue;
      }

      // Regular character
      currentToken += char;
    }

    // Add final token
    if (currentToken) {
      tokens.push(currentToken);
    }

    return tokens;
  }

  /**
   * Validate a parsed command
   * 
   * @param parsed - ParsedCommand to validate
   * @returns ValidationResult with errors and warnings
   */
  validate(parsed: ParsedCommand): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for empty command
    if (!parsed.command) {
      return {
        isValid: true,
        errors: [],
        warnings: [],
      };
    }

    // Check if command is valid
    if (!this.validCommands.has(parsed.command)) {
      errors.push(`Command not found: ${parsed.command}`);
      errors.push(`Type 'help' to see available commands`);
      return {
        isValid: false,
        errors,
        warnings,
      };
    }

    // Command-specific validation
    switch (parsed.command) {
      case 'cd':
        if (parsed.args.length === 0) {
          // cd with no args defaults to home (~), which is valid
          warnings.push('No directory specified, defaulting to home');
        } else if (parsed.args.length > 1) {
          errors.push('cd: too many arguments');
        }
        break;

      case 'cat':
      case 'less':
        if (parsed.args.length === 0) {
          errors.push(`${parsed.command}: missing file operand`);
        }
        break;

      case 'echo':
        // echo can have any number of arguments (including zero)
        break;

      case 'help':
        // help can have 0 or 1 argument
        if (parsed.args.length > 1) {
          warnings.push('help: ignoring extra arguments');
        }
        break;

      default:
        // Most commands don't take arguments
        if (['ls', 'pwd', 'clear', 'date', 'whoami', 'exit', 'gui', 'neofetch', 
             'about', 'experience', 'projects', 'skills', 'contact'].includes(parsed.command)) {
          if (parsed.args.length > 0) {
            warnings.push(`${parsed.command}: ignoring arguments`);
          }
        }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Get list of valid commands
   */
  getValidCommands(): string[] {
    return Array.from(this.validCommands);
  }
}
