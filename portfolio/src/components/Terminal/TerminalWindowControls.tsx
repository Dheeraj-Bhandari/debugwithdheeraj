import React, { useRef, useEffect } from 'react';

export interface TerminalWindowControlsProps {
  windowState: 'normal' | 'minimized' | 'maximized';
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  title?: string;
  onDragStart?: (e: React.MouseEvent) => void;
  onDrag?: (e: React.MouseEvent) => void;
  onDragEnd?: (e: React.MouseEvent) => void;
}

/**
 * TerminalWindowControls component renders OS-style window control buttons
 * Provides minimize, maximize, and close functionality with draggable title bar
 */
export const TerminalWindowControls: React.FC<TerminalWindowControlsProps> = ({
  windowState,
  onMinimize,
  onMaximize,
  onClose,
  title = 'Terminal',
  onDragStart,
  onDrag,
  onDragEnd,
}) => {
  const titleBarRef = useRef<HTMLDivElement>(null);

  // Handle mouse down on title bar (start drag)
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only allow dragging in normal mode (not minimized or maximized)
    if (windowState !== 'normal') return;
    
    // Don't start drag if clicking on buttons
    if ((e.target as HTMLElement).closest('.window-control-button')) return;

    if (onDragStart) {
      onDragStart(e);
    }
  };

  // Global mouse move and mouse up handlers
  useEffect(() => {
    if (!onDrag || !onDragEnd) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (onDrag) {
        onDrag(e as any);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (onDragEnd) {
        onDragEnd(e as any);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onDrag, onDragEnd]);

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      ref={titleBarRef}
      className={`terminal-window-controls flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800 select-none ${
        windowState === 'normal' ? 'cursor-move' : ''
      }`}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      role="toolbar"
      aria-label="Window controls"
      tabIndex={0}
    >
      {/* Title (left side) */}
      <div className="flex-1 text-left text-sm text-gray-400 font-mono pointer-events-none">
        {title}
      </div>

      {/* Window Control Buttons (Windows style - right side) */}
      <div className="flex items-center gap-1">
        {/* Minimize Button */}
        <button
          onClick={onMinimize}
          className="window-control-button w-10 h-8 flex items-center justify-center hover:bg-gray-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-500"
          aria-label="Minimize terminal"
          title="Minimize"
        >
          <svg className="w-3 h-3 text-gray-300" fill="currentColor" viewBox="0 0 12 12">
            <rect x="0" y="5" width="12" height="2" />
          </svg>
          <span className="sr-only">Minimize</span>
        </button>

        {/* Maximize/Restore Button */}
        <button
          onClick={onMaximize}
          className="window-control-button w-10 h-8 flex items-center justify-center hover:bg-gray-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-500"
          aria-label={windowState === 'maximized' ? 'Restore terminal' : 'Maximize terminal'}
          title={windowState === 'maximized' ? 'Restore' : 'Maximize'}
        >
          {windowState === 'maximized' ? (
            // Restore icon (two overlapping squares)
            <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 12 12">
              <rect x="2" y="2" width="7" height="7" />
              <path d="M3 3 L3 1 L11 1 L11 9 L9 9" />
            </svg>
          ) : (
            // Maximize icon (single square)
            <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 12 12">
              <rect x="1" y="1" width="10" height="10" />
            </svg>
          )}
          <span className="sr-only">{windowState === 'maximized' ? 'Restore' : 'Maximize'}</span>
        </button>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="window-control-button w-10 h-8 flex items-center justify-center hover:bg-red-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-400"
          aria-label="Close terminal"
          title="Close (Esc)"
        >
          <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 12 12">
            <path d="M2 2 L10 10 M10 2 L2 10" />
          </svg>
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  );
};
