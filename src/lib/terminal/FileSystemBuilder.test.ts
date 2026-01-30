import { describe, it, expect } from 'vitest';
import { FileSystemBuilder } from './FileSystemBuilder';
import { PortfolioDataMapper } from './PortfolioDataMapper';
import { VirtualFileSystem } from './VirtualFileSystem';

describe('FileSystemBuilder', () => {
  it('should build a complete file system with portfolio data', () => {
    const portfolioData = PortfolioDataMapper.getPortfolioData();
    const root = FileSystemBuilder.buildFileSystem(portfolioData);

    // Verify root structure
    expect(root.type).toBe('directory');
    expect(root.children).toBeDefined();
    expect(root.children!['README.md']).toBeDefined();
    expect(root.children!['about.txt']).toBeDefined();
    expect(root.children!['experience']).toBeDefined();
    expect(root.children!['projects']).toBeDefined();
    expect(root.children!['skills']).toBeDefined();
    expect(root.children!['contact']).toBeDefined();
    expect(root.children!['.secrets']).toBeDefined();
  });

  it('should create experience directory with JSON files', () => {
    const portfolioData = PortfolioDataMapper.getPortfolioData();
    const root = FileSystemBuilder.buildFileSystem(portfolioData);
    const experienceDir = root.children!['experience'];

    expect(experienceDir.type).toBe('directory');
    expect(experienceDir.children).toBeDefined();
    expect(Object.keys(experienceDir.children!).length).toBeGreaterThan(0);
    
    // Check that files are JSON
    const firstFile = Object.values(experienceDir.children!)[0];
    expect(firstFile.name).toMatch(/\.json$/);
    expect(firstFile.type).toBe('file');
    expect(firstFile.content).toBeDefined();
  });

  it('should create projects directory with Markdown files', () => {
    const portfolioData = PortfolioDataMapper.getPortfolioData();
    const root = FileSystemBuilder.buildFileSystem(portfolioData);
    const projectsDir = root.children!['projects'];

    expect(projectsDir.type).toBe('directory');
    expect(projectsDir.children).toBeDefined();
    expect(Object.keys(projectsDir.children!).length).toBeGreaterThan(0);
    
    // Check that files are Markdown
    const firstFile = Object.values(projectsDir.children!)[0];
    expect(firstFile.name).toMatch(/\.md$/);
    expect(firstFile.type).toBe('file');
    expect(firstFile.content).toBeDefined();
  });

  it('should create skills directory with categorized files', () => {
    const portfolioData = PortfolioDataMapper.getPortfolioData();
    const root = FileSystemBuilder.buildFileSystem(portfolioData);
    const skillsDir = root.children!['skills'];

    expect(skillsDir.type).toBe('directory');
    expect(skillsDir.children).toBeDefined();
    expect(skillsDir.children!['languages.txt']).toBeDefined();
    expect(skillsDir.children!['frameworks.txt']).toBeDefined();
    expect(skillsDir.children!['tools.txt']).toBeDefined();
    expect(skillsDir.children!['databases.txt']).toBeDefined();
    expect(skillsDir.children!['overview.txt']).toBeDefined();
  });

  it('should create contact directory with info files', () => {
    const portfolioData = PortfolioDataMapper.getPortfolioData();
    const root = FileSystemBuilder.buildFileSystem(portfolioData);
    const contactDir = root.children!['contact'];

    expect(contactDir.type).toBe('directory');
    expect(contactDir.children).toBeDefined();
    expect(contactDir.children!['email.txt']).toBeDefined();
    expect(contactDir.children!['social.txt']).toBeDefined();
    expect(contactDir.children!['info.txt']).toBeDefined();
  });

  it('should create .secrets directory with easter eggs', () => {
    const portfolioData = PortfolioDataMapper.getPortfolioData();
    const root = FileSystemBuilder.buildFileSystem(portfolioData);
    const secretsDir = root.children!['.secrets'];

    expect(secretsDir.type).toBe('directory');
    expect(secretsDir.children).toBeDefined();
    expect(secretsDir.children!['easter-eggs.txt']).toBeDefined();
    expect(secretsDir.children!['quotes.txt']).toBeDefined();
    expect(secretsDir.children!['fun-facts.txt']).toBeDefined();
  });
});

describe('VirtualFileSystem with Portfolio Data', () => {
  it('should initialize with portfolio data using static method', () => {
    const fs = VirtualFileSystem.withPortfolioData();

    // Test navigation
    expect(fs.getCurrentDirectory()).toBe('/');

    // Test listing root directory
    const rootList = fs.listDirectory();
    expect(rootList.success).toBe(true);
    expect(rootList.data).toBeDefined();
    expect(rootList.data!.length).toBeGreaterThan(0);
  });

  it('should navigate to experience directory', () => {
    const fs = VirtualFileSystem.withPortfolioData();

    const result = fs.changeDirectory('experience');
    expect(result.success).toBe(true);
    expect(fs.getCurrentDirectory()).toBe('/experience');

    const list = fs.listDirectory();
    expect(list.success).toBe(true);
    expect(list.data!.length).toBeGreaterThan(0);
  });

  it('should read about.txt file', () => {
    const fs = VirtualFileSystem.withPortfolioData();

    const result = fs.readFile('about.txt');
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data).toContain('Dheeraj Kumar');
    expect(result.data).toContain('Senior Software Engineer');
  });

  it('should read README.md file', () => {
    const fs = VirtualFileSystem.withPortfolioData();

    const result = fs.readFile('README.md');
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data).toContain('Portfolio Terminal');
    expect(result.data).toContain('Quick Start');
  });

  it('should navigate to and list projects directory', () => {
    const fs = VirtualFileSystem.withPortfolioData();

    fs.changeDirectory('projects');
    const list = fs.listDirectory();
    
    expect(list.success).toBe(true);
    expect(list.data!.length).toBeGreaterThan(0);
    expect(list.data!.every(node => node.name.endsWith('.md'))).toBe(true);
  });

  it('should read a project markdown file', () => {
    const fs = VirtualFileSystem.withPortfolioData();

    fs.changeDirectory('projects');
    const list = fs.listDirectory();
    const firstProject = list.data![0];

    const content = fs.readFile(firstProject.name);
    expect(content.success).toBe(true);
    expect(content.data).toContain('#');
    expect(content.data).toContain('##');
  });

  it('should access .secrets directory', () => {
    const fs = VirtualFileSystem.withPortfolioData();

    const result = fs.changeDirectory('.secrets');
    expect(result.success).toBe(true);

    const list = fs.listDirectory();
    expect(list.success).toBe(true);
    expect(list.data!.some(node => node.name === 'easter-eggs.txt')).toBe(true);
  });
});
