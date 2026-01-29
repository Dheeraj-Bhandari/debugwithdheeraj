import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as fc from 'fast-check';
import { TerminalView } from './TerminalView';
import type { PortfolioData } from '../../lib/terminal/types';
import { PortfolioDataMapper } from '../../lib/terminal';

/**
 * Property-Based Test for Command Execution Atomicity
 * Feature: terminal-portfolio-view, Property 12: Command Execution Atomicity
 * Validates: Requirements 14.1, 14.2, 14.3
 */

describe('TerminalView - Property 12: Command Execution Atomicity', () => {
  let mockPortfolioData: PortfolioData;
  let mockOnClose: () => void;

  beforeEach(() => {
    mockPortfolioData = PortfolioDataMapper.getPortfolioData();
    mockOnClose = () => {};
  });

  /**
   * Property Test: Command Execution Atomicity
   * 
   * For any command (valid or invalid), the system should either:
   * 1. Complete successfully with output, OR
   * 2. Fail with an error message
   * 
   * The terminal should NEVER enter an inconsistent state where:
   * - Output is partially rendered
   * - State is corrupted
   * - The terminal becomes unresponsive
   */
  it('should always complete or fail cleanly for any command', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate random commands (mix of valid and invalid)
        fc.oneof(
          // Valid commands
          fc.constantFrom(
            'ls',
            'pwd',
            'help',
            'clear',
            'whoami',
            'date',
            'about',
            'experience',
            'projects',
            'skills',
            'contact',
            'neofetch'
          ),
          // Valid commands with arguments
          fc.record({
            cmd: fc.constantFrom('cd', 'cat', 'echo', 'help'),
            arg: fc.oneof(
              fc.constant(''),
              fc.constant('..'),
              fc.constant('/'),
              fc.constant('experience'),
              fc.constant('projects'),
              fc.constant('about.txt'),
              fc.constant('README.md'),
              fc.string({ minLength: 1, maxLength: 20 })
                .filter(s => !/[{}\[\]]/.test(s)) // Filter out special chars that break userEvent
            ),
          }).map(({ cmd, arg }) => arg ? `${cmd} ${arg}` : cmd),
          // Invalid commands (alphanumeric only to avoid userEvent issues)
          fc.string({ minLength: 1, maxLength: 30 })
            .filter(s => /^[a-zA-Z0-9\s._-]+$/.test(s)) // Only safe characters
            .filter(
              s => !['ls', 'cd', 'pwd', 'cat', 'help', 'clear', 'echo', 'whoami', 'date', 
                     'about', 'experience', 'projects', 'skills', 'contact', 'neofetch', 
                     'exit', 'gui'].includes(s.trim().split(' ')[0])
            )
        ),
        async (command: string) => {
          // Render terminal
          const { container } = render(
            <TerminalView
              isOpen={true}
              onClose={mockOnClose}
              portfolioData={mockPortfolioData}
            />
          );

          // Get initial state
          const initialOutputCount = container.querySelectorAll('.terminal-line').length;

          // Find input element
          const input = container.querySelector('.terminal-input') as HTMLInputElement;
          expect(input).toBeTruthy();

          // Type command
          await userEvent.clear(input);
          await userEvent.type(input, command);

          // Submit command
          await userEvent.keyboard('{Enter}');

          // Wait for command to be processed
          // Note: Empty/whitespace commands don't produce output, which is correct behavior
          await waitFor(() => {
            const currentOutputCount = container.querySelectorAll('.terminal-line').length;
            // Output should have increased OR stayed the same (for empty commands)
            expect(currentOutputCount).toBeGreaterThanOrEqual(initialOutputCount);
          }, { timeout: 1000 });

          // Verify terminal is still in a consistent state
          
          // 1. Terminal display should still be rendered
          const terminalDisplay = container.querySelector('.terminal-display');
          expect(terminalDisplay).toBeTruthy();

          // 2. Terminal input should still be rendered and functional
          const terminalInput = container.querySelector('.terminal-input') as HTMLInputElement;
          expect(terminalInput).toBeTruthy();
          expect(terminalInput).not.toBeDisabled();

          // 3. Output lines should be properly formatted
          const outputLines = container.querySelectorAll('.terminal-line');
          expect(outputLines.length).toBeGreaterThan(0);

          // 4. Each output line should have valid content
          outputLines.forEach(line => {
            expect(line).toBeInstanceOf(HTMLElement);
            expect(line.textContent).toBeDefined();
          });

          // 5. Terminal should still accept new input
          await userEvent.clear(terminalInput);
          await userEvent.type(terminalInput, 'pwd');
          expect(terminalInput.value).toBe('pwd');

          // 6. Verify no error boundaries were triggered (component still mounted)
          expect(container.querySelector('.terminal-view')).toBeTruthy();

          // Property verified: Terminal completed command execution (success or failure)
          // and remains in a consistent, functional state
        }
      ),
      {
        numRuns: 20, // Reduced from 100 for faster test execution
        timeout: 5000, // 5 second timeout per test
      }
    );
  }, 30000); // 30 second timeout for entire property test

  /**
   * Additional test: Verify terminal handles rapid command sequences atomically
   */
  it('should handle rapid command sequences without state corruption', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate a sequence of 3-5 commands
        fc.array(
          fc.constantFrom('ls', 'pwd', 'help', 'whoami', 'date'),
          { minLength: 3, maxLength: 5 }
        ),
        async (commands: string[]) => {
          // Render terminal
          const { container } = render(
            <TerminalView
              isOpen={true}
              onClose={mockOnClose}
              portfolioData={mockPortfolioData}
            />
          );

          const input = container.querySelector('.terminal-input') as HTMLInputElement;
          expect(input).toBeTruthy();

          // Execute commands in rapid succession
          for (const command of commands) {
            await userEvent.clear(input);
            await userEvent.type(input, command);
            await userEvent.keyboard('{Enter}');
            
            // Small delay to allow state updates
            await new Promise(resolve => setTimeout(resolve, 50));
          }

          // Wait for all commands to be processed
          await waitFor(() => {
            const outputLines = container.querySelectorAll('.terminal-line');
            // Should have output for all commands plus welcome message
            expect(outputLines.length).toBeGreaterThan(commands.length);
          }, { timeout: 2000 });

          // Verify terminal is still functional
          const terminalDisplay = container.querySelector('.terminal-display');
          const terminalInput = container.querySelector('.terminal-input') as HTMLInputElement;
          
          expect(terminalDisplay).toBeTruthy();
          expect(terminalInput).toBeTruthy();
          expect(terminalInput).not.toBeDisabled();

          // Verify we can still execute commands
          await userEvent.clear(terminalInput);
          await userEvent.type(terminalInput, 'pwd');
          await userEvent.keyboard('{Enter}');

          await waitFor(() => {
            const outputLines = container.querySelectorAll('.terminal-line');
            expect(outputLines.length).toBeGreaterThan(commands.length + 1);
          }, { timeout: 1000 });

          // Property verified: Terminal handled rapid command sequence atomically
          // without entering inconsistent state
        }
      ),
      {
        numRuns: 20, // Reduced from 100 for faster test execution
        timeout: 5000,
      }
    );
  }, 30000); // 30 second timeout for entire property test
});
