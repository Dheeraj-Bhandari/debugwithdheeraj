# 🚀 Dynamic Portfolio Template

A modern, fully customizable portfolio website with multiple themes. Built for developers who want a professional portfolio without writing code - just add your data and deploy!

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)

## ✨ Features

- 🎨 **3 Unique Themes**: Amazon-inspired, Terminal CLI, and Modern GUI
- 📱 **Fully Responsive**: Works on mobile, tablet, and desktop
- ⚡ **Zero Hardcoding**: All data comes from a single file
- � *m*SEO Optimized**: Meta tags and social media cards
- ♿ **Accessible**: WCAG 2.1 AA compliant
- 📧 **Contact Form**: Integrated EmailJS support
- � C**Easy Customization**: Edit one file, update entire portfolio

## 🎯 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/portfolio-template.git
cd portfolio-template/portfolio
npm install
```

### 2. Add Your Data

Edit **one file**: `src/data/portfolioData.ts`

```typescript
export const personalInfo = {
  name: 'Your Name',
  role: 'Your Role',
  title: 'Your Professional Title',
  bio: 'Your bio...',
  profileImage: yourProfileImg,
};

export const contactInfo = {
  email: 'your.email@example.com',
  github: 'https://github.com/yourusername',
  linkedin: 'https://linkedin.com/in/yourusername',
  // ... more fields
};

// Update work experience, projects, skills, etc.
```

### 3. Add Your Assets

```bash
# Add your profile photo
src/assets/images/your_photo.png

# Add your resume
src/assets/resume/Your_Resume.pdf
```

Update imports in `portfolioData.ts`:
```typescript
import yourProfileImg from '../assets/images/your_photo.png';
import resumePdf from '../assets/resume/Your_Resume.pdf';
```

### 4. Configure Email (Optional)

Create `.env` file:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_NOTIFICATION_TEMPLATE_ID=your_template_id
VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID=your_autoreply_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

**EmailJS Setup:**
1. Create free account at [emailjs.com](https://www.emailjs.com/)
2. Add email service (Gmail/Outlook)
3. Create 2 templates:
   - **Notification**: Sends inquiries to you
   - **Auto-reply**: Confirms receipt to sender
4. Copy IDs to `.env`

See `.env.example` for reference.

### 5. Run & Deploy

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Deploy `dist/` folder to Vercel, Netlify, or any static host.

## 📁 Project Structure

```
portfolio/
├── src/
│   ├── data/
│   │   └── portfolioData.ts    ⭐ Edit this file with your data
│   ├── assets/
│   │   ├── images/             📸 Add your photos here
│   │   └── resume/             📄 Add your resume here
│   ├── components/             🎨 Pre-built components
│   └── pages/                  📄 Theme pages
├── .env                        🔐 Create this (see .env.example)
└── package.json
```

## 🎨 Available Themes

### 1. Amazon Theme (`/amazon`)
E-commerce inspired portfolio with shopping cart metaphor

### 2. Terminal Theme (Toggle in GUI)
Developer-focused CLI experience with virtual file system

### 3. Modern GUI (`/`)
Clean, professional portfolio with smooth animations

## 📚 Documentation

- **[Customization Guide](CUSTOMIZATION_GUIDE.md)** - Detailed customization instructions
- **[Adding New Routes](ADDING_NEW_ROUTES.md)** - Create themed routes like `/microsoft`
- **[Data Architecture](DATA_ARCHITECTURE.md)** - Understand data flow
- **[Setup Guide](SETUP_GUIDE.md)** - Initial setup instructions
- **[Launch Checklist](LAUNCH_CHECKLIST.md)** - Pre-deployment checklist

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Adding New Themes

Want to add a `/microsoft`, `/google`, or custom theme?

1. **Create theme components** in `src/components/yourtheme/`
2. **Add route** in `src/App.tsx`
3. **Use centralized data** from `portfolioData.ts`
4. **Submit PR** with documentation

**Important**: All data must be dynamically passed from `portfolioData.ts` - no hardcoded text in components!

### Contribution Guidelines

✅ **DO:**
- Import data from `src/data/portfolioData.ts`
- Make components reusable and configurable
- Add TypeScript types for new data structures
- Update documentation for new features
- Test on mobile, tablet, and desktop
- Follow existing code style

❌ **DON'T:**
- Hardcode personal data in components
- Break existing themes
- Add unnecessary dependencies
- Skip documentation

### Example: Adding a New Theme

```typescript
// 1. Create component that uses centralized data
import { personalInfo, projects } from '../data/portfolioData';

const MicrosoftTheme = () => {
  return (
    <div>
      <h1>{personalInfo.name}</h1>
      {projects.map(project => (
        <ProjectCard key={project.title} {...project} />
      ))}
    </div>
  );
};

// 2. Add route in App.tsx
<Route path="/microsoft" element={<MicrosoftTheme />} />
```

See [ADDING_NEW_ROUTES.md](ADDING_NEW_ROUTES.md) for detailed guide.

## 🐛 Issues & Support

- **Bug Reports**: [Open an issue](https://github.com/yourusername/portfolio-template/issues)
- **Feature Requests**: [Start a discussion](https://github.com/yourusername/portfolio-template/discussions)
- **Questions**: Check [documentation](CUSTOMIZATION_GUIDE.md) first

## 🛠️ Tech Stack

- **React 18** + **TypeScript** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **EmailJS** - Contact form
- **Vitest** - Testing

## 📊 Performance

- Lighthouse Score: 95+ (all categories)
- First Contentful Paint: <1.5s
- Fully responsive and accessible

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🌟 Show Your Support

If this template helped you, please:
- ⭐ Star this repository
- 🐛 Report bugs
- 💡 Suggest features
- 🤝 Contribute improvements
- 📢 Share with others

## 🚀 Roadmap

- [ ] More theme options (Microsoft, Google, etc.)
- [ ] Dark/light mode toggle
- [ ] Blog integration
- [ ] Multi-language support
- [ ] CMS integration
- [ ] More animation presets

## 📧 Contact

Questions? Reach out via [GitHub Issues](https://github.com/yourusername/portfolio-template/issues).

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**

Made by developers, for developers. 🚀
