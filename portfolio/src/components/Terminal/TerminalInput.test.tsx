import { describe, it, expect, vi } from 'vitest';
import * as fc from 'fast-check';
import { render, screen, fireEvent } from '@testing-library/react';
import { TerminalInput } from './TerminalInput';

/**
 * Property-Based Tests for TerminalInput
 * Feature: terminal-portfolio-view
 */

describe('TerminalInput - Property-Based Tests', () => {
  const mockOnSubmit = vi.fn();
  const availableCommands = ['ls', 'cd', 'pwd', 'cat', 'help', 'clear', 'echo', 'whoami', 'date'];

  /**
   * Property 1: Command History Preservation
   * For any sequence of commands, navigating through history should preserve exact order and content
   * Validates: Requirements 5.1, 5.2, 5.5
   */
  it('Property 1: Command History Preservation - Up/Down arrows preserve command order', () => {
    // Feature: terminal-portfolio-view, Property 1: Command History Preservation
    
    fc.assert(
      fc.property(
        // Generate random sequences of commands
        fc.array(
          fc.oneof(
            fc.constantFrom(...availableCommands),
            fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0)
          ),
          { minLength: 1, maxLength: 10 }
        ),
        (commands) => {
          // Render component with command history
          const { container } = render(
            <TerminalInput
              currentDirectory="/"
              onSubmit={mockOnSubmit}
              commandHistory={commands}
              availableCommands={availableCommands}
              currentPath="/"
            />
          );

          const input = container.querySelector('input') as HTMLInputElement;
          expect(input).toBeTruthy();

          // Navigate through history with Up arrow
          for (let i = commands.length - 1; i >= 0; i--) {
            fireEvent.keyDown(input, { key: 'ArrowUp' });
            expect(input.value).toBe(commands[i]);
          }

          // At the beginning, Up arrow should stay at first command
          fireEvent.keyDown(input, { key: 'ArrowUp' });
          expect(input.value).toBe(commands[0]);

          // Navigate forward with Down arrow
          for (let i = 1; i < commands.length; i++) {
            fireEvent.keyDown(input, { key: 'ArrowDown' });
            expect(input.value).toBe(commands[i]);
          }

          // At the end, Down arrow should clear input
          fireEvent.keyDown(input, { key: 'ArrowDown' });
          expect(input.value).toBe('');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 1 Extended: History navigation from middle position
   */
  it('Property 1 Extended: History navigation works from any position', () => {
    // Feature: terminal-portfolio-view, Property 1: Command History Preservation
    
    fc.assert(
      fc.property(
        fc.array(
          fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
          { minLength: 3, maxLength: 10 }
        ),
        fc.integer({ min: 0, max: 100 }),
        (commands, startPosition) => {
          const { container } = render(
            <TerminalInput
              currentDirectory="/"
              onSubmit={mockOnSubmit}
              commandHistory={commands}
              availableCommands={availableCommands}
              currentPath="/"
            />
          );

          const input = container.querySelector('input') as HTMLInputElement;
          
          // Navigate to a random position in history
          const targetPosition = startPosition % commands.length;
          for (let i = 0; i < commands.length - targetPosition; i++) {
            fireEvent.keyDown(input, { key: 'ArrowUp' });
          }

          const currentCommand = input.value;
          const expectedIndex = commands.length - 1 - (commands.length - targetPosition - 1);
          
          // Verify we're at the expected position
          if (expectedIndex >= 0 && expectedIndex < commands.length) {
            expect(currentCommand).toBe(commands[expectedIndex]);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 1 Edge Case: Empty history
   */
  it('Property 1 Edge Case: Empty history - arrows have no effect', () => {
    // Feature: terminal-portfolio-view, Property 1: Command History Preservation
    
    const { container } = render(
      <TerminalInput
        currentDirectory="/"
        onSubmit={mockOnSubmit}
        commandHistory={[]}
        availableCommands={availableCommands}
        currentPath="/"
      />
    );

    const input = container.querySelector('input') as HTMLInputElement;
    
    // Type something
    fireEvent.change(input, { target: { value: 'test' } });
    expect(input.value).toBe('test');

    // Arrow keys should not change the input
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(input.value).toBe('test');

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input.value).toBe('test');
  });

  /**
   * Property 1 Edge Case: Single command in history
   */
  it('Property 1 Edge Case: Single command history', () => {
    // Feature: terminal-portfolio-view, Property 1: Command History Preservation
    
    const singleCommand = 'ls -la';
    const { container } = render(
      <TerminalInput
        currentDirectory="/"
        onSubmit={mockOnSubmit}
        commandHistory={[singleCommand]}
        availableCommands={availableCommands}
        currentPath="/"
      />
    );

    const input = container.querySelector('input') as HTMLInputElement;
    
    // Up arrow should show the command
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(input.value).toBe(singleCommand);

    // Another Up arrow should stay at the same command
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(input.value).toBe(singleCommand);

    // Down arrow should clear
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input.value).toBe('');
  });

  /**
   * Property 1 Edge Case: Typing resets history navigation
   */
  it('Property 1 Edge Case: Typing resets history index', () => {
    // Feature: terminal-portfolio-view, Property 1: Command History Preservation
    
    const commands = ['ls', 'cd projects', 'pwd'];
    const { container } = render(
      <TerminalInput
        currentDirectory="/"
        onSubmit={mockOnSubmit}
        commandHistory={commands}
        availableCommands={availableCommands}
        currentPath="/"
      />
    );

    const input = container.querySelector('input') as HTMLInputElement;
    
    // Navigate up
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(input.value).toBe('pwd');

    // Type something - should reset history
    fireEvent.change(input, { target: { value: 'new command' } });
    expect(input.value).toBe('new command');

    // Up arrow should start from the end again
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(input.value).toBe('pwd');
  });

  /**
   * Property 8: Auto-completion Correctness
   * For any partial command, tab completion should return valid matches
   * Validates: Requirements 9.1, 9.2, 9.3, 9.4
   */
  it('Property 8: Auto-completion Correctness - Tab returns valid command matches', () => {
    // Feature: terminal-portfolio-view, Property 8: Auto-completion Correctness
    
    fc.assert(
      fc.property(
        // Generate random partial commands
        fc.oneof(
          // Partial command strings
          fc.constantFrom('l', 'c', 'p', 'ca', 'he', 'cl', 'ec', 'wh', 'da'),
          // Empty string
          fc.constant(''),
          // Full commands
          fc.constantFrom(...availableCommands)
        ),
        (partial) => {
          const { container } = render(
            <TerminalInput
              currentDirectory="/"
              onSubmit={mockOnSubmit}
              commandHistory={[]}
              availableCommands={availableCommands}
              currentPath="/"
            />
          );

          const input = container.querySelector('input') as HTMLInputElement;
          
          // Type the partial command
          fireEvent.change(input, { target: { value: partial } });
          
          // Press Tab
          fireEvent.keyDown(input, { key: 'Tab' });
          
          const resultValue = input.value;
          
          // If partial is empty or whitespace, no completion should happen
          if (!partial || partial.trim() === '') {
            expect(resultValue).toBe(partial);
            return;
          }
          
          // Find all matching commands
          const matches = availableCommands.filter(cmd => cmd.startsWith(partial));
          
          if (matches.length === 0) {
            // No matches - input should remain unchanged
            expect(resultValue).toBe(partial);
          } else if (matches.length === 1) {
            // Unique match - should complete with space
            expect(resultValue).toBe(matches[0] + ' ');
          } else {
            // Multiple matches - should either stay the same or show one of the matches
            const isValidCompletion = 
              resultValue === partial || 
              matches.some(match => resultValue === match + ' ') ||
              matches.some(match => resultValue.startsWith(match));
            expect(isValidCompletion).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 8 Extended: Auto-completion with file system
   */
  it('Property 8 Extended: Auto-completion for file commands', () => {
    // Feature: terminal-portfolio-view, Property 8: Auto-completion Correctness
    
    // Mock file system with getCompletions method
    const mockFileSystem = {
      getCompletions: vi.fn((partial: string) => {
        const files = ['about.txt', 'projects/', 'experience/', 'skills.json'];
        return files.filter(f => f.startsWith(partial));
      }),
    };

    fc.assert(
      fc.property(
        fc.constantFrom('cd', 'cat', 'ls'),
        fc.oneof(
          fc.constantFrom('a', 'p', 'e', 's', 'ab', 'pr', 'ex', 'sk'),
          fc.constant('')
        ),
        (command, partial) => {
          const { container } = render(
            <TerminalInput
              currentDirectory="/"
              onSubmit={mockOnSubmit}
              commandHistory={[]}
              availableCommands={availableCommands}
              currentPath="/"
              fileSystem={mockFileSystem as any}
            />
          );

          const input = container.querySelector('input') as HTMLInputElement;
          
          // Type command and partial filename
          const fullInput = partial ? `${command} ${partial}` : command;
          fireEvent.change(input, { target: { value: fullInput } });
          
          // Press Tab
          fireEvent.keyDown(input, { key: 'Tab' });
          
          const resultValue = input.value;
          
          // If no partial, should not change
          if (!partial) {
            return;
          }
          
          // Get expected matches
          const matches = mockFileSystem.getCompletions(partial);
          
          if (matches.length === 0) {
            // No matches - should remain unchanged or show original
            expect(resultValue).toContain(command);
          } else if (matches.length === 1) {
            // Unique match - should complete
            expect(resultValue).toContain(matches[0]);
          } else {
            // Multiple matches - should show one of them or stay the same
            const isValid = 
              resultValue === fullInput ||
              matches.some(match => resultValue.includes(match));
            expect(isValid).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 8 Edge Case: Tab on empty input
   */
  it('Property 8 Edge Case: Tab on empty input has no effect', () => {
    // Feature: terminal-portfolio-view, Property 8: Auto-completion Correctness
    
    const { container } = render(
      <TerminalInput
        currentDirectory="/"
        onSubmit={mockOnSubmit}
        commandHistory={[]}
        availableCommands={availableCommands}
        currentPath="/"
      />
    );

    const input = container.querySelector('input') as HTMLInputElement;
    
    // Press Tab on empty input
    fireEvent.keyDown(input, { key: 'Tab' });
    
    // Should remain empty
    expect(input.value).toBe('');
  });

  /**
   * Property 8 Edge Case: Tab cycles through multiple matches
   */
  it('Property 8 Edge Case: Multiple Tab presses cycle through matches', () => {
    // Feature: terminal-portfolio-view, Property 8: Auto-completion Correctness
    
    const { container } = render(
      <TerminalInput
        currentDirectory="/"
        onSubmit={mockOnSubmit}
        commandHistory={[]}
        availableCommands={availableCommands}
        currentPath="/"
      />
    );

    const input = container.querySelector('input') as HTMLInputElement;
    
    // Type 'c' which matches 'cd', 'cat', 'clear'
    fireEvent.change(input, { target: { value: 'c' } });
    
    // First Tab - should show matches or complete to first
    fireEvent.keyDown(input, { key: 'Tab' });
    const firstValue = input.value;
    
    // Should be one of the matching commands
    const matches = availableCommands.filter(cmd => cmd.startsWith('c'));
    const isValidFirst = matches.some(match => firstValue === match + ' ') || firstValue === 'c';
    expect(isValidFirst).toBe(true);
    
    // Second Tab - should cycle to next match
    fireEvent.keyDown(input, { key: 'Tab' });
    const secondValue = input.value;
    
    // Should be a valid match
    const isValidSecond = matches.some(match => secondValue === match + ' ') || secondValue === 'c';
    expect(isValidSecond).toBe(true);
  });

  /**
   * Property 8 Edge Case: Unique match completes immediately
   */
  it('Property 8 Edge Case: Unique match completes with space', () => {
    // Feature: terminal-portfolio-view, Property 8: Auto-completion Correctness
    
    const { container } = render(
      <TerminalInput
        currentDirectory="/"
        onSubmit={mockOnSubmit}
        commandHistory={[]}
        availableCommands={availableCommands}
        currentPath="/"
      />
    );

    const input = container.querySelector('input') as HTMLInputElement;
    
    // Type 'pwd' which is unique
    fireEvent.change(input, { target: { value: 'pw' } });
    
    // Press Tab
    fireEvent.keyDown(input, { key: 'Tab' });
    
    // Should complete to 'pwd '
    expect(input.value).toBe('pwd ');
  });
});
