import type { PortfolioData } from './types';
import {
  personalInfo,
  contactInfo,
  careerHighlights,
  keyStats,
  workExperience,
  projects,
  technicalSkills,
} from '../../data/portfolioData';

/**
 * Maps portfolio data to virtual file system structure
 */
export class PortfolioDataMapper {
  /**
   * Extracts portfolio data from shared data source
   */
  static getPortfolioData(): PortfolioData {
    return {
      about: {
        name: personalInfo.name,
        role: personalInfo.role,
        bio: personalInfo.bio,
        highlights: careerHighlights,
        stats: keyStats,
      },
      experience: workExperience,
      projects: projects.map(project => ({
        ...project,
        links: project.links.map(link => ({
          ...link,
          type: (link.type === 'website' || link.type === 'npm' ? 'other' : link.type) as 'github' | 'demo' | 'docs' | 'other',
        })),
      })),
      skills: technicalSkills,
      contact: contactInfo,
    };
  }

  /**
   * Formats about data as text file content
   */
  static formatAboutText(about: PortfolioData['about']): string {
    let content = `${about.name} - ${about.role}\n`;
    content += '='.repeat(about.name.length + about.role.length + 3) + '\n\n';
    content += about.bio + '\n\n';
    
    content += 'Career Highlights:\n';
    content += '-'.repeat(18) + '\n';
    about.highlights.forEach((highlight, i) => {
      content += `${i + 1}. ${highlight}\n`;
    });
    
    content += '\n';
    content += 'Key Stats:\n';
    content += '-'.repeat(10) + '\n';
    about.stats.forEach(stat => {
      content += `• ${stat.label}: ${stat.value}\n`;
    });
    
    return content;
  }

  /**
   * Formats experience data as JSON
   */
  static formatExperienceJSON(experience: PortfolioData['experience'][0]): string {
    return JSON.stringify(experience, null, 2);
  }

  /**
   * Formats project data as Markdown
   */
  static formatProjectMarkdown(project: PortfolioData['projects'][0]): string {
    let content = `# ${project.title}\n\n`;
    content += `${project.description}\n\n`;
    
    content += '## Metrics\n\n';
    project.metrics.forEach(metric => {
      content += `- **${metric.label}**: ${metric.value}\n`;
    });
    
    content += '\n## Tech Stack\n\n';
    content += project.tech.join(', ') + '\n\n';
    
    content += '## Links\n\n';
    project.links.forEach(link => {
      content += `- [${link.label}](${link.url})\n`;
    });
    
    return content;
  }

  /**
   * Formats skills data as text
   */
  static formatSkillsText(skills: PortfolioData['skills']): string {
    let content = 'Technical Skills\n';
    content += '================\n\n';
    
    content += 'Languages:\n';
    content += skills.languages.map(lang => `  • ${lang}`).join('\n') + '\n\n';
    
    content += 'Frameworks:\n';
    content += skills.frameworks.map(fw => `  • ${fw}`).join('\n') + '\n\n';
    
    content += 'Tools & Technologies:\n';
    content += skills.tools.map(tool => `  • ${tool}`).join('\n') + '\n\n';
    
    content += 'Databases:\n';
    content += skills.databases.map(db => `  • ${db}`).join('\n') + '\n';
    
    return content;
  }

  /**
   * Formats contact data as text
   */
  static formatContactText(contact: PortfolioData['contact']): string {
    let content = 'Contact Information\n';
    content += '===================\n\n';
    
    content += `Email: ${contact.email}\n`;
    content += `GitHub: ${contact.github}\n`;
    content += `LinkedIn: ${contact.linkedin}\n`;
    if (contact.twitter) {
      content += `Twitter: ${contact.twitter}\n`;
    }
    content += `Resume: ${contact.resume}\n`;
    
    return content;
  }

  /**
   * Creates README content with navigation instructions
   */
  static createReadme(): string {
    return `# Dheeraj Portfolio Terminal

Welcome to my interactive portfolio! This terminal interface provides a unique way to explore my professional experience, projects, and skills.

## Quick Start

### Navigation Commands
- \`ls\` - List files and directories
- \`cd <directory>\` - Change directory
- \`cd ..\` - Go to parent directory
- \`pwd\` - Print working directory
- \`cat <file>\` - Display file contents

### Portfolio Shortcuts
- \`about\` - View about me
- \`experience\` - View work experience
- \`projects\` - View featured projects
- \`skills\` - View technical skills
- \`contact\` - View contact information

### Utility Commands
- \`help\` - Show all available commands
- \`clear\` - Clear terminal output
- \`whoami\` - Display user information
- \`neofetch\` - Display system banner
- \`exit\` or \`gui\` - Return to GUI view

## File System Structure

\`\`\`
/
├── about.txt           # About me
├── README.md           # This file
├── experience/         # Work experience (JSON files)
├── projects/           # Featured projects (Markdown files)
├── skills/             # Technical skills
├── contact/            # Contact information
└── .secrets/           # Easter eggs 🥚
\`\`\`

## Tips

- Use Tab for auto-completion
- Use Up/Down arrows to navigate command history
- Try exploring the .secrets directory for surprises!

Happy exploring! 🚀
`;
  }

  /**
   * Creates easter egg content
   */
  static createEasterEggs(): string {
    return `# Easter Eggs 🥚

Congratulations! You found the secret directory!

## Fun Facts

1. I wrote my first "Hello World" in BASIC on a 486 computer
2. I can type 80+ WPM (when the keyboard cooperates)
3. My favorite debugging technique is explaining the problem to a rubber duck
4. I've spent more time configuring my dev environment than I'd like to admit
5. Coffee is not a dependency, it's a core requirement

## Secret Commands

Try these commands in the terminal:
- \`whoami\` - Find out who you're talking to
- \`neofetch\` - See a cool system banner
- \`date\` - Check what year it is (spoiler: we're in the future!)

## Philosophy

"Any fool can write code that a computer can understand. 
Good programmers write code that humans can understand."
- Martin Fowler

Keep exploring! There might be more secrets hidden around... 👀
`;
  }
}
