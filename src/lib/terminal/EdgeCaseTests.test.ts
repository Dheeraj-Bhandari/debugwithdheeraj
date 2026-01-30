import { describe, it, expect } from 'vitest';
import { CommandParser } from './CommandParser';
import { CommandExecutor } from './CommandExecutor';
import { VirtualFileSystem } from './VirtualFileSystem';
import { PortfolioDataMapper } from './PortfolioDataMapper';

describe('Edge Cases and Error Handling', () => {
  const parser = new CommandParser();
  const executor = new CommandExecutor();
  const fs = VirtualFileSystem.withPortfolioData(PortfolioDataMapper.getPortfolioData());

  describe('Invalid Commands', () => {
    it('should handle unknown commands with error message', () => {
      const parsed = parser.parse('invalidcommand');
      const result = executor.execute(parsed, fs);
      
      expect(result.exitCode).toBe(127);
      expect(result.error).toBe('Command not found');
      expect(result.output.some(line => line.content.includes('command not found'))).toBe(true);
      expect(result.output.some(line => line.content.includes('help'))).toBe(true);
    });

    it('should handle random invalid commands', () => {
      const parsed = parser.parse('xyz123');
      const result = executor.execute(parsed, fs);
      
      expect(result.exitCode).toBe(127);
      expect(result.output.some(line => line.content.includes('command not found'))).toBe(true);
    });
  });

  describe('Non-existent Files/Directories', () => {
    it('should handle cat on non-existent file', () => {
      const parsed = parser.parse('cat nonexistent.txt');
      const result = executor.execute(parsed, fs);
      
      expect(result.exitCode).toBe(1);
      expect(result.output.some(line => line.content.includes('No such file or directory'))).toBe(true);
    });

    it('should handle cd to non-existent directory', () => {
      const parsed = parser.parse('cd nonexistentdir');
      const result = executor.execute(parsed, fs);
      
      expect(result.exitCode).toBe(1);
      expect(result.output.some(line => line.content.includes('No such file or directory'))).toBe(true);
    });

    it('should handle ls on non-existent directory', () => {
      const parsed = parser.parse('ls nonexistentdir');
      const result = executor.execute(parsed, fs);
      
      expect(result.exitCode).toBe(1);
      expect(result.output.some(line => line.content.includes('No such file or directory'))).toBe(true);
    });
  });

  describe('Empty Input', () => {
    it('should handle empty command gracefully', () => {
      const parsed = parser.parse('');
      const result = executor.execute(parsed, fs);
      
      expect(result.exitCode).toBe(0);
      expect(result.output).toHaveLength(0);
    });

    it('should handle whitespace-only input', () => {
      const parsed = parser.parse('   ');
      const result = executor.execute(parsed, fs);
      
      expect(result.exitCode).toBe(0);
      expect(result.output).toHaveLength(0);
    });
  });

  describe('Special Characters', () => {
    it('should handle echo with quoted text', () => {
      const parsed = parser.parse('echo "Hello World"');
      const result = executor.execute(parsed, fs);
      
      expect(result.exitCode).toBe(0);
      expect(result.output[0].content).toBe('Hello World');
    });

    it('should handle echo with single quotes', () => {
      const parsed = parser.parse("echo 'Single quotes'");
      const result = executor.execute(parsed, fs);
      
      expect(result.exitCode).toBe(0);
      expect(result.output[0].content).toBe('Single quotes');
    });

    it('should handle commands with multiple spaces', () => {
      const parsed = parser.parse('echo    multiple    spaces');
      const result = executor.execute(parsed, fs);
      
      expect(result.exitCode).toBe(0);
      expect(result.output[0].content).toBe('multiple spaces');
    });

    it('should handle path with ..', () => {
      // First cd to a subdirectory
      fs.changeDirectory('/experience');
      const parsed = parser.parse('cd ..');
      const result = executor.execute(parsed, fs);
      
      expect(result.exitCode).toBe(0);
      expect(fs.getCurrentDirectory()).toBe('/');
    });

    it('should handle path with .', () => {
      const parsed = parser.parse('cd ./experience');
      const result = executor.execute(parsed, fs);
      
      expect(result.exitCode).toBe(0);
      expect(fs.getCurrentDirectory()).toBe('/experience');
      
      // Reset
      fs.changeDirectory('/');
    });
  });

  describe('Type Mismatches', () => {
    it('should handle cat on directory', () => {
      const parsed = parser.parse('cat experience');
      const result = executor.execute(parsed, fs);
      
      expect(result.exitCode).toBe(1);
      expect(result.output.some(line => line.content.includes('Is a directory'))).toBe(true);
    });

    it('should handle cd on file', () => {
      const parsed = parser.parse('cd README.md');
      const result = executor.execute(parsed, fs);
      
      expect(result.exitCode).toBe(1);
      expect(result.output.some(line => line.content.includes('Not a directory'))).toBe(true);
    });
  });

  describe('Missing Arguments', () => {
    it('should handle cat with no arguments', () => {
      const parsed = parser.parse('cat');
      const result = executor.execute(parsed, fs);
      
      expect(result.exitCode).toBe(1);
      expect(result.output.some(line => line.content.includes('missing file operand'))).toBe(true);
    });
  });

  describe('Command Validation', () => {
    it('should validate cd with too many arguments', () => {
      const parsed = parser.parse('cd dir1 dir2');
      const validation = parser.validate(parsed);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors.some(err => err.includes('too many arguments'))).toBe(true);
    });
  });
});
