# JEE Challenger

[![License](https://img.shields.io/github/license/Samya-S/jeechallenger-app)](https://github.com/Samya-S/jeechallenger-app/blob/main/LICENSE)

A comprehensive one-stop platform for all your JEE preparation needs, featuring AI-powered tutoring, study materials, official papers, and more.

## Table of Contents

- [Features](#features)
  - [Core Features](#-core-features)
  - [User Experience](#-user-experience)
  - [Study Resources](#-study-resources)
  - [AI Tutor](#%E2%80%8D-ai-tutor)
  - [Syllabus Tracker](#-syllabus-tracker)
  - [News & Updates](#-news--updates)
  - [Blog & Articles](#-blog--articles)
  - [Platform Integrations](#-platform-integrations)
- [Technologies Used](#technologies-used)
  - [Frontend](#frontend)
  - [Backend & APIs](#backend--apis)
  - [Development & Deployment](#development--deployment)
- [Getting Started](#getting-started)
- [Building for Production](#building-for-production)
- [Project Structure](#project-structure)
- [All versions](#all-versions)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)


## Features

### 🎯 Core Features

- **AI Tutor**: Personalized JEE preparation assistance powered by NextAuth authentication and MongoDB-backed chat history
- **Syllabus Tracker**: Track your JEE preparation progress across all subjects with chapter-wise completion tracking
- **Study Materials**: Comprehensive resources for Physics, Chemistry, and Mathematics
- **Official Papers**: Direct access to JEE Main and Advanced official papers and answer keys
- **Chapter-wise PYQs**: Solved previous year questions organized by chapters
- **Blog & Articles**: Expert JEE preparation tips, strategies, and study guides with search and filtering
- **Real-time News**: Latest JEE-related news and updates powered by GNews API
- **Contact Form**: Email integration for user queries and feedback


### 🎨 User Experience

- Modern and responsive UI built with Next.js and Tailwind CSS
- Dark/Light theme support with system preference detection
- Mobile-first design approach
- Smooth animations and hover effects
- SEO optimized with automatic sitemap generation


### 📚 Study Resources

- **Physics Resources**: Complete study materials and reference books
- **Chemistry Resources**: Comprehensive chemistry study guides
- **Mathematics Resources**: Extensive math preparation materials
- **Additional Platforms**: Integration with Unacademy, Physics Wallah, and Apni Kaksha


### 👨‍🏫 AI Tutor

- Authentication via NextAuth.js (Google OAuth)
- File upload and attachment support
- Markdown and LaTeX rendering for mathematical expressions
- Chat history persistence backed by MongoDB
- Real-time message streaming
- Privacy Policy and Terms of Service


### 📊 Syllabus Tracker

- Progress tracking for Physics, Chemistry, and Mathematics
- Chapter-wise completion tracking for Theory, PYQs, and Revision
- Visual progress indicators and statistics
- Export progress as an image with `html-to-image`
- Import/export progress data across devices
- Local storage persistence — never lose progress
- Motivation-driven progress visualization
- Subject-wise progress overview


### 📰 News & Updates

- Real-time JEE news from GNews API
- Categorized news cards
- Automatic content refresh
- Mobile-responsive news layout


### 📝 Blog & Articles

- Expert preparation tips and strategies
- Subject-wise study guides and book recommendations
- Time management and common mistakes advice
- MDX-based article system with frontmatter metadata
- Search and category filtering
- Featured article highlighting
- Reading progress tracking with table of contents
- Social sharing integration
- SEO optimized with structured data


### 🔗 Platform Integrations

- **Unacademy**: Direct links to Unacademy JEE courses
- **Physics Wallah**: Access to PW study materials
- **Apni Kaksha**: Additional study resources

## Technologies Used

### Frontend

- **Framework**: Next.js 16 with App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS with custom animations
- **Icons**: Lucide React & React Icons
- **Theme Management**: @teispace/next-themes
- **Floating UI**: @floating-ui/react for tooltips and popovers
- **Markdown Rendering**: React Markdown with remark-gfm for GitHub Flavored Markdown
- **Math Rendering**: KaTeX with rehype-katex for mathematical expressions
- **Heading Anchors**: rehype-slug for blog table of contents
- **Content Management**: gray-matter for MDX frontmatter parsing
- **Image Export**: html-to-image for exporting the Syllabus Tracker
- **Auto-resize Textarea**: react-textarea-autosize for the AI Tutor chat input


### Backend & APIs

- **Authentication**: NextAuth.js v4 with Google OAuth provider
- **Database**: MongoDB with @auth/mongodb-adapter for session and user storage
- **Caching / Rate Limiting**: Upstash Redis
- **Token Handling**: jsonwebtoken (JWT)
- **Email Service**: Nodemailer for contact form
- **News API**: GNews API for real-time updates
- **API Routes**: Next.js API routes


### Development & Deployment

- **Build Tool**: Turbopack for faster development
- **SEO**: next-sitemap for automatic sitemap generation
- **Analytics**: @next/third-parties for Google Analytics integration
- **Ad Integration**: Google AdSense support
- **Performance**: Image optimization, caching headers, and production webpack chunk splitting
- **Deployment**: Vercel


## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/Samya-S/jeechallenger-app.git
cd jeechallenger-app
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your environment variables:

```env
# Email Configuration (for Contact form)
AUTH_EMAIL=your-email@example.com
AUTH_PASS=your-email-app-password
SENDER_EMAIL=your-email@example.com
RECEIVER_EMAIL=recipient@example.com

# GNews API Configuration
GNEWS_API_KEY=your-gnews-api-key

# Google OAuth Configuration (for NextAuth)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# MongoDB Configuration (for auth adapter and chat history)
MONGODB_URI=your-mongodb-connection-string

# Upstash Redis Configuration (for rate limiting / caching)
UPSTASH_REDIS_REST_URL=your-upstash-redis-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token

# JWT Configuration
JWT_SECRET=your-jwt-secret

# AI Tutor Backend (for production)
# The app uses API rewrites to connect to the AI tutor backend
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.


## Building for Production

```bash
npm run build
npm start
```


## Project Structure

```
jeechallenger-app/
├── app/                        # Next.js App Router pages
│   ├── ai-tutor/               # AI Tutor functionality
│   │   ├── privacy/            # AI Tutor Privacy Policy
│   │   └── terms/              # AI Tutor Terms of Service
│   ├── syllabus-tracker/       # Progress tracking system
│   ├── blog/                   # Blog post display with dynamic routes
│   │   ├── [slug]/             # Dynamic blog post pages
│   │   ├── components/         # Blog UI components (TOC, Share, etc.)
│   │   └── hooks/              # Blog custom hooks
│   ├── blogs/                  # Blog listing page with search/filter
│   ├── materials/              # Study materials
│   │   ├── physics/            # Physics resources
│   │   ├── chemistry/          # Chemistry resources
│   │   ├── mathematics/        # Mathematics resources
│   │   └── chapterwise-solved-pyqs/  # PYQs by chapter
│   ├── more-platforms/         # External platform links
│   ├── news/                   # Latest JEE news section
│   ├── official-links/         # JEE official papers
│   └── contact-us/             # Contact form
├── components/                 # Reusable React components
│   ├── AiTutorComponents/      # AI Tutor specific components
│   ├── common/                 # Shared components
│   ├── home/                   # Home page components
│   └── utils/                  # Utility components
├── data/                       # Content data
│   └── blog/                   # Blog articles
│       └── articles/           # MDX article files
├── docs/                       # Documentation
│   ├── blog-structure.md       # Blog system documentation
│   └── color-system.md         # Design system colors
├── lib/                        # Utility functions and configs
├── server/                     # Server actions
└── public/                     # Static assets
```


## All versions

### jeechallenger v2.0

Upgraded the vanilla JavaScript project to a modern `Next.js` application with many more features.

> [!NOTE]
> This is a major update and is managed in this repository.

### jeechallenger v1.2

This is version 1.2, made using `HTML`, `CSS` and vanilla `JavaScript`. The code is available at [Samya-S/jeechallenger-v1.2](https://github.com/Samya-S/jeechallenger-v1.2) (archived).

### jeechallenger v1.1

This version includes `PHP`. The code is available at [Samya-S/jeechallenger-v1.1](https://github.com/Samya-S/jeechallenger-v1.1) (archived).

### jeechallenger v1.0

This version is made using `HTML`, `CSS` and vanilla `JavaScript`. The code is available at [Samya-S/jeechallenger-v1.0](https://github.com/Samya-S/jeechallenger-v1.0) (archived).


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines

- Follow the existing code structure and naming conventions
- Ensure responsive design for all new components
- Add proper TypeScript types if applicable
- Test on both light and dark themes
- Update documentation for new features


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

Join our community:

- 💬 **Telegram**: [t.me/jeechallenger](https://t.me/jeechallenger)
- 📸 **Instagram**: [@jeechallenger](https://www.instagram.com/jeechallenger)
- 🎥 **YouTube**: [@jeechallenger](https://www.youtube.com/@jeechallenger)

If you find this project helpful and would like to support its development, consider becoming a sponsor. Your support helps maintain and improve the project.

[![Sponsor](https://img.shields.io/badge/Sponsor-30363D?style=for-the-badge&logo=GitHub-Sponsors&logoColor=#EA4AAA)](https://github.com/sponsors/Samya-S)