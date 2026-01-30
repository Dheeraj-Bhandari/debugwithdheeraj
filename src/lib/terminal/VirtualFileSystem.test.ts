import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { VirtualFileSystem } from './VirtualFileSystem';

/**
 * Property-Based Tests for VirtualFileSystem
 * Feature: terminal-portfolio-view
 */

describe('VirtualFileSystem - Property-Based Tests', () => {
  let fs: VirtualFileSystem;

  beforeEach(() => {
    fs = new VirtualFileSystem();
  });

  /**
   * Property 7: Path Navigation Reversibility
   * For any directory, executing cd <dir> followed by cd .. should return to the original directory
   * Validates: Requirements 3.2, 3.3
   */
  it('Property 7: Path Navigation Reversibility - cd <dir> then cd .. returns to original', () => {
    // Feature: terminal-portfolio-view, Property 7: Path Navigation Reversibility
    
    fc.assert(
      fc.property(
        // Generate valid directory paths from the file system
        fc.constantFrom(
          'experience',
          'projects',
          'skills',
          'contact',
          '.secrets',
          'experience',
          'projects'
        ),
        (directory) => {
          // Start from root
          const originalDir = fs.getCurrentDirectory();
          
          // Change to the directory
          const cdResult = fs.changeDirectory(directory);
          
          // Only test reversibility if cd succeeded
          if (cdResult.success) {
            const afterCd = fs.getCurrentDirectory();
            
            // Change back with cd ..
            const cdBackResult = fs.changeDirectory('..');
            
            // Should return to original directory
            expect(cdBackResult.success).toBe(true);
            expect(fs.getCurrentDirectory()).toBe(originalDir);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 7 Extended: Multi-level path navigation reversibility
   * For any sequence of cd commands, cd .. should reverse them
   */
  it('Property 7 Extended: Multi-level path navigation reversibility', () => {
    // Feature: terminal-portfolio-view, Property 7: Path Navigation Reversibility
    
    fc.assert(
      fc.property(
        // Generate sequences of valid directory names
        fc.array(
          fc.constantFrom('experience', 'projects', 'skills', 'contact', '.secrets'),
          { minLength: 1, maxLength: 3 }
        ),
        (directories) => {
          // Reset to root
          fs = new VirtualFileSystem();
          const originalDir = fs.getCurrentDirectory();
          
          // Navigate down through directories
          let successfulCds = 0;
          for (const dir of directories) {
            const result = fs.changeDirectory(dir);
            if (result.success) {
              successfulCds++;
            } else {
              break; // Stop if we hit an invalid path
            }
          }
          
          // Navigate back up the same number of times
          for (let i = 0; i < successfulCds; i++) {
            fs.changeDirectory('..');
          }
          
          // Should be back at original directory
          expect(fs.getCurrentDirectory()).toBe(originalDir);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 7 Edge Case: cd .. at root should stay at root
   */
  it('Property 7 Edge Case: cd .. at root stays at root', () => {
    // Feature: terminal-portfolio-view, Property 7: Path Navigation Reversibility
    
    const originalDir = fs.getCurrentDirectory();
    expect(originalDir).toBe('/');
    
    const result = fs.changeDirectory('..');
    
    expect(result.success).toBe(true);
    expect(fs.getCurrentDirectory()).toBe('/');
  });

  /**
   * Property 3: Directory Listing Consistency
   * For any directory, ls should return all and only direct children, with no duplicates
   * Validates: Requirements 3.1
   */
  it('Property 3: Directory Listing Consistency - ls returns all direct children without duplicates', () => {
    // Feature: terminal-portfolio-view, Property 3: Directory Listing Consistency
    
    fc.assert(
      fc.property(
        // Test various directories including root
        fc.constantFrom('/', '/experience', '/projects', '/skills', '/contact', '/.secrets'),
        (directory) => {
          // Navigate to the directory if not root
          if (directory !== '/') {
            fs.changeDirectory(directory);
          }
          
          // List the directory
          const listResult = fs.listDirectory();
          
          expect(listResult.success).toBe(true);
          
          if (listResult.data) {
            const names = listResult.data.map(node => node.name);
            
            // Check for duplicates
            const uniqueNames = new Set(names);
            expect(names.length).toBe(uniqueNames.size);
            
            // All items should be direct children (no nested paths)
            listResult.data.forEach(node => {
              expect(node.name).not.toContain('/');
            });
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3 Extended: ls with explicit path should match ls after cd
   */
  it('Property 3 Extended: ls with path matches ls after cd to that path', () => {
    // Feature: terminal-portfolio-view, Property 3: Directory Listing Consistency
    
    fc.assert(
      fc.property(
        fc.constantFrom('experience', 'projects', 'skills', 'contact', '.secrets'),
        (directory) => {
          // Get listing with explicit path from root
          fs = new VirtualFileSystem();
          const listWithPath = fs.listDirectory(directory);
          
          // Navigate to directory and list
          fs = new VirtualFileSystem();
          fs.changeDirectory(directory);
          const listAfterCd = fs.listDirectory();
          
          // Both should succeed or both should fail
          expect(listWithPath.success).toBe(listAfterCd.success);
          
          if (listWithPath.success && listAfterCd.success) {
            // Should return the same items
            const namesWithPath = listWithPath.data?.map(n => n.name).sort();
            const namesAfterCd = listAfterCd.data?.map(n => n.name).sort();
            
            expect(namesWithPath).toEqual(namesAfterCd);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3 Edge Case: Root directory listing
   */
  it('Property 3 Edge Case: Root directory contains expected top-level items', () => {
    // Feature: terminal-portfolio-view, Property 3: Directory Listing Consistency
    
    const listResult = fs.listDirectory('/');
    
    expect(listResult.success).toBe(true);
    expect(listResult.data).toBeDefined();
    
    const names = listResult.data!.map(node => node.name);
    
    // Should contain expected directories
    expect(names).toContain('experience');
    expect(names).toContain('projects');
    expect(names).toContain('skills');
    expect(names).toContain('contact');
    expect(names).toContain('README.md');
    expect(names).toContain('about.txt');
    
    // No duplicates
    const uniqueNames = new Set(names);
    expect(names.length).toBe(uniqueNames.size);
  });

  /**
   * Property 4: File Content Integrity
   * For any file, cat should return the complete, unmodified content
   * Validates: Requirements 4.1, 4.2, 4.3
   */
  it('Property 4: File Content Integrity - cat returns exact file content', () => {
    // Feature: terminal-portfolio-view, Property 4: File Content Integrity
    
    fc.assert(
      fc.property(
        // Test reading files multiple times
        fc.constantFrom('README.md', 'about.txt', '.secrets/easter-eggs.txt'),
        fc.integer({ min: 1, max: 5 }),
        (filePath, readCount) => {
          const firstRead = fs.readFile(filePath);
          
          expect(firstRead.success).toBe(true);
          expect(firstRead.data).toBeDefined();
          
          // Read the same file multiple times
          for (let i = 0; i < readCount; i++) {
            const subsequentRead = fs.readFile(filePath);
            
            expect(subsequentRead.success).toBe(true);
            expect(subsequentRead.data).toBe(firstRead.data);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4 Extended: File content should not be affected by navigation
   */
  it('Property 4 Extended: File content unchanged after directory navigation', () => {
    // Feature: terminal-portfolio-view, Property 4: File Content Integrity
    
    fc.assert(
      fc.property(
        fc.constantFrom('README.md', 'about.txt'),
        fc.array(fc.constantFrom('experience', 'projects', 'skills'), { maxLength: 3 }),
        (filePath, navigationPath) => {
          // Read file from root
          const initialRead = fs.readFile(filePath);
          
          if (initialRead.success) {
            // Navigate around
            for (const dir of navigationPath) {
              fs.changeDirectory(dir);
            }
            
            // Navigate back to root
            for (let i = 0; i < navigationPath.length; i++) {
              fs.changeDirectory('..');
            }
            
            // Read file again
            const finalRead = fs.readFile(filePath);
            
            expect(finalRead.success).toBe(true);
            expect(finalRead.data).toBe(initialRead.data);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4 Edge Case: Reading non-existent file returns error
   */
  it('Property 4 Edge Case: Reading non-existent file returns error', () => {
    // Feature: terminal-portfolio-view, Property 4: File Content Integrity
    
    fc.assert(
      fc.property(
        fc.constantFrom('nonexistent.txt', 'fake/file.md', 'missing.json'),
        (filePath) => {
          const result = fs.readFile(filePath);
          
          expect(result.success).toBe(false);
          expect(result.error).toBeDefined();
          expect(result.error).toContain('No such file or directory');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4 Edge Case: Reading directory as file returns error
   */
  it('Property 4 Edge Case: Reading directory as file returns error', () => {
    // Feature: terminal-portfolio-view, Property 4: File Content Integrity
    
    fc.assert(
      fc.property(
        fc.constantFrom('experience', 'projects', 'skills', 'contact', '.secrets'),
        (directory) => {
          const result = fs.readFile(directory);
          
          expect(result.success).toBe(false);
          expect(result.error).toBeDefined();
          expect(result.error).toContain('Is a directory');
        }
      ),
      { numRuns: 100 }
    );
  });
});
