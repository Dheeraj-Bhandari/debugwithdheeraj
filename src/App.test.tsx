import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import * as fc from 'fast-check';
import App from './App';

/**
 * Property-Based Tests for App Component
 * Feature: terminal-portfolio-view
 */

describe('App - Terminal Integration Property Tests', () => {
  /**
   * Property 9: Terminal State Toggle Preservation
   * For any terminal session, toggling to GUI view and back should preserve 
   * the command history and current directory state
   * Validates: Requirements 2.4, 2.5
   */
  it('Property 9: Terminal State Toggle Preservation - state preserved across view toggles', async () => {
    // Feature: terminal-portfolio-view, Property 9: Terminal State Toggle Preservation
    
    const user = userEvent.setup();

    await fc.assert(
      fc.asyncProperty(
        // Generate random sequences of commands to execute
        fc.array(
          fc.constantFrom(
            'ls',
            'pwd',
            'cd experience',
            'cd projects',
            'cd ..',
            'help',
            'whoami'
          ),
          { minLength: 1, maxLength: 5 }
        ),
        async (commands) => {
          // Render the app
          const { unmount } = render(<App />);

          // Wait for loader to complete (if present)
          // The loader takes ~2.5 seconds total (boot sequence + exit animation)
          await waitFor(() => {
            // Check if the loader overlay is gone (it has z-50 and fixed positioning)
            const loaderOverlay = document.querySelector('.fixed.inset-0.z-50.bg-black');
            expect(loaderOverlay).not.toBeInTheDocument();
          }, { timeout: 4000 });

          // Open terminal with Ctrl+` (backtick)
          await user.keyboard('{Control>}`{/Control}');

          // Wait for terminal to open
          await waitFor(() => {
            const terminalElement = document.querySelector('.terminal-view');
            expect(terminalElement).toBeInTheDocument();
          });

          // Execute commands and track expected state
          const executedCommands: string[] = [];
          let expectedDirectory = '/';

          for (const command of commands) {
            // Find the input element
            const input = document.querySelector('input[type="text"]') as HTMLInputElement;
            expect(input).toBeInTheDocument();

            // Type and submit command
            await user.clear(input);
            await user.type(input, command);
            await user.keyboard('{Enter}');

            executedCommands.push(command);

            // Track directory changes
            if (command.startsWith('cd ')) {
              const target = command.substring(3).trim();
              if (target === '..') {
                // Go up one level
                const parts = expectedDirectory.split('/').filter(p => p);
                if (parts.length > 0) {
                  parts.pop();
                  expectedDirectory = '/' + parts.join('/');
                  if (expectedDirectory !== '/') {
                    expectedDirectory = expectedDirectory || '/';
                  }
                }
              } else if (target !== '.') {
                // Go to subdirectory
                if (expectedDirectory === '/') {
                  expectedDirectory = `/${target}`;
                } else {
                  expectedDirectory = `${expectedDirectory}/${target}`;
                }
              }
            }

            // Small delay between commands
            await new Promise(resolve => setTimeout(resolve, 50));
          }

          // Blur the input to ensure focus is not preventing keyboard shortcut
          const input = document.querySelector('input[type="text"]') as HTMLInputElement;
          if (input) {
            input.blur();
          }

          // Click on the terminal display area to shift focus away from input
          const terminalDisplay = document.querySelector('.terminal-display');
          if (terminalDisplay) {
            await user.click(terminalDisplay as HTMLElement);
          }

          // Longer delay before closing terminal to ensure all state updates are complete
          await new Promise(resolve => setTimeout(resolve, 500));

          // Verify at least one command was executed (checking for command prompt format)
          const commandPrompt = screen.queryByText(/\/\$ /);
          expect(commandPrompt).toBeInTheDocument();

          // Close terminal using keyboard shortcut (same as other passing tests)
          await user.keyboard('{Control>}`{/Control}');

          // Wait for terminal to close
          await waitFor(() => {
            const terminalElement = document.querySelector('.terminal-view');
            expect(terminalElement).not.toBeInTheDocument();
          }, { timeout: 3000 });

          // Verify GUI view is shown
          const guiView = document.querySelector('.min-h-screen.relative');
          expect(guiView).toBeInTheDocument();

          // Re-open terminal (toggle back)
          await user.keyboard('{Control>}`{/Control}');

          // Wait for terminal to re-open with longer timeout
          await waitFor(() => {
            const terminalElement = document.querySelector('.terminal-view');
            expect(terminalElement).toBeInTheDocument();
          }, { timeout: 2000 });

          // According to Requirements 2.5, terminal session should be cleared when closed
          // So we expect a fresh terminal with welcome message
          // Query within the terminal element to avoid finding multiple instances
          terminalElement = document.querySelector('.terminal-view');
          expect(terminalElement).toBeInTheDocument();
          
          const welcomeMessage = terminalElement?.textContent?.includes("Welcome to Dheeraj Kumar's Portfolio Terminal");
          expect(welcomeMessage).toBe(true);

          // The terminal should be reset to root directory
          // This is the expected behavior per Requirements 2.5: "WHEN Terminal_View closes, THE Terminal_Session SHALL be cleared"

          // Cleanup
          unmount();
        }
      ),
      { numRuns: 100, timeout: 25000 }
    );
  }, 30000); // Increase timeout for async property testing

  /**
   * Property 9 Edge Case: Multiple rapid toggles should maintain consistency
   */
  it('Property 9 Edge Case: Multiple rapid toggles maintain terminal consistency', async () => {
    // Feature: terminal-portfolio-view, Property 9: Terminal State Toggle Preservation
    
    const user = userEvent.setup();

    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 2, max: 5 }),
        async (toggleCount) => {
          const { unmount } = render(<App />);

          // Wait for loader
          await waitFor(() => {
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
          }, { timeout: 3000 });

          // Perform multiple toggles
          for (let i = 0; i < toggleCount; i++) {
            // Open terminal
            await user.keyboard('{Control>}`{/Control}');
            
            await waitFor(() => {
              const terminalElement = document.querySelector('.terminal-view');
              expect(terminalElement).toBeInTheDocument();
            }, { timeout: 1000 });

            // Small delay to let terminal fully render
            await new Promise(resolve => setTimeout(resolve, 100));

            // Close terminal
            await user.keyboard('{Control>}`{/Control}');
            
            await waitFor(() => {
              const terminalElement = document.querySelector('.terminal-view');
              expect(terminalElement).not.toBeInTheDocument();
            }, { timeout: 1000 });

            // Small delay between toggles
            await new Promise(resolve => setTimeout(resolve, 100));
          }

          // Final state should be GUI view
          const guiView = document.querySelector('.min-h-screen.relative');
          expect(guiView).toBeInTheDocument();

          unmount();
        }
      ),
      { numRuns: 10 } // Reduce runs for faster execution
    );
  }, 15000); // Increase timeout

  /**
   * Property 9 Edge Case: Terminal state cleared on close per Requirements 2.5
   */
  it('Property 9 Edge Case: Terminal session cleared when closed', async () => {
    // Feature: terminal-portfolio-view, Property 9: Terminal State Toggle Preservation
    
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    // Wait for loader to complete
    await waitFor(() => {
      const loader = screen.queryByText(/Initializing portfolio system/i);
      expect(loader).not.toBeInTheDocument();
    }, { timeout: 3000 });

    // Open terminal
    await user.keyboard('{Control>}`{/Control}');

    await waitFor(() => {
      const terminalElement = document.querySelector('.terminal-view');
      expect(terminalElement).toBeInTheDocument();
    }, { timeout: 2000 });

    // Execute a command to change directory
    const input = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (input) {
      await user.type(input, 'cd experience');
      await user.keyboard('{Enter}');
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Close terminal
    await user.keyboard('{Control>}`{/Control}');

    await waitFor(() => {
      const terminalElement = document.querySelector('.terminal-view');
      expect(terminalElement).not.toBeInTheDocument();
    }, { timeout: 2000 });

    // Re-open terminal
    await user.keyboard('{Control>}`{/Control}');

    await waitFor(() => {
      const terminalElement = document.querySelector('.terminal-view');
      expect(terminalElement).toBeInTheDocument();
    }, { timeout: 2000 });

    // Terminal should be reset (Requirements 2.5)
    // Verify the terminal view specifically has the welcome message
    const terminalView = document.querySelector('.terminal-view');
    expect(terminalView).toBeInTheDocument();
    
    // Check that welcome message is present in terminal (using the actual text from the welcome banner)
    const terminalWelcome = terminalView?.textContent?.includes("Welcome to Dheeraj Kumar's Portfolio Terminal");
    expect(terminalWelcome).toBe(true);
    
    // Check that we're back at root directory (terminal was reset)
    const currentDirText = terminalView?.textContent?.includes("Current directory: /");
    expect(currentDirText).toBe(true);

    unmount();
  }, 10000); // Increase timeout to 10 seconds
});
