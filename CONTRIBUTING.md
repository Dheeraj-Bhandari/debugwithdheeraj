# Contributing to Dynamic Portfolio Template

Thank you for your interest in contributing! We welcome contributions that help make this portfolio template better for everyone.

## 🎯 Core Principle

**All data must be dynamic!** Components should never have hardcoded personal data. Everything must come from `src/data/portfolioData.ts`.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, browser, Node version)

### Suggesting Features

Feature requests are welcome! Please:
- Check if the feature already exists
- Explain the use case
- Describe the expected behavior
- Consider implementation complexity

### Submitting Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Write/update tests**
5. **Run tests**
   ```bash
   npm test
   ```
6. **Commit with clear messages**
   ```bash
   git commit -m "feat: add new feature"
   ```
7. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Open a Pull Request**

## 📝 Commit Message Guidelines

Follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

**Examples:**
```
feat: add dark mode toggle
fix: resolve mobile menu overflow issue
docs: update setup guide with new steps
test: add tests for contact form validation
```

## 🧪 Testing Requirements

- All new features must include tests
- Maintain or improve test coverage
- Run `npm test` before submitting PR
- Ensure all tests pass

## 💻 Code Style & Requirements

### Critical Rules

✅ **DO:**
- Import all data from `src/data/portfolioData.ts`
- Use TypeScript for type safety
- Make components reusable and configurable
- Add proper TypeScript types for new data structures
- Test on mobile, tablet, and desktop
- Update documentation for new features
- Follow existing code patterns

❌ **DON'T:**
- Hardcode personal data (names, emails, etc.) in components
- Break existing themes or functionality
- Add unnecessary dependencies
- Skip documentation updates
- Commit `.env` files with credentials

### Example: Correct vs Incorrect

**❌ WRONG - Hardcoded data:**
```typescript
const Hero = () => {
  return <h1>John Doe</h1>; // Hardcoded name
};
```

**✅ CORRECT - Dynamic data:**
```typescript
import { personalInfo } from '../data/portfolioData';

const Hero = () => {
  return <h1>{personalInfo.name}</h1>; // Dynamic from data file
};
```

### Code Formatting
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused
- Follow existing component structure

## 📁 Project Structure

```
portfolio/
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── data/           # Data files
│   ├── lib/            # Utility libraries
│   ├── amazon/         # Amazon theme
│   └── assets/         # Static assets
├── public/             # Public files
└── tests/              # Test files
```

## 🎯 Areas for Contribution

### 🔥 High Priority
- **New Themes**: Add `/microsoft`, `/google`, or other company-inspired themes
- **Performance**: Optimize bundle size and load times
- **Accessibility**: Improve WCAG compliance
- **Mobile**: Fix responsiveness issues
- **Tests**: Expand test coverage
- **Documentation**: Improve guides and examples

### 🎨 Medium Priority
- **Components**: Add reusable UI components
- **Animations**: Enhance transitions and effects
- **Features**: Add blog, CMS integration, dark mode
- **SEO**: Improve meta tags and social cards

### 🔧 Low Priority
- **Refactoring**: Code cleanup and optimization
- **Styling**: Minor UI improvements
- **Bug Fixes**: Small issues and edge cases

## 🎨 Adding New Themes

Want to add a new themed route like `/microsoft` or `/google`?

### Step-by-Step Guide

1. **Create theme folder:**
   ```
   src/components/microsoft/
   ├── MicrosoftHeader.tsx
   ├── MicrosoftHero.tsx
   ├── MicrosoftProjects.tsx
   └── index.ts
   ```

2. **Import data from portfolioData.ts:**
   ```typescript
   import { personalInfo, projects, skills } from '../../data/portfolioData';
   
   const MicrosoftHero = () => {
     return (
       <div>
         <h1>{personalInfo.name}</h1>
         <p>{personalInfo.title}</p>
       </div>
     );
   };
   ```

3. **Create page component:**
   ```typescript
   // src/pages/MicrosoftPage.tsx
   import { MicrosoftHeader, MicrosoftHero } from '../components/microsoft';
   
   const MicrosoftPage = () => {
     return (
       <div>
         <MicrosoftHeader />
         <MicrosoftHero />
         {/* More components */}
       </div>
     );
   };
   ```

4. **Add route in App.tsx:**
   ```typescript
   <Route path="/microsoft" element={<MicrosoftPage />} />
   ```

5. **Update documentation:**
   - Add theme description to README.md
   - Document any new data fields in CUSTOMIZATION_GUIDE.md

See [ADDING_NEW_ROUTES.md](ADDING_NEW_ROUTES.md) for detailed guide.

## 🔍 Code Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, PR will be merged
4. Your contribution will be credited

## 📜 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## 🙏 Recognition

Contributors will be:
- Listed in the project README
- Credited in release notes
- Acknowledged in the community

## 💬 Questions?

- Open an issue for questions
- Check existing documentation
- Review closed issues for similar questions

Thank you for contributing! 🎉
