# Contributing to Portfolio Template

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

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

## 💻 Code Style

- Use TypeScript for type safety
- Follow existing code formatting
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

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

### High Priority
- Performance optimizations
- Accessibility improvements
- Mobile responsiveness fixes
- Test coverage expansion
- Documentation improvements

### Medium Priority
- New theme variations
- Additional components
- Animation enhancements
- SEO improvements

### Low Priority
- Code refactoring
- Style tweaks
- Minor bug fixes

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
