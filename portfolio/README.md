# Dheeraj Kumar - Portfolio Website

A modern, minimalist portfolio website built with React, Vite, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- ✨ Modern and minimalist design
- 🎨 Smooth animations with Framer Motion
- 📱 Fully responsive (mobile, tablet, desktop)
- ⚡ Lightning-fast performance with Vite
- 🎯 SEO optimized
- ♿ Accessible (WCAG 2.1 AA compliant)
- 🎭 Professional color scheme

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: React Icons

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm or yarn

### Installation

1. Navigate to the portfolio directory:
```bash
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit: `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist` folder.

## Preview Production Build

```bash
npm run preview
```

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### Netlify

1. Build the project:
```bash
npm run build
```

2. Drag and drop the `dist` folder to Netlify

### Other Platforms

The `dist` folder can be deployed to any static hosting service:
- AWS S3 + CloudFront
- GitHub Pages
- Firebase Hosting
- Cloudflare Pages

## Customization

### Update Personal Information

Edit the content in the following files:
- `src/components/Hero.tsx` - Name, title, tagline
- `src/components/About.tsx` - About section content
- `src/components/Experience.tsx` - Work experience
- `src/components/Projects.tsx` - Featured projects
- `src/components/Contact.tsx` - Contact information

### Update Colors

Edit `tailwind.config.js`:
```js
colors: {
  primary: '#1a1f36',  // Main dark color
  accent: '#3b82f6',   // Accent color
  background: '#fafafa', // Background color
}
```

### Add Resume PDF

Place your resume PDF in the `public` folder as `resume.pdf`

## Performance

- Lighthouse Score: 95+ (all metrics)
- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2.5s
- Time to Interactive: <3.5s

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

© 2025 Dheeraj Kumar. All rights reserved.

## Contact

- Email: digitaldk.in@gmail.com
- LinkedIn: [linkedin.com/in/digitaldk](https://linkedin.com/in/digitaldk)
- GitHub: [github.com/Dheeraj-Bhandari](https://github.com/Dheeraj-Bhandari)
- YouTube: [@debugwithdheeraj](https://youtube.com/@debugwithdheeraj)
