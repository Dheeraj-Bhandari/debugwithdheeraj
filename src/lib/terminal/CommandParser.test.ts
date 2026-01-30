import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { CommandParser } from './CommandParser';

/**
 * Property-Based and Unit Tests for CommandParser
 * Feature: terminal-portfolio-view
 */

describe('CommandParser - Property-Based Tests', () => {
  let parser: CommandParser;

  beforeEach(() => {
    parser = new CommandParser();
  });

  /**
   * Property 5: Command Parser Idempotence
   * For any command string, parsing it multiple times should always produce identical results
   * Validates: Requirements 14.1, 14.2
   */
  it('Property 5: Command Parser Idempotence - parsing multiple times produces identical results', () => {
    // Feature: terminal-portfolio-view, Property 5: Command Parser Idempotence
    
    fc.assert(
      fc.property(
        // Generate random command strings
        fc.oneof(
          // Valid commands with various arguments
          fc.record({
            cmd: fc.constantFrom('ls', 'cd', 'pwd', 'cat', 'help', 'echo', 'clear', 'about'),
            args: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { maxLength: 5 }),
          }).map(({ cmd, args }) => `${cmd} ${args.join(' ')}`),
          
          // Commands with flags
          fc.record({
            cmd: fc.constantFrom('ls', 'help', 'cat'),
            flags: fc.array(fc.constantFrom('-l', '-a', '--help', '--verbose'), { maxLength: 3 }),
            args: fc.array(fc.string({ minLength: 1, maxLength: 10 }), { maxLength: 2 }),
          }).map(({ cmd, flags, args }) => `${cmd} ${flags.join(' ')} ${args.join(' ')}`),
          
          // Commands with quoted arguments
          fc.record({
            cmd: fc.constantFrom('echo', 'cat'),
            quotedArg: fc.string({ minLength: 1, maxLength: 30 }),
          }).map(({ cmd, quotedArg }) => `${cmd} "${quotedArg}"`),
          
          // Simple commands
          fc.constantFrom('ls', 'pwd', 'clear', 'whoami', 'date', 'exit', 'gui', 'neofetch'),
          
          // Empty or whitespace
          fc.constantFrom('', '   ', '\t', '  \n  ')
        ),
        fc.integer({ min: 2, max: 5 }),
        (commandString, parseCount) => {
          // Parse the command multiple times
          const results = [];
          for (let i = 0; i < parseCount; i++) {
            results.push(parser.parse(commandString));
          }
          
          // All results should be identical
          for (let i = 1; i < results.length; i++) {
            expect(results[i].command).toBe(results[0].command);
            expect(results[i].args).toEqual(results[0].args);
            expect(results[i].flags).toEqual(results[0].flags);
            expect(results[i].rawInput).toBe(results[0].rawInput);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 5 Extended: Parser idempotence with special characters
   */
  it('Property 5 Extended: Parser idempotence with special characters and escape sequences', () => {
    // Feature: terminal-portfolio-view, Property 5: Command Parser Idempotence
    
    fc.assert(
      fc.property(
        fc.oneof(
          // Commands with escape sequences
          fc.constantFrom(
            'echo "hello\\nworld"',
            'echo "tab\\there"',
            'cat "file\\\\name"',
            'echo "quote\\"test"',
            "echo 'single quotes'",
            'cd "path with spaces"'
          ),
          // Commands with multiple spaces
          fc.record({
            cmd: fc.constantFrom('ls', 'cd', 'cat'),
            spaces: fc.integer({ min: 1, max: 5 }),
            arg: fc.string({ minLength: 1, maxLength: 10 }),
          }).map(({ cmd, spaces, arg }) => `${cmd}${' '.repeat(spaces)}${arg}`)
        ),
        (commandString) => {
          // Parse twice
          const first = parser.parse(commandString);
          const second = parser.parse(commandString);
          
          // Should be identical
          expect(second).toEqual(first);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('CommandParser - Unit Tests', () => {
  let parser: CommandParser;

  beforeEach(() => {
    parser = new CommandParser();
  });

  /**
   * Unit Test: Empty input
   */
  it('should handle empty input', () => {
    const result = parser.parse('');
    
    expect(result.command).toBe('');
    expect(result.args).toEqual([]);
    expect(result.flags).toEqual({});
    expect(result.rawInput).toBe('');
  });

  /**
   * Unit Test: Whitespace-only input
   */
  it('should handle whitespace-only input', () => {
    const result = parser.parse('   ');
    
    expect(result.command).toBe('');
    expect(result.args).toEqual([]);
    expect(result.flags).toEqual({});
  });

  /**
   * Unit Test: Simple command
   */
  it('should parse simple command without arguments', () => {
    const result = parser.parse('ls');
    
    expect(result.command).toBe('ls');
    expect(result.args).toEqual([]);
    expect(result.flags).toEqual({});
  });

  /**
   * Unit Test: Command with arguments
   */
  it('should parse command with arguments', () => {
    const result = parser.parse('cd projects');
    
    expect(result.command).toBe('cd');
    expect(result.args).toEqual(['projects']);
    expect(result.flags).toEqual({});
  });

  /**
   * Unit Test: Command with multiple arguments
   */
  it('should parse command with multiple arguments', () => {
    const result = parser.parse('echo hello world');
    
    expect(result.command).toBe('echo');
    expect(result.args).toEqual(['hello', 'world']);
    expect(result.flags).toEqual({});
  });

  /**
   * Unit Test: Commands with multiple spaces
   */
  it('should handle commands with multiple spaces between tokens', () => {
    const result = parser.parse('ls    -l     projects');
    
    expect(result.command).toBe('ls');
    expect(result.args).toEqual(['projects']);
    expect(result.flags).toEqual({ l: true });
  });

  /**
   * Unit Test: Commands with leading/trailing spaces
   */
  it('should handle commands with leading and trailing spaces', () => {
    const result = parser.parse('  cd projects  ');
    
    expect(result.command).toBe('cd');
    expect(result.args).toEqual(['projects']);
  });

  /**
   * Unit Test: Quoted arguments with spaces
   */
  it('should handle quoted arguments with spaces', () => {
    const result = parser.parse('echo "hello world"');
    
    expect(result.command).toBe('echo');
    expect(result.args).toEqual(['hello world']);
    expect(result.flags).toEqual({});
  });

  /**
   * Unit Test: Single-quoted arguments
   */
  it('should handle single-quoted arguments', () => {
    const result = parser.parse("echo 'hello world'");
    
    expect(result.command).toBe('echo');
    expect(result.args).toEqual(['hello world']);
  });

  /**
   * Unit Test: Mixed quoted and unquoted arguments
   */
  it('should handle mixed quoted and unquoted arguments', () => {
    const result = parser.parse('echo hello "world test" foo');
    
    expect(result.command).toBe('echo');
    expect(result.args).toEqual(['hello', 'world test', 'foo']);
  });

  /**
   * Unit Test: Escape sequences in quoted strings
   */
  it('should handle escape sequences in quoted strings', () => {
    const result = parser.parse('echo "hello\\nworld"');
    
    expect(result.command).toBe('echo');
    expect(result.args).toEqual(['hello\nworld']);
  });

  /**
   * Unit Test: Escaped quotes
   */
  it('should handle escaped quotes', () => {
    const result = parser.parse('echo "say \\"hello\\""');
    
    expect(result.command).toBe('echo');
    expect(result.args).toEqual(['say "hello"']);
  });

  /**
   * Unit Test: Escaped backslash
   */
  it('should handle escaped backslash', () => {
    const result = parser.parse('echo "path\\\\to\\\\file"');
    
    expect(result.command).toBe('echo');
    expect(result.args).toEqual(['path\\to\\file']);
  });

  /**
   * Unit Test: Short flags
   */
  it('should parse short flags', () => {
    const result = parser.parse('ls -l');
    
    expect(result.command).toBe('ls');
    expect(result.args).toEqual([]);
    expect(result.flags).toEqual({ l: true });
  });

  /**
   * Unit Test: Multiple short flags combined
   */
  it('should parse multiple short flags combined', () => {
    const result = parser.parse('ls -la');
    
    expect(result.command).toBe('ls');
    expect(result.args).toEqual([]);
    expect(result.flags).toEqual({ l: true, a: true });
  });

  /**
   * Unit Test: Multiple short flags separate
   */
  it('should parse multiple short flags separately', () => {
    const result = parser.parse('ls -l -a');
    
    expect(result.command).toBe('ls');
    expect(result.args).toEqual([]);
    expect(result.flags).toEqual({ l: true, a: true });
  });

  /**
   * Unit Test: Long flags
   */
  it('should parse long flags', () => {
    const result = parser.parse('help --verbose');
    
    expect(result.command).toBe('help');
    expect(result.args).toEqual([]);
    expect(result.flags).toEqual({ verbose: true });
  });

  /**
   * Unit Test: Mixed short and long flags
   */
  it('should parse mixed short and long flags', () => {
    const result = parser.parse('ls -l --all');
    
    expect(result.command).toBe('ls');
    expect(result.args).toEqual([]);
    expect(result.flags).toEqual({ l: true, all: true });
  });

  /**
   * Unit Test: Flags with arguments
   */
  it('should parse flags with arguments', () => {
    const result = parser.parse('cat -n file.txt');
    
    expect(result.command).toBe('cat');
    expect(result.args).toEqual(['file.txt']);
    expect(result.flags).toEqual({ n: true });
  });

  /**
   * Unit Test: Negative numbers should not be treated as flags
   */
  it('should not treat negative numbers as flags', () => {
    const result = parser.parse('echo -1 -2.5');
    
    expect(result.command).toBe('echo');
    expect(result.args).toEqual(['-1', '-2.5']);
    expect(result.flags).toEqual({});
  });

  /**
   * Unit Test: Special characters in arguments
   */
  it('should handle special characters in arguments', () => {
    const result = parser.parse('echo test@example.com');
    
    expect(result.command).toBe('echo');
    expect(result.args).toEqual(['test@example.com']);
  });

  /**
   * Unit Test: Validation - valid command
   */
  it('should validate valid commands', () => {
    const parsed = parser.parse('ls');
    const validation = parser.validate(parsed);
    
    expect(validation.isValid).toBe(true);
    expect(validation.errors).toEqual([]);
  });

  /**
   * Unit Test: Validation - invalid command
   */
  it('should invalidate unknown commands', () => {
    const parsed = parser.parse('invalid-command');
    const validation = parser.validate(parsed);
    
    expect(validation.isValid).toBe(false);
    expect(validation.errors.length).toBeGreaterThan(0);
    expect(validation.errors[0]).toContain('Command not found');
  });

  /**
   * Unit Test: Validation - empty command
   */
  it('should validate empty command as valid (no-op)', () => {
    const parsed = parser.parse('');
    const validation = parser.validate(parsed);
    
    expect(validation.isValid).toBe(true);
    expect(validation.errors).toEqual([]);
  });

  /**
   * Unit Test: Validation - cd without arguments
   */
  it('should warn when cd has no arguments', () => {
    const parsed = parser.parse('cd');
    const validation = parser.validate(parsed);
    
    expect(validation.isValid).toBe(true);
    expect(validation.warnings.length).toBeGreaterThan(0);
  });

  /**
   * Unit Test: Validation - cd with too many arguments
   */
  it('should error when cd has too many arguments', () => {
    const parsed = parser.parse('cd dir1 dir2');
    const validation = parser.validate(parsed);
    
    expect(validation.isValid).toBe(false);
    expect(validation.errors.length).toBeGreaterThan(0);
  });

  /**
   * Unit Test: Validation - cat without arguments
   */
  it('should error when cat has no arguments', () => {
    const parsed = parser.parse('cat');
    const validation = parser.validate(parsed);
    
    expect(validation.isValid).toBe(false);
    expect(validation.errors.length).toBeGreaterThan(0);
  });

  /**
   * Unit Test: Validation - commands that ignore arguments
   */
  it('should warn when commands that take no arguments receive them', () => {
    const parsed = parser.parse('pwd extra args');
    const validation = parser.validate(parsed);
    
    expect(validation.isValid).toBe(true);
    expect(validation.warnings.length).toBeGreaterThan(0);
  });
});
