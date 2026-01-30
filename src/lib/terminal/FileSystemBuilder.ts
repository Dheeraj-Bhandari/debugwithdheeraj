import type { PortfolioData, FileSystemNode } from './types';
import { PortfolioDataMapper } from './PortfolioDataMapper';

/**
 * Builds a virtual file system from portfolio data
 */
export class FileSystemBuilder {
  /**
   * Creates a complete file system structure with portfolio content
   */
  static buildFileSystem(portfolioData: PortfolioData): FileSystemNode {
    const root: FileSystemNode = {
      name: '/',
      type: 'directory',
      children: {}
    };

    // Add README.md at root
    root.children!['README.md'] = {
      name: 'README.md',
      type: 'file',
      content: PortfolioDataMapper.createReadme()
    };

    // Add about.txt at root
    root.children!['about.txt'] = {
      name: 'about.txt',
      type: 'file',
      content: PortfolioDataMapper.formatAboutText(portfolioData.about)
    };

    // Create experience directory
    root.children!['experience'] = this.createExperienceDirectory(portfolioData.experience);

    // Create projects directory
    root.children!['projects'] = this.createProjectsDirectory(portfolioData.projects);

    // Create skills directory
    root.children!['skills'] = this.createSkillsDirectory(portfolioData.skills);

    // Create contact directory
    root.children!['contact'] = this.createContactDirectory(portfolioData.contact);

    // Create .secrets directory with easter eggs
    root.children!['.secrets'] = this.createSecretsDirectory();

    return root;
  }

  /**
   * Creates experience directory with JSON files for each job
   */
  private static createExperienceDirectory(experiences: PortfolioData['experience']): FileSystemNode {
    const experienceDir: FileSystemNode = {
      name: 'experience',
      type: 'directory',
      children: {}
    };

    experiences.forEach((exp) => {
      // Create filename from company name (lowercase, replace spaces with hyphens)
      const filename = `${exp.company.toLowerCase().replace(/\s+/g, '-')}.json`;
      
      experienceDir.children![filename] = {
        name: filename,
        type: 'file',
        content: PortfolioDataMapper.formatExperienceJSON(exp)
      };
    });

    return experienceDir;
  }

  /**
   * Creates projects directory with Markdown files for each project
   */
  private static createProjectsDirectory(projects: PortfolioData['projects']): FileSystemNode {
    const projectsDir: FileSystemNode = {
      name: 'projects',
      type: 'directory',
      children: {}
    };

    projects.forEach((project) => {
      // Create filename from project title (lowercase, replace spaces with hyphens)
      const filename = `${project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
      
      projectsDir.children![filename] = {
        name: filename,
        type: 'file',
        content: PortfolioDataMapper.formatProjectMarkdown(project)
      };
    });

    return projectsDir;
  }

  /**
   * Creates skills directory with categorized skill files
   */
  private static createSkillsDirectory(skills: PortfolioData['skills']): FileSystemNode {
    const skillsDir: FileSystemNode = {
      name: 'skills',
      type: 'directory',
      children: {}
    };

    // Create languages.txt
    skillsDir.children!['languages.txt'] = {
      name: 'languages.txt',
      type: 'file',
      content: 'Programming Languages\n' + '='.repeat(20) + '\n\n' + 
               skills.languages.map(lang => `• ${lang}`).join('\n')
    };

    // Create frameworks.txt
    skillsDir.children!['frameworks.txt'] = {
      name: 'frameworks.txt',
      type: 'file',
      content: 'Frameworks & Libraries\n' + '='.repeat(23) + '\n\n' + 
               skills.frameworks.map(fw => `• ${fw}`).join('\n')
    };

    // Create tools.txt
    skillsDir.children!['tools.txt'] = {
      name: 'tools.txt',
      type: 'file',
      content: 'Tools & Technologies\n' + '='.repeat(20) + '\n\n' + 
               skills.tools.map(tool => `• ${tool}`).join('\n')
    };

    // Create databases.txt
    skillsDir.children!['databases.txt'] = {
      name: 'databases.txt',
      type: 'file',
      content: 'Databases\n' + '='.repeat(9) + '\n\n' + 
               skills.databases.map(db => `• ${db}`).join('\n')
    };

    // Create overview.txt with all skills
    skillsDir.children!['overview.txt'] = {
      name: 'overview.txt',
      type: 'file',
      content: PortfolioDataMapper.formatSkillsText(skills)
    };

    return skillsDir;
  }

  /**
   * Creates contact directory with contact information files
   */
  private static createContactDirectory(contact: PortfolioData['contact']): FileSystemNode {
    const contactDir: FileSystemNode = {
      name: 'contact',
      type: 'directory',
      children: {}
    };

    // Create email.txt
    contactDir.children!['email.txt'] = {
      name: 'email.txt',
      type: 'file',
      content: `Email Address\n=============\n\n${contact.email}\n\nFeel free to reach out for:\n• Job opportunities\n• Collaboration proposals\n• Technical discussions\n• Speaking engagements\n`
    };

    // Create social.txt
    contactDir.children!['social.txt'] = {
      name: 'social.txt',
      type: 'file',
      content: `Social Media Links\n==================\n\nGitHub: ${contact.github}\nLinkedIn: ${contact.linkedin}\n${contact.twitter ? `Twitter: ${contact.twitter}\n` : ''}\nConnect with me on these platforms!`
    };

    // Create info.txt with all contact information
    contactDir.children!['info.txt'] = {
      name: 'info.txt',
      type: 'file',
      content: PortfolioDataMapper.formatContactText(contact)
    };

    return contactDir;
  }

  /**
   * Creates .secrets directory with easter eggs
   */
  private static createSecretsDirectory(): FileSystemNode {
    const secretsDir: FileSystemNode = {
      name: '.secrets',
      type: 'directory',
      children: {}
    };

    secretsDir.children!['easter-eggs.txt'] = {
      name: 'easter-eggs.txt',
      type: 'file',
      content: PortfolioDataMapper.createEasterEggs()
    };

    secretsDir.children!['quotes.txt'] = {
      name: 'quotes.txt',
      type: 'file',
      content: `Favorite Programming Quotes
===========================

"First, solve the problem. Then, write the code."
- John Johnson

"Code is like humor. When you have to explain it, it's bad."
- Cory House

"The best error message is the one that never shows up."
- Thomas Fuchs

"Simplicity is the soul of efficiency."
- Austin Freeman

"Make it work, make it right, make it fast."
- Kent Beck
`
    };

    secretsDir.children!['fun-facts.txt'] = {
      name: 'fun-facts.txt',
      type: 'file',
      content: `Fun Developer Facts
===================

• The first computer bug was an actual bug (a moth) found in a computer in 1947
• The first programmer was Ada Lovelace in the 1840s
• "Hello, World!" was first used in a 1978 book about C programming
• The average developer drinks 3-4 cups of coffee per day
• There are over 700 programming languages in existence
• The first computer virus was created in 1983
• Git was created by Linus Torvalds in just 2 weeks
• The term "debugging" predates computers - it was used in engineering
`
    };

    return secretsDir;
  }
}
