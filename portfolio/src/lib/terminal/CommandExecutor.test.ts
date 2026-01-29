import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { CommandExecutor } from './CommandExecutor';
import { VirtualFileSystem } from './VirtualFileSystem';
import { CommandParser } from './CommandParser';

/**
 * Property-Based Tests for CommandExecutor
 * Feature: terminal-portfolio-view
 */

describe('CommandExecutor - Property-Based Tests', () => {
  let executor: CommandExecutor;
  let fs: VirtualFileSystem;
  let parser: CommandParser;

  beforeEach(() => {
    executor = new CommandExecutor();
    fs = new VirtualFileSystem();
    parser = new CommandParser();
  });

  /**
   * Property 6: Invalid Command Error Handling
   * For any unrecognized command string, the system should return a "command not found" error
   * and suggest using the help command
   * Validates: Requirements 14.1, 14.4, 14.5
   */
  it('Property 6: Invalid Command Error Handling - returns error and suggests help', () => {
    // Feature: terminal-portfolio-view, Property 6: Invalid Command Error Handling
    
    fc.assert(
      fc.property(
        // Generate random invalid command strings
        fc.oneof(
          // Random strings that are not valid commands and not whitespace-only
          fc.string({ minLength: 1, maxLength: 20 }).filter(s => {
            const validCommands = [
              'ls', 'cd', 'pwd', 'cat', 'less', 'help', 'clear', 'echo',
              'date', 'whoami', 'about', 'experience', 'projects', 'skills',
              'contact', 'exit', 'gui', 'neofetch'
            ];
            const trimmed = s.trim();
            return trimmed.length > 0 && !validCommands.includes(trimmed);
          }),
          // Random combinations of letters and numbers
          fc.array(fc.constantFrom('a', 'b', 'x', 'y', 'z', '1', '2', '3'), { minLength: 1, maxLength: 15 }).map(arr => arr.join('')),
          // Common typos of valid commands
          fc.constantFrom('lst', 'cdd', 'pwdd', 'catt', 'hlep', 'ecoh', 'exitt', 'clr')
        ),
        (invalidCommand) => {
          // Parse the invalid command
          const parsed = parser.parse(invalidCommand);
          
          // Execute the command
          const result = executor.execute(parsed, fs);
          
          // Should return non-zero exit code
          expect(result.exitCode).not.toBe(0);
          expect(result.exitCode).toBe(127); // Standard "command not found" exit code
          
          // Should have error set
          expect(result.error).toBeDefined();
          expect(result.error).toContain('Command not found');
          
          // Should have output
          expect(result.output).toBeDefined();
          expect(result.output.length).toBeGreaterThan(0);
          
          // First output line should be error type with "command not found" message
          const firstLine = result.output[0];
          expect(firstLine.type).toBe('error');
          expect(firstLine.content).toContain('command not found');
          expect(firstLine.content).toContain(parsed.command);
          
          // Should suggest using help command
          const outputText = result.output.map(line => line.content).join(' ');
          expect(outputText.toLowerCase()).toContain('help');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 6 Extended: Invalid commands with arguments still return error
   */
  it('Property 6 Extended: Invalid commands with arguments return error', () => {
    // Feature: terminal-portfolio-view, Property 6: Invalid Command Error Handling
    
    fc.assert(
      fc.property(
        fc.constantFrom('invalidcmd', 'notacommand', 'xyz', 'fake'),
        fc.array(fc.string({ minLength: 1, maxLength: 10 }), { maxLength: 3 }),
        (invalidCommand, args) => {
          const commandString = [invalidCommand, ...args].join(' ');
          const parsed = parser.parse(commandString);
          
          const result = executor.execute(parsed, fs);
          
          // Should still return error
          expect(result.exitCode).toBe(127);
          expect(result.error).toBeDefined();
          
          // Should mention the command name
          const outputText = result.output.map(line => line.content).join(' ');
          expect(outputText).toContain(invalidCommand);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 6 Edge Case: Empty command returns success with no output
   */
  it('Property 6 Edge Case: Empty command returns success', () => {
    // Feature: terminal-portfolio-view, Property 6: Invalid Command Error Handling
    
    const parsed = parser.parse('');
    const result = executor.execute(parsed, fs);
    
    expect(result.exitCode).toBe(0);
    expect(result.output.length).toBe(0);
  });

  /**
   * Property 6 Edge Case: Whitespace-only command returns success
   */
  it('Property 6 Edge Case: Whitespace-only command returns success', () => {
    // Feature: terminal-portfolio-view, Property 6: Invalid Command Error Handling
    
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom(' ', '\t'), { minLength: 1, maxLength: 10 }).map(arr => arr.join('')),
        (whitespace) => {
          const parsed = parser.parse(whitespace);
          const result = executor.execute(parsed, fs);
          
          expect(result.exitCode).toBe(0);
          expect(result.output.length).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Unit Tests for CommandExecutor
 * Feature: terminal-portfolio-view
 */

describe('CommandExecutor - Unit Tests', () => {
  let executor: CommandExecutor;
  let fs: VirtualFileSystem;
  let parser: CommandParser;

  beforeEach(() => {
    executor = new CommandExecutor();
    fs = new VirtualFileSystem();
    parser = new CommandParser();
  });

  describe('Navigation Commands', () => {
    /**
     * Test ls command with valid inputs
     * Requirements: 3.1
     */
    it('ls - lists directory contents', () => {
      const parsed = parser.parse('ls');
      const result = executor.execute(parsed, fs);

      expect(result.exitCode).toBe(0);
      expect(result.output.length).toBeGreaterThan(0);
      
      // Should contain expected directories
      const outputText = result.output.map(line => line.content).join('\n');
      expect(outputText).toContain('experience');
      expect(outputText).toContain('projects');
    });

    /**
     * Test cd command with valid directory
     * Requirements: 3.2
     */
    it('cd - changes directory successfully', () => {
      const parsed = parser.parse('cd experience');
      const result = executor.execute(parsed, fs);

      expect(result.exitCode).toBe(0);
      expect(fs.getCurrentDirectory()).toBe('/experience');
    });

    /**
     * Test cd command with invalid directory
     * Requirements: 3.2
     */
    it('cd - returns error for non-existent directory', () => {
      const parsed = parser.parse('cd nonexistent');
      const result = executor.execute(parsed, fs);

      expect(result.exitCode).toBe(1);
      expect(result.error).toBeDefined();
      expect(result.output[0].type).toBe('error');
    });

    /**
     * Test pwd command
     * Requirements: 3.4
     */
    it('pwd - prints working directory', () => {
      const parsed = parser.parse('pwd');
      const result = executor.execute(parsed, fs);

      expect(result.exitCode).toBe(0);
      expect(result.output.length).toBe(1);
      expect(result.output[0].content).toBe('/');
    });
  });

  describe('File Operations', () => {
    /**
     * Test cat command with valid file
     * Requirements: 4.1
     */
    it('cat - displays file contents', () => {
      const parsed = parser.parse('cat README.md');
      const result = executor.execute(parsed, fs);

      expect(result.exitCode).toBe(0);
      expect(result.output.length).toBeGreaterThan(0);
      expect(result.output[0].content).toContain('Welcome');
    });

    /**
     * Test cat command with non-existent file
     * Requirements: 4.4
     */
    it('cat - returns error for non-existent file', () => {
      const parsed = parser.parse('cat nonexistent.txt');
      const result = executor.execute(parsed, fs);

      expect(result.exitCode).toBe(1);
      expect(result.error).toBeDefined();
      expect(result.output[0].type).toBe('error');
      expect(result.output[0].content).toContain('No such file');
    });

    /**
     * Test cat command on directory
     * Requirements: 4.5
     */
    it('cat - returns error when trying to cat a directory', () => {
      const parsed = parser.parse('cat experience');
      const result = executor.execute(parsed, fs);

      expect(result.exitCode).toBe(1);
      expect(result.error).toBeDefined();
      expect(result.output[0].content).toContain('Is a directory');
    });
  });

  describe('Utility Commands', () => {
    /**
     * Test help command
     * Requirements: 6.1
     */
    it('help - displays command list', () => {
      const parsed = parser.parse('help');
      const result = executor.execute(parsed, fs);

      expect(result.exitCode).toBe(0);
      expect(result.output.length).toBeGreaterThan(10);
      
      const outputText = result.output.map(line => line.content).join('\n');
      expect(outputText).toContain('ls');
      expect(outputText).toContain('cd');
      expect(outputText).toContain('cat');
    });

    /**
     * Test help command with specific command
     * Requirements: 6.2
     */
    it('help <command> - displays specific command help', () => {
      const parsed = parser.parse('help cd');
      const result = executor.execute(parsed, fs);

      expect(result.exitCode).toBe(0);
      expect(result.output.length).toBeGreaterThan(0);
      
      const outputText = result.output.map(line => line.content).join('\n');
      expect(outputText).toContain('cd');
      expect(outputText).toContain('directory');
    });

    /**
     * Test clear command
     * Requirements: 6.3
     */
    it('clear - returns clear screen signal', () => {
      const parsed = parser.parse('clear');
      const result = executor.execute(parsed, fs);

      expect(result.exitCode).toBe(0);
      expect(result.output.length).toBe(1);
      expect(result.output[0].metadata?.clearScreen).toBe(true);
    });

    /**
     * Test echo command
     * Requirements: 6.4
     */
    it('echo - displays provided text', () => {
      const parsed = parser.parse('echo Hello World');
      const result = executor.execute(parsed, fs);

      expect(result.exitCode).toBe(0);
      expect(result.output.length).toBe(1);
      expect(result.output[0].content).toBe('Hello World');
    });

    /**
     * Test whoami command
     * Requirements: 10.1
     */
    it('whoami - displays user information', () => {
      const parsed = parser.parse('whoami');
      const result = executor.execute(parsed, fs);

      expect(result.exitCode).toBe(0);
      expect(result.output.length).toBeGreaterThan(0);
      
      const outputText = result.output.map(line => line.content).join('\n');
      expect(outputText).toContain('Dheeraj Kumar');
    });

    /**
     * Test date command
     * Requirements: 10.2
     */
    it('date - displays current date', () => {
      const parsed = parser.parse('date');
      const result = executor.execute(parsed, fs);

      expect(result.exitCode).toBe(0);
      expect(result.output.length).toBe(1);
      expect(result.output[0].content).toMatch(/\d{4}/); // Should contain year
    });
  });

  describe('Portfolio Shortcuts', () => {
    /**
     * Test about command
     * Requirements: 7.1
     */
    it('about - displays about section', () => {
      const parsed = parser.parse('about');
      const result = executor.execute(parsed, fs);

      expect(result.exitCode).toBe(0);
      expect(result.output.length).toBeGreaterThan(0);
    });

    /**
     * Test experience command
     * Requirements: 7.2
     */
    it('experience - displays work experience', () => {
      const parsed = parser.parse('experience');
      const result = executor.execute(parsed, fs);

      expect(result.exitCode).toBe(0);
      expect(result.output.length).toBeGreaterThan(0);
      
      const outputText = result.output.map(line => line.content).join('\n');
      expect(outputText).toContain('Experience');
    });

    /**
     * Test projects command
     * Requirements: 7.3
     */
    it('projects - displays featured projects', () => {
      const parsed = parser.parse('projects');
      const result = executor.execute(parsed, fs);

      expect(result.exitCode).toBe(0);
      expect(result.output.length).toBeGreaterThan(0);
      
      const outputText = result.output.map(line => line.content).join('\n');
      expect(outputText).toContain('Projects');
    });

    /**
     * Test skills command
     * Requirements: 7.4
     */
    it('skills - displays technical skills', () => {
      const parsed = parser.parse('skills');
      const result = executor.execute(parsed, fs);

      expect(result.exitCode).toBe(0);
      expect(result.output.length).toBeGreaterThan(0);
      
      const outputText = result.output.map(line => line.content).join('\n');
      expect(outputText).toContain('Skills');
    });

    /**
     * Test contact command
     * Requirements: 7.5
     */
    it('contact - displays contact information', () => {
      const parsed = parser.parse('contact');
      const result = executor.execute(parsed, fs);

      expect(result.exitCode).toBe(0);
      expect(result.output.length).toBeGreaterThan(0);
      
      const outputText = result.output.map(line => line.content).join('\n');
      expect(outputText).toContain('Contact');
    });
  });

  describe('Output Formatting', () => {
    /**
     * Test that all output lines have timestamps
     */
    it('all output lines have timestamps', () => {
      const parsed = parser.parse('help');
      const result = executor.execute(parsed, fs);

      result.output.forEach(line => {
        expect(line.timestamp).toBeInstanceOf(Date);
      });
    });

    /**
     * Test that error outputs have correct type
     */
    it('error outputs have error type', () => {
      const parsed = parser.parse('cat nonexistent.txt');
      const result = executor.execute(parsed, fs);

      expect(result.output[0].type).toBe('error');
    });

    /**
     * Test that ls output includes metadata for directories
     */
    it('ls output includes directory metadata', () => {
      const parsed = parser.parse('ls');
      const result = executor.execute(parsed, fs);

      const dirLines = result.output.filter(line => line.content.endsWith('/'));
      expect(dirLines.length).toBeGreaterThan(0);
      
      dirLines.forEach(line => {
        expect(line.metadata?.isDirectory).toBe(true);
      });
    });
  });
});

