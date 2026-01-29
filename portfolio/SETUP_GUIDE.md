# Portfolio Setup Guide

Complete step-by-step guide to customize this portfolio template for your own use.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Detailed Setup](#detailed-setup)
3. [Data Customization](#data-customization)
4. [Email Configuration](#email-configuration)
5. [Asset Management](#asset-management)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

## 🚀 Quick Start

```bash
# 1. Navigate to portfolio directory
cd portfolio

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env

# 4. Start development server
npm run dev
```

Visit `http://localhost:5173` to see your portfolio.

## 📝 Detailed Setup

### Step 1: Install Dependencies

```bash
cd portfolio
npm install
```

This installs all required packages including React, TypeScript, Tailwind CSS, and testing libraries.

### Step 2: Environment Configuration

Create a `.env` file in the portfolio directory:

```bash
cp .env.example .env
```

Edit `.env` and add your EmailJS credentials (see [Email Configuration](#email-configuration) section).

### Step 3: Verify Installation

```bash
# Run development server
npm run dev

# In another terminal, run tests
npm test
```

If both commands succeed, your setup is complete!

## 🎨 Data Customization

All portfolio data is centralized in `src/data/portfolioData.ts`. This is the **ONLY** file you need to edit for content changes.

### Personal Information

```typescript
export const personalInfo = {
  name: 'Your Full Name',
  role: 'Your Job Title',
  title: 'Your Professional Title | Specialization',
  bio: 'Your professional bio (2-3 sentences)',
  tagline: 'Your availability status',
  profileImage: '/src/assets/images/your_photo.png',
};
```

**Example:**
```typescript
export const personalInfo = {
  name: 'Jane Smith',
  role: 'Full Stack Developer',
  title: 'Full Stack Developer | React & Node.js Specialist',
  bio: "I'm a Full Stack Developer with 3+ years of experience building web applications. I specialize in React, Node.js, and cloud infrastructure.",
  tagline: 'Open to New Opportunities',
  profileImage: '/src/assets/images/jane_smith.png',
};
```

### Contact Information

```typescript
export const contactInfo = {
  email: 'your.email@example.com',
  phone: '+1 234-567-8900',
  website: 'yourwebsite.com',
  location: 'City, State, Country',
  github: 'https://github.com/yourusername',
  linkedin: 'https://linkedin.com/in/yourusername',
  twitter: 'https://twitter.com/yourusername',
  youtube: 'https://youtube.com/@yourchannel',
  resume: '/src/assets/resume/Your_Name_Resume.pdf',
};
```

### Work Experience

```typescript
export const workExperience = [
  {
    company: 'Company Name',
    role: 'Your Role',
    period: 'Start Date - End Date',
    achievements: [
      'Achievement 1 with metrics',
      'Achievement 2 with impact',
      'Achievement 3 with results',
    ],
    link: 'https://company-website.com',
  },
  // Add more experiences...
];
```

**Tips for Writing Achievements:**
- Start with action verbs (Built, Led, Improved, Reduced)
- Include metrics and numbers (50% faster, 100+ users, $1M revenue)
- Focus on impact and results
- Keep each point to 1-2 lines

**Example:**
```typescript
{
  company: 'TechCorp',
  role: 'Senior Frontend Developer',
  period: 'Jan 2022 - Present',
  achievements: [
    'Led team of 4 developers building React-based dashboard serving 10K+ users',
    'Improved page load time by 60% through code splitting and lazy loading',
    'Reduced bug reports by 40% by implementing comprehensive test coverage',
  ],
  link: 'https://techcorp.com',
}
```

### Projects

```typescript
export const projects = [
  {
    title: 'Project Name',
    description: 'Brief description of the project (2-3 sentences)',
    tech: ['React', 'Node.js', 'MongoDB', 'AWS'],
    metrics: [
      { label: 'Users', value: '10K+' },
      { label: 'Performance', value: '99.9%' },
    ],
    links: [
      { label: 'Website', url: 'https://project.com', type: 'website' },
      { label: 'GitHub', url: 'https://github.com/user/repo', type: 'github' },
    ],
  },
  // Add more projects...
];
```

**Link Types:**
- `website` - Project website
- `github` - GitHub repository
- `npm` - NPM package
- `demo` - Live demo

### Technical Skills

```typescript
export const detailedSkills = [
  {
    name: 'JavaScript',
    category: 'Languages',
    yearsOfExperience: 5,
    frameworks: ['React', 'Node.js', 'Vue.js'],
    tools: ['Webpack', 'Babel', 'ESLint'],
  },
  // Add more skills...
];
```

**Skill Categories:**
- `Languages` - Programming languages
- `Frontend` - Frontend frameworks and libraries
- `Backend` - Backend frameworks and tools
- `AI/ML` - AI/ML frameworks and tools
- `Databases` - Database systems
- `Cloud/DevOps` - Cloud platforms and DevOps tools

### Career Highlights

```typescript
export const careerHighlights = [
  'Highlight 1 with impact',
  'Highlight 2 with achievement',
  'Highlight 3 with recognition',
  'Highlight 4 with contribution',
];
```

### Key Statistics

```typescript
export const keyStats = [
  { label: 'Years Experience', value: '5+' },
  { label: 'Projects Completed', value: '50+' },
  { label: 'Happy Clients', value: '100+' },
  { label: 'Code Commits', value: '10K+' },
];
```

## 📧 Email Configuration

The contact form uses EmailJS to send emails. Follow these steps:

### Step 1: Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account (200 emails/month)
3. Verify your email address

### Step 2: Add Email Service

1. Go to **Email Services** in dashboard
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the connection instructions
5. Note your **Service ID**

### Step 3: Create Notification Template

This template sends inquiries to YOU.

1. Go to **Email Templates**
2. Click **Create New Template**
3. Name it "Portfolio Notification"
4. Set **To Email**: `your.email@example.com`
5. Set **Reply To**: `{{reply_to}}`
6. Add these template variables:
   - `{{from_name}}` - Sender's name
   - `{{from_email}}` - Sender's email
   - `{{company}}` - Sender's company
   - `{{role}}` - Sender's role
   - `{{message}}` - Message content
   - `{{interested_items}}` - Items they're interested in
   - `{{order_date}}` - Submission date
   - `{{item_count}}` - Number of items
7. Note your **Template ID**

**Example Template:**
```
Subject: New Portfolio Inquiry from {{from_name}}

You have a new inquiry from your portfolio!

From: {{from_name}} ({{from_email}})
Company: {{company}}
Role: {{role}}

Message:
{{message}}

Interested In:
{{interested_items}}

Submitted: {{order_date}}
Items: {{item_count}}
```

### Step 4: Create Auto-Reply Template

This template confirms receipt to the SENDER.

1. Create another template named "Portfolio Auto-Reply"
2. Set **To Email**: `{{to_email}}`
3. Set **From Name**: `Your Name`
4. Set **Reply To**: `your.email@example.com`
5. Add these template variables:
   - `{{to_name}}` - Recipient's name
   - `{{to_email}}` - Recipient's email
   - `{{from_name}}` - Your name
   - `{{reply_to}}` - Your email
6. Note your **Template ID**

**Example Template:**
```
Subject: Thanks for reaching out!

Hi {{to_name}},

Thank you for your interest in my work! I've received your message and will get back to you within 24-48 hours.

In the meantime, feel free to:
- Check out my GitHub: github.com/yourusername
- Connect on LinkedIn: linkedin.com/in/yourusername
- Watch my tutorials: youtube.com/@yourchannel

Best regards,
{{from_name}}
```

### Step 5: Get Public Key

1. Go to **Account** → **General**
2. Find your **Public Key**
3. Copy it

### Step 6: Update .env File

```env
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_NOTIFICATION_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_AUTO_REPLY_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxx
```

### Step 7: Test Email

```bash
# Restart development server
npm run dev

# Go to Amazon theme
# Click "Add to Cart" on any skill/project
# Click cart icon → "Proceed to Checkout"
# Fill out the form and submit
# Check your email!
```

## 🖼️ Asset Management

### Profile Photo

1. Add your photo to `src/assets/images/`
2. Recommended: Square image, 500x500px minimum
3. Format: PNG or WebP for best quality
4. Update path in `portfolioData.ts`:

```typescript
export const personalInfo = {
  // ...
  profileImage: '/src/assets/images/your_name.png',
};
```

### Company Logos

Add company logos for work experience:

1. Save logos to `src/assets/images/`
2. Recommended: 200x200px, transparent background
3. Format: PNG or WebP
4. Update in `src/amazon/lib/AmazonPortfolioDataMapper.ts`:

```typescript
const companyLogos: Record<string, string> = {
  'your-company': '/src/assets/images/your_company.webp',
  // Add more...
};
```

### Resume PDF

1. Save your resume as PDF
2. Place in `src/assets/resume/`
3. Update path in `portfolioData.ts`:

```typescript
export const contactInfo = {
  // ...
  resume: '/src/assets/resume/Your_Name_Resume.pdf',
};
```

### Favicon

Replace favicon files in `public/favicon_io/`:
- `favicon.ico` - 48x48px
- `favicon-16x16.png` - 16x16px
- `favicon-32x32.png` - 32x32px
- `apple-touch-icon.png` - 180x180px
- `android-chrome-192x192.png` - 192x192px
- `android-chrome-512x512.png` - 512x512px

Use [Favicon Generator](https://favicon.io/) to create all sizes from one image.

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with UI

```bash
npm run test:ui
```

### Test Coverage

Tests are included for:
- Component rendering
- User interactions
- Form validation
- Search functionality
- Cart operations
- Terminal commands

## 🚀 Deployment

### Option 1: Vercel (Recommended)

**Via CLI:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Via GitHub:**
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Add environment variables
6. Deploy!

### Option 2: Netlify

**Via CLI:**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod
```

**Via Drag & Drop:**
1. Build: `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag `dist/` folder to deploy

### Option 3: GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to `package.json`:
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

3. Deploy:
```bash
npm run deploy
```

### Environment Variables

Remember to add environment variables in your hosting platform:
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_NOTIFICATION_TEMPLATE_ID`
- `VITE_EMAILJS_AUTO_REPLY_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5173
npx kill-port 5173

# Or use different port
npm run dev -- --port 3000
```

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Email Not Sending

1. Check `.env` file has correct credentials
2. Verify EmailJS service is active
3. Check template IDs match
4. Ensure you haven't exceeded free tier (200/month)
5. Check browser console for errors

### Images Not Loading

1. Verify image paths start with `/src/assets/`
2. Check file extensions match (case-sensitive)
3. Ensure images exist in `src/assets/images/`
4. Try clearing browser cache

### Tests Failing

```bash
# Update snapshots
npm test -- -u

# Run specific test file
npm test -- ComponentName.test.tsx
```

### TypeScript Errors

```bash
# Check for type errors
npx tsc --noEmit

# Update TypeScript
npm install typescript@latest
```

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [EmailJS Documentation](https://www.emailjs.com/docs/)

## 🎯 Next Steps

1. ✅ Complete all data customization
2. ✅ Add your resume and images
3. ✅ Configure EmailJS
4. ✅ Test locally
5. ✅ Run all tests
6. ✅ Build for production
7. ✅ Deploy to hosting platform
8. ✅ Test live site
9. ✅ Share with the world!

## 💡 Tips

- **Start Simple**: Customize data first, then worry about styling
- **Test Often**: Run `npm test` after major changes
- **Use Git**: Commit changes frequently
- **Mobile First**: Always test on mobile devices
- **Performance**: Keep images under 500KB
- **SEO**: Update meta tags in `index.html`

---

Need help? Check the main README.md or open an issue on GitHub.

Good luck with your portfolio! 🎉
