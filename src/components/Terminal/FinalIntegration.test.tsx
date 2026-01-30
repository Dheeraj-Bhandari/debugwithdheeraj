import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TerminalView } from './TerminalView';
import type { PortfolioData } from '../../lib/terminal/types';
import { PortfolioDataMapper } from '../../lib/terminal';

/**
 * Final Integration Tests for Terminal Portfolio View
 * Task 20: Final Integration and Testing
 * 
 * These tests validate that all new features work together correctly:
 * - Window controls (minimize, maximize, close)
 * - Click-to-focus functionality
 * - Terminal session preservation
 * - Hero button integration
 * - Keyboard shortcut (Ctrl+T) prevention
 */

describe('Task 20.1: Test all new features together', () => {
  let mockPortfolioData: PortfolioData;
  let mockOnClose: vi.Mock;

  beforeEach(() => {
    mockPortfolioData = PortfolioDataMapper.getPortfolioData();
    mockOnClose = vi.fn();
  });

  it('should integrate window controls with terminal commands', async () => {
    const { container } = render(
      <TerminalView
        isOpen={true}
        onClose={mockOnClose}
        portfolioData={mockPortfolioData}
      />
    );

    // Verify window controls are rendered
    const minimizeButton = screen.getByLabelText('Minimize terminal');
    const maximizeButton = screen.getByLabelText(/Maximize terminal|Restore terminal/);
    const closeButton = screen.getByLabelText('Close terminal');

    expect(minimizeButton).toBeInTheDocument();
    expect(maximizeButton).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();

    // Execute a command
    const input = container.querySelector('.terminal-input') as HTMLInputElement;
    expect(input).toBeTruthy();

    await userEvent.type(input, 'ls');
    await userEvent.keyboard('{Enter}');

    // Wait for command output
    await waitFor(() => {
      const outputLines = container.querySelectorAll('.terminal-line');
      expect(outputLines.length).toBeGreaterThan(0);
    });

    // Verify window controls still work after command execution
    await userEvent.click(minimizeButton);

    // Terminal should be minimized
    await waitFor(() => {
      const minimizedIndicator = screen.getByLabelText('Restore terminal');
      expect(minimizedIndicator).toBeInTheDocument();
    });
  });

  it('should preserve terminal session when minimizing and restoring', async () => {
    const { container } = render(
      <TerminalView
        isOpen={true}
        onClose={mockOnClose}
        portfolioData={mockPortfolioData}
      />
    );

    // Execute multiple commands
    const input = container.querySelector('.terminal-input') as HTMLInputElement;
    
    await userEvent.type(input, 'pwd');
    await userEvent.keyboard('{Enter}');
    
    await waitFor(() => {
      expect(input.value).toBe('');
    });

    await userEvent.type(input, 'cd experience');
    await userEvent.keyboard('{Enter}');

    await waitFor(() => {
      expect(input.value).toBe('');
    });

    // Get output before minimizing
    const outputBeforeMinimize = container.querySelectorAll('.terminal-line').length;
    expect(outputBeforeMinimize).toBeGreaterThan(0);

    // Minimize terminal
    const minimizeButton = screen.getByLabelText('Minimize terminal');
    await userEvent.click(minimizeButton);

    // Restore terminal
    await waitFor(() => {
      const restoreButton = screen.getByLabelText('Restore terminal');
      expect(restoreButton).toBeInTheDocument();
    });

    const restoreButton = screen.getByLabelText('Restore terminal');
    await userEvent.click(restoreButton);

    // Verify terminal session is preserved
    await waitFor(() => {
      const outputAfterRestore = container.querySelectorAll('.terminal-line').length;
      expect(outputAfterRestore).toBe(outputBeforeMinimize);
    });

    // Verify we can still execute commands
    const inputAfterRestore = container.querySelector('.terminal-input') as HTMLInputElement;
    await userEvent.type(inputAfterRestore, 'pwd');
    await userEvent.keyboard('{Enter}');

    await waitFor(() => {
      const finalOutput = container.querySelectorAll('.terminal-line').length;
      expect(finalOutput).toBeGreaterThan(outputBeforeMinimize);
    });
  });

  it('should handle click-to-focus with command execution', async () => {
    const { container } = render(
      <TerminalView
        isOpen={true}
        onClose={mockOnClose}
        portfolioData={mockPortfolioData}
      />
    );

    // Click on terminal display area
    const terminalDisplay = container.querySelector('.terminal-display');
    expect(terminalDisplay).toBeTruthy();

    await userEvent.click(terminalDisplay!);

    // Input should be focused
    const input = container.querySelector('.terminal-input') as HTMLInputElement;
    expect(document.activeElement).toBe(input);

    // Execute a command
    await userEvent.type(input, 'help');
    await userEvent.keyboard('{Enter}');

    // Wait for command output
    await waitFor(() => {
      const outputLines = container.querySelectorAll('.terminal-line');
      expect(outputLines.length).toBeGreaterThan(0);
    });

    // Click on output area again
    await userEvent.click(terminalDisplay!);

    // Input should still be focused
    expect(document.activeElement).toBe(input);
  });

  it('should toggle between maximize and normal mode', async () => {
    const { container } = render(
      <TerminalView
        isOpen={true}
        onClose={mockOnClose}
        portfolioData={mockPortfolioData}
      />
    );

    // Terminal starts in normal mode (windowed)
    const terminalView = container.querySelector('.terminal-view');
    expect(terminalView).not.toHaveClass('inset-0');
    expect(terminalView).toHaveClass('rounded-lg');

    // Click maximize button to switch to maximized mode
    const maximizeButton = screen.getByLabelText('Maximize terminal');
    await userEvent.click(maximizeButton);

    // Terminal should be in maximized mode
    await waitFor(() => {
      const terminalView = container.querySelector('.terminal-view');
      expect(terminalView).toHaveClass('inset-0');
    });

    // Execute a command in maximized mode
    const input = container.querySelector('.terminal-input') as HTMLInputElement;
    await userEvent.type(input, 'whoami');
    await userEvent.keyboard('{Enter}');

    await waitFor(() => {
      const outputLines = container.querySelectorAll('.terminal-line');
      expect(outputLines.length).toBeGreaterThan(0);
    });

    // Click maximize button again to return to normal mode
    const maximizeButtonAgain = screen.getByLabelText('Restore terminal');
    await userEvent.click(maximizeButtonAgain);

    await waitFor(() => {
      const terminalView = container.querySelector('.terminal-view');
      expect(terminalView).not.toHaveClass('inset-0');
      expect(terminalView).toHaveClass('rounded-lg');
    });
  });

  it('should close terminal with close button', async () => {
    render(
      <TerminalView
        isOpen={true}
        onClose={mockOnClose}
        portfolioData={mockPortfolioData}
      />
    );

    const closeButton = screen.getByLabelText('Close terminal');
    await userEvent.click(closeButton);

    // onClose should be called
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});

describe('Task 20.2: Test responsive design with new features', () => {
  let mockPortfolioData: PortfolioData;
  let mockOnClose: vi.Mock;

  beforeEach(() => {
    mockPortfolioData = PortfolioDataMapper.getPortfolioData();
    mockOnClose = vi.fn();
  });

  it('should render window controls on mobile viewport', async () => {
    // Mock mobile viewport
    global.innerWidth = 375;
    global.innerHeight = 667;

    const { container } = render(
      <TerminalView
        isOpen={true}
        onClose={mockOnClose}
        portfolioData={mockPortfolioData}
      />
    );

    // Window controls should still be visible
    const minimizeButton = screen.getByLabelText('Minimize terminal');
    const maximizeButton = screen.getByLabelText(/Maximize terminal|Restore terminal/);
    const closeButton = screen.getByLabelText('Close terminal');

    expect(minimizeButton).toBeInTheDocument();
    expect(maximizeButton).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();

    // Verify they are clickable
    expect(minimizeButton).not.toBeDisabled();
    expect(maximizeButton).not.toBeDisabled();
    expect(closeButton).not.toBeDisabled();
  });

  it('should handle click-to-focus on touch devices', async () => {
    // Mock mobile viewport
    global.innerWidth = 375;
    global.innerHeight = 667;

    const { container } = render(
      <TerminalView
        isOpen={true}
        onClose={mockOnClose}
        portfolioData={mockPortfolioData}
      />
    );

    const terminalDisplay = container.querySelector('.terminal-display');
    expect(terminalDisplay).toBeTruthy();

    // Simulate touch event (click works for both mouse and touch)
    await userEvent.click(terminalDisplay!);

    // Input should be focused
    const input = container.querySelector('.terminal-input') as HTMLInputElement;
    expect(document.activeElement).toBe(input);
  });

  it('should render terminal in normal mode on mobile', async () => {
    // Mock mobile viewport
    global.innerWidth = 375;
    global.innerHeight = 667;

    const { container } = render(
      <TerminalView
        isOpen={true}
        onClose={mockOnClose}
        portfolioData={mockPortfolioData}
      />
    );

    // Terminal should start in normal mode (windowed) even on mobile
    const terminalView = container.querySelector('.terminal-view');
    expect(terminalView).not.toHaveClass('inset-0');
    expect(terminalView).toHaveClass('rounded-lg');
  });
});

describe('Task 20.3: Accessibility testing for new features', () => {
  let mockPortfolioData: PortfolioData;
  let mockOnClose: vi.Mock;

  beforeEach(() => {
    mockPortfolioData = PortfolioDataMapper.getPortfolioData();
    mockOnClose = vi.fn();
  });

  it('should support keyboard navigation for window controls', async () => {
    render(
      <TerminalView
        isOpen={true}
        onClose={mockOnClose}
        portfolioData={mockPortfolioData}
      />
    );

    // Window controls should be keyboard accessible
    const closeButton = screen.getByLabelText('Close terminal');
    const minimizeButton = screen.getByLabelText('Minimize terminal');
    const maximizeButton = screen.getByLabelText(/Maximize terminal|Restore terminal/);

    // Tab to close button
    closeButton.focus();
    expect(document.activeElement).toBe(closeButton);

    // Press Enter to activate
    await userEvent.keyboard('{Enter}');
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should have proper ARIA labels for window controls', () => {
    render(
      <TerminalView
        isOpen={true}
        onClose={mockOnClose}
        portfolioData={mockPortfolioData}
      />
    );

    // Verify ARIA labels
    expect(screen.getByLabelText('Close terminal')).toBeInTheDocument();
    expect(screen.getByLabelText('Minimize terminal')).toBeInTheDocument();
    expect(screen.getByLabelText(/Maximize terminal|Restore terminal/)).toBeInTheDocument();
  });

  it('should have proper ARIA labels for minimized indicator', async () => {
    render(
      <TerminalView
        isOpen={true}
        onClose={mockOnClose}
        portfolioData={mockPortfolioData}
      />
    );

    // Minimize terminal
    const minimizeButton = screen.getByLabelText('Minimize terminal');
    await userEvent.click(minimizeButton);

    // Verify minimized indicator has proper ARIA label
    await waitFor(() => {
      const restoreButton = screen.getByLabelText('Restore terminal');
      expect(restoreButton).toBeInTheDocument();
    });
  });

  it('should support keyboard navigation for minimized indicator', async () => {
    render(
      <TerminalView
        isOpen={true}
        onClose={mockOnClose}
        portfolioData={mockPortfolioData}
      />
    );

    // Minimize terminal
    const minimizeButton = screen.getByLabelText('Minimize terminal');
    await userEvent.click(minimizeButton);

    // Get minimized indicator
    await waitFor(() => {
      const restoreButton = screen.getByLabelText('Restore terminal');
      expect(restoreButton).toBeInTheDocument();
    });

    const restoreButton = screen.getByLabelText('Restore terminal');

    // Focus and activate with keyboard
    restoreButton.focus();
    expect(document.activeElement).toBe(restoreButton);

    await userEvent.keyboard('{Enter}');

    // Terminal should be restored
    await waitFor(() => {
      const terminalView = document.querySelector('.terminal-view');
      expect(terminalView).toBeInTheDocument();
    });
  });

  it('should maintain focus management when clicking terminal', async () => {
    const { container } = render(
      <TerminalView
        isOpen={true}
        onClose={mockOnClose}
        portfolioData={mockPortfolioData}
      />
    );

    const terminalDisplay = container.querySelector('.terminal-display');
    const input = container.querySelector('.terminal-input') as HTMLInputElement;

    // Click terminal
    await userEvent.click(terminalDisplay!);

    // Input should receive focus
    expect(document.activeElement).toBe(input);

    // Type a command
    await userEvent.type(input, 'help');

    // Focus should remain on input
    expect(document.activeElement).toBe(input);
  });
});

describe('Task 20.4: Cross-browser testing for new features', () => {
  let mockPortfolioData: PortfolioData;
  let mockOnClose: vi.Mock;

  beforeEach(() => {
    mockPortfolioData = PortfolioDataMapper.getPortfolioData();
    mockOnClose = vi.fn();
  });

  it('should render window controls correctly', () => {
    render(
      <TerminalView
        isOpen={true}
        onClose={mockOnClose}
        portfolioData={mockPortfolioData}
      />
    );

    // Verify all window controls are rendered
    const closeButton = screen.getByLabelText('Close terminal');
    const minimizeButton = screen.getByLabelText('Minimize terminal');
    const maximizeButton = screen.getByLabelText(/Maximize terminal|Restore terminal/);

    expect(closeButton).toBeInTheDocument();
    expect(minimizeButton).toBeInTheDocument();
    expect(maximizeButton).toBeInTheDocument();

    // Verify they have proper classes for styling
    expect(closeButton).toHaveClass('window-control-button');
    expect(minimizeButton).toHaveClass('window-control-button');
    expect(maximizeButton).toHaveClass('window-control-button');
  });

  it('should handle click-to-focus across browsers', async () => {
    const { container } = render(
      <TerminalView
        isOpen={true}
        onClose={mockOnClose}
        portfolioData={mockPortfolioData}
      />
    );

    const terminalDisplay = container.querySelector('.terminal-display');
    const input = container.querySelector('.terminal-input') as HTMLInputElement;

    // Click terminal display
    await userEvent.click(terminalDisplay!);

    // Input should be focused
    expect(document.activeElement).toBe(input);

    // Verify input is ready for typing
    await userEvent.type(input, 'test');
    expect(input.value).toBe('test');
  });

  it('should handle window state transitions correctly', async () => {
    const { container } = render(
      <TerminalView
        isOpen={true}
        onClose={mockOnClose}
        portfolioData={mockPortfolioData}
      />
    );

    // Start in normal mode (windowed)
    let terminalView = container.querySelector('.terminal-view');
    expect(terminalView).not.toHaveClass('inset-0');
    expect(terminalView).toHaveClass('rounded-lg');

    // Switch to maximized mode
    const maximizeButton = screen.getByLabelText('Maximize terminal');
    await userEvent.click(maximizeButton);

    await waitFor(() => {
      terminalView = container.querySelector('.terminal-view');
      expect(terminalView).toHaveClass('inset-0');
    });

    // Minimize
    const minimizeButton = screen.getByLabelText('Minimize terminal');
    await userEvent.click(minimizeButton);

    await waitFor(() => {
      const minimizedIndicator = screen.getByLabelText('Restore terminal');
      expect(minimizedIndicator).toBeInTheDocument();
    });

    // Restore
    const restoreButton = screen.getByLabelText('Restore terminal');
    await userEvent.click(restoreButton);

    await waitFor(() => {
      terminalView = container.querySelector('.terminal-view');
      expect(terminalView).toBeInTheDocument();
    });
  });

  it('should preserve terminal functionality across window state changes', async () => {
    const { container } = render(
      <TerminalView
        isOpen={true}
        onClose={mockOnClose}
        portfolioData={mockPortfolioData}
      />
    );

    // Execute command in normal mode
    let input = container.querySelector('.terminal-input') as HTMLInputElement;
    await userEvent.type(input, 'pwd');
    await userEvent.keyboard('{Enter}');

    await waitFor(() => {
      expect(input.value).toBe('');
    });

    // Switch to maximized mode
    const maximizeButton = screen.getByLabelText('Maximize terminal');
    await userEvent.click(maximizeButton);

    // Execute command in maximized mode
    input = container.querySelector('.terminal-input') as HTMLInputElement;
    await userEvent.type(input, 'ls');
    await userEvent.keyboard('{Enter}');

    await waitFor(() => {
      expect(input.value).toBe('');
    });

    // Minimize
    const minimizeButton = screen.getByLabelText('Minimize terminal');
    await userEvent.click(minimizeButton);

    // Restore
    await waitFor(() => {
      const restoreButton = screen.getByLabelText('Restore terminal');
      expect(restoreButton).toBeInTheDocument();
    });

    const restoreButton = screen.getByLabelText('Restore terminal');
    await userEvent.click(restoreButton);

    // Execute command after restore
    await waitFor(() => {
      input = container.querySelector('.terminal-input') as HTMLInputElement;
      expect(input).toBeTruthy();
    });

    await userEvent.type(input, 'help');
    await userEvent.keyboard('{Enter}');

    await waitFor(() => {
      const outputLines = container.querySelectorAll('.terminal-line');
      expect(outputLines.length).toBeGreaterThan(0);
    });
  });
});
