# Modern Portfolio Website Template

A professional, feature-rich portfolio website template built with modern web technologies. Perfect for developers, engineers, and tech professionals looking to showcase their work.

## 🌟 Features

### Two Unique Themes
- **Amazon-Inspired Theme**: E-commerce style portfolio with shopping cart metaphor
- **Terminal Theme**: Developer-focused command-line interface experience

### Core Capabilities
- ✨ Modern, responsive design (mobile, tablet, desktop)
- ⚡ Lightning-fast performance with Vite
- 🎨 Smooth animations with Framer Motion
- 🎯 SEO optimized with meta tags
- ♿ WCAG 2.1 AA accessibility compliant
- 📧 Contact form with EmailJS integration
- 🔍 Real-time search functionality
- 🛒 Interactive cart system (Amazon theme)
- 💻 Virtual file system (Terminal theme)

## 🚀 Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Testing**: Vitest + React Testing Library
- **Email**: EmailJS
- **Icons**: React Icons

## 📋 Prerequisites

- Node.js 20.19+ or 22.12+
- npm or yarn
- EmailJS account (for contact form)

## 🛠️ Installation & Setup

### 1. Clone and Install

```bash
# Navigate to the portfolio directory
cd portfolio

# Install dependencies
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the portfolio directory:

```env
# EmailJS Configuration (Required for contact form)
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_NOTIFICATION_TEMPLATE_ID=your_notification_template_id
VITE_EMAILJS_AUTO_REPLY_TEMPLATE_ID=your_auto_reply_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

See `.env.example` for reference.

### 3. Customize Your Data

Edit `src/data/portfolioData.ts` to add your information:

```typescript
export const personalInfo = {
  name: 'Your Name',
  role: 'Your Role',
  title: 'Your Professional Title',
  bio: 'Your bio...',
  // ... more fields
};

export const contactInfo = {
  email: 'your.email@example.com',
  phone: '+1 234-567-8900',
  // ... more fields
};

// Update work experience, projects, skills, etc.
```

### 4. Add Your Resume

Replace the resume file:
```bash
# Add your resume PDF
cp /path/to/your/resume.pdf src/assets/resume/Your_Name_Resume.pdf
```

Update the path in `portfolioData.ts`:
```typescript
export const contactInfo = {
  // ...
  resume: '/src/assets/resume/Your_Name_Resume.pdf',
};
```

### 5. Update Images

Replace profile and project images in `src/assets/images/`:
- `your_name.png` - Your profile photo
- Add company logos for work experience
- Add project screenshots

Update image references in `portfolioData.ts` and component files.

## 🎨 Customization Guide

### Personal Information

All personal data is centralized in `src/data/portfolioData.ts`. Update these sections:

1. **Personal Info**: Name, role, title, bio
2. **Contact Info**: Email, phone, social links
3. **Work Experience**: Companies, roles, achievements
4. **Projects**: Project details, tech stack, metrics
5. **Skills**: Technical skills by category
6. **Stats**: Career highlights and key metrics

### Theme Colors

Edit `tailwind.config.js` to customize colors:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'amazon-orange': '#FF9900',  // Amazon theme accent
        'amazon-dark': '#131921',    // Amazon theme dark
        // Add your custom colors
      },
    },
  },
};
```

### Email Configuration

1. Create an [EmailJS](https://www.emailjs.com/) account
2. Set up an email service (Gmail, Outlook, etc.)
3. Create two templates:
   - **Notification Template**: Sends inquiries to you
   - **Auto-Reply Template**: Confirms receipt to sender
4. Add credentials to `.env` file

See `src/amazon/lib/emailService.ts` for detailed template setup instructions.

## 🏃 Development

```bash
# Start development server
npm run dev

# Open browser at http://localhost:5173
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

## 📦 Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

The optimized build will be in the `dist/` folder.

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Netlify

```bash
# Build the project
npm run build

# Deploy via Netlify CLI or drag-and-drop dist/ folder
```

### Other Platforms

The `dist/` folder can be deployed to:
- AWS S3 + CloudFront
- GitHub Pages
- Firebase Hosting
- Cloudflare Pages
- Any static hosting service

## 📁 Project Structure

```
portfolio/
├── src/
│   ├── components/          # React components
│   │   ├── amazon/         # Amazon theme components
│   │   └── Terminal/       # Terminal theme components
│   ├── pages/              # Page components
│   ├── data/               # Portfolio data
│   │   └── portfolioData.ts # ⭐ Main data file to customize
│   ├── lib/                # Utility libraries
│   │   └── terminal/       # Terminal file system logic
│   ├── amazon/             # Amazon theme logic
│   │   ├── contexts/       # React contexts
│   │   ├── lib/            # Utilities and mappers
│   │   └── types/          # TypeScript types
│   ├── assets/             # Static assets
│   │   ├── images/         # Images and logos
│   │   └── resume/         # Resume PDF
│   └── App.tsx             # Main app component
├── public/                 # Public static files
├── .env                    # Environment variables (create this)
├── .env.example            # Environment variables template
└── package.json            # Dependencies and scripts
```

## 🎯 Key Files to Customize

1. **`src/data/portfolioData.ts`** - All your personal data
2. **`.env`** - EmailJS configuration
3. **`src/assets/resume/`** - Your resume PDF
4. **`src/assets/images/`** - Your photos and project images
5. **`tailwind.config.js`** - Theme colors (optional)
6. **`index.html`** - Meta tags and SEO

## 🔧 Advanced Customization

### Adding New Sections

1. Create a new component in `src/components/`
2. Import and add to `src/App.tsx` or page components
3. Update `portfolioData.ts` with new data

### Modifying Themes

- **Amazon Theme**: Edit files in `src/components/amazon/`
- **Terminal Theme**: Edit files in `src/components/Terminal/`

### Adding New Routes

1. Add route in `src/App.tsx`
2. Create page component in `src/pages/`
3. Update navigation components

## 📊 Performance

Target metrics:
- Lighthouse Score: 95+ (all categories)
- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2.5s
- Time to Interactive: <3.5s

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 License

This template is open source and available for personal and commercial use.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📧 Support

For questions or issues:
- Open an issue on GitHub
- Check existing documentation
- Review component code for examples

## 🙏 Acknowledgments

Built with modern web technologies:
- React Team for React
- Evan You for Vite
- Tailwind Labs for Tailwind CSS
- Framer for Framer Motion

---

**Made with TypeScript, React, and Tailwind CSS**

⭐ Star this repo if you find it helpful!
