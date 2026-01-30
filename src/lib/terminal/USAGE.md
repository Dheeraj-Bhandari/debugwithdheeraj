# Portfolio Data Mapper Usage

This document demonstrates how to use the PortfolioDataMapper and FileSystemBuilder to create a virtual file system with portfolio content.

## Quick Start

```typescript
import { VirtualFileSystem } from './lib/terminal';

// Create a file system with default portfolio data
const fs = VirtualFileSystem.withPortfolioData();

// Navigate and explore
fs.changeDirectory('experience');
const files = fs.listDirectory();
console.log(files.data); // List of experience JSON files

// Read a file
const about = fs.readFile('/about.txt');
console.log(about.data); // About section content
```

## Custom Portfolio Data

```typescript
import { VirtualFileSystem, PortfolioDataMapper, FileSystemBuilder } from './lib/terminal';
import type { PortfolioData } from './lib/terminal';

// Create custom portfolio data
const customData: PortfolioData = {
  about: {
    name: 'Your Name',
    role: 'Your Role',
    bio: 'Your bio...',
    highlights: ['Highlight 1', 'Highlight 2'],
    stats: [
      { label: 'Projects', value: '10+' },
      { label: 'Years', value: '5+' }
    ]
  },
  // ... other sections
};

// Build file system with custom data
const fs = VirtualFileSystem.withPortfolioData(customData);
```

## File System Structure

The generated file system has the following structure:

```
/
├── README.md              # Welcome and navigation guide
├── about.txt              # About section (formatted text)
├── experience/            # Work experience directory
│   ├── neuraltalk-ai.json
│   ├── neo.json
│   ├── monster-api.json
│   └── amazon.json
├── projects/              # Projects directory
│   ├── neuraltalk-ai-platform.md
│   ├── monster-api-integration.md
│   └── neo-autonomous-ml-platform.md
├── skills/                # Skills directory
│   ├── languages.txt
│   ├── frameworks.txt
│   ├── tools.txt
│   ├── databases.txt
│   └── overview.txt
├── contact/               # Contact information
│   ├── email.txt
│   ├── social.txt
│   └── info.txt
└── .secrets/              # Easter eggs
    ├── easter-eggs.txt
    ├── quotes.txt
    └── fun-facts.txt
```

## Formatting Functions

The PortfolioDataMapper provides several formatting functions:

```typescript
import { PortfolioDataMapper } from './lib/terminal';

// Get default portfolio data
const data = PortfolioDataMapper.getPortfolioData();

// Format about section as text
const aboutText = PortfolioDataMapper.formatAboutText(data.about);

// Format experience as JSON
const expJson = PortfolioDataMapper.formatExperienceJSON(data.experience[0]);

// Format project as Markdown
const projectMd = PortfolioDataMapper.formatProjectMarkdown(data.projects[0]);

// Format skills as text
const skillsText = PortfolioDataMapper.formatSkillsText(data.skills);

// Format contact as text
const contactText = PortfolioDataMapper.formatContactText(data.contact);

// Create README content
const readme = PortfolioDataMapper.createReadme();

// Create easter eggs
const secrets = PortfolioDataMapper.createEasterEggs();
```

## Integration with Terminal Component

```typescript
import { VirtualFileSystem } from './lib/terminal';

function TerminalView() {
  const [fs] = useState(() => VirtualFileSystem.withPortfolioData());
  
  // Use fs for command execution
  const handleCommand = (command: string) => {
    if (command === 'ls') {
      const result = fs.listDirectory();
      // Display result
    } else if (command.startsWith('cd ')) {
      const path = command.substring(3);
      const result = fs.changeDirectory(path);
      // Handle result
    } else if (command.startsWith('cat ')) {
      const file = command.substring(4);
      const result = fs.readFile(file);
      // Display file content
    }
  };
  
  return <div>{/* Terminal UI */}</div>;
}
```

## Testing

The implementation includes comprehensive tests:

```bash
npm test -- FileSystemBuilder.test.ts
npm test -- VirtualFileSystem.test.ts
```

All tests verify:
- File system structure creation
- Directory navigation
- File reading
- Content integrity
- Portfolio data mapping
