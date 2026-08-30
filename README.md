# JEE Challenger

[![License](https://img.shields.io/github/license/Samya-S/jeechallenger-app)](https://github.com/Samya-S/jeechallenger-app/blob/main/LICENSE)

A comprehensive one-stop platform for all your JEE preparation needs, featuring AI-powered tutoring, study materials, official papers, previous year questions, and more.

## Table of Contents

- [Features](#features)
  - [Core Features](#-core-features)
  - [User Experience](#-user-experience)
  - [Study Resources](#-study-resources)
  - [Previous Year Questions](#-previous-year-questions)
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

- **Previous Year Questions (PYQs)**: Interactive practice hub with multi-parameter filtering, instant answer evaluation, dedicated question pages (`/questions/:slug`) with step-by-step KaTeX derivations, and full shift paper explorers (`/papers/:slug`) with section navigation.
- **AI Tutor**: Personalized JEE preparation assistance powered by NextAuth authentication and MongoDB-backed chat history.
- **Syllabus Tracker**: Track your JEE preparation progress across all subjects with chapter-wise completion tracking and cloud sync.
- **Study Materials**: Comprehensive resources including interactive Formula Sheets, Universal Unit Converters, a Periodic Table Explorer, and reference books for Physics, Chemistry, and Mathematics.
- **Official Papers**: Direct access to JEE Main and Advanced official papers and answer keys.
- **Blog & Articles**: Expert JEE preparation tips, strategies, and study guides with search and category filtering.
- **Real-time News**: Latest JEE-related news and updates powered by GNews API.
- **Contact Form**: Email integration for user queries and feedback.


### 🎨 User Experience

- Modern and responsive UI built with Next.js and Tailwind CSS
- Dark/Light theme support with system preference detection
- Mobile-first design approach
- Smooth animations and crisp, instant interaction states
- SEO optimized with automatic sitemap generation and OpenGraph cards


### 📚 Study Resources

- **Interactive Formula Sheets**: Dynamic, chapter-wise formulas rendered with KaTeX for quick revision.
- **Universal Unit Converters**: High-precision, interactive tools to instantly convert complex derived units across Physics, Chemistry, and Mathematics.
- **Periodic Table Explorer**: Interactive periodic table featuring s/p/d/f block highlights (fully aligned with NCERT/JEE syllabus standards), properties trends heatmaps (electronegativity, ionization energy, atomic mass, melting point), STP state of matter filters, responsive mobile list views, and high-yield inorganic chemistry study notes.
- **Physics Resources**: Complete study materials and reference books.
- **Chemistry Resources**: Comprehensive chemistry study guides.
- **Mathematics Resources**: Extensive math preparation materials.
- **Additional Platforms**: Integration with Unacademy, Physics Wallah, and Apni Kaksha.


### 📝 Previous Year Questions

- **Chapter-Wise Practice Hub (`/previous-year-questions`)**:
  - Filter by Subject (Physics, Chemistry, Mathematics), Dynamic Chapter cascading, Exam Type (JEE Main / Advanced), Exam Year, Difficulty, and Question Format.
  - Custom, instant `CustomSelect` dropdown with embedded search filter and zero animation delay.
  - Interactive self-testing: select options (MCQ / Multi-Correct / Numeric) and click **"Check Answer"** for instant scoring (`+4 Marks` / `-1 Mark`) and answer verification.
  - Click-to-zoom high-resolution diagram modal for detailed graphs and circuits.
  - "Full Papers" directory tab displaying published shift papers.
- **Dedicated Single Question Pages (`/questions/[slug]`)**:
  - Standalone, indexable landing page for every question with dynamic SEO metadata, OpenGraph cards, and JSON-LD breadcrumbs (`Home > PYQs > {question.title}`).
  - Verified answer key and full **Step-by-Step KaTeX Derivation** with mathematical steps and diagrams.
  - One-click question URL sharing with clipboard feedback.
- **Dedicated Full Paper Pages (`/papers/[slug]`)**:
  - Complete official shift paper viewer with responsive **2-Tier Subject & Section Navigator** (`Physics Sec A/B`, `Chemistry Sec A/B`, `Mathematics Sec A/B`).
  - Real-time URL query parameter synchronization (`?subject=...&section=...`) to persist active state across reloads.
  - Sequential paper question numbering (`Q1..Q90`) and external solution links opening in new tabs.


### 👨‍🏫 AI Tutor

- Authentication via NextAuth.js (Google OAuth)
- File upload and attachment support
- Markdown and LaTeX rendering for mathematical expressions
- Chat history persistence backed by MongoDB
- Real-time message streaming


### 📊 Syllabus Tracker

- Progress tracking for Physics, Chemistry, and Mathematics
- Chapter-wise completion tracking for Theory, PYQs, and Revision
- Visual progress indicators and statistics
- **Cloud Sync**: Securely backup and sync your progress across multiple devices (MongoDB backed)
- **Smart Merge Conflict Resolution**: Intuitive UI to merge or choose between browser and cloud data
- Export progress as an image with `html-to-image`
- Import/export progress data manually via JSON
- Local storage persistence with automatic cross-tab synchronization
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
- **Styling**: Tailwind CSS with custom animations and `tailwind-scrollbar` for tailored component scrollbars
- **Icons**: Lucide React & React Icons
- **Theme Management**: @teispace/next-themes
- **Floating UI**: @floating-ui/react for tooltips and popovers
- **Markdown & Math Rendering**: Custom `MarkdownMathRenderer` built with KaTeX, `remark-math`, `rehype-katex`, and `remark-gfm`
- **Heading Anchors**: rehype-slug for blog table of contents
- **Content Management**: gray-matter for MDX frontmatter parsing
- **Image Export**: html-to-image for exporting the Syllabus Tracker
- **Auto-resize Textarea**: react-textarea-autosize for the AI Tutor chat input


### Backend & APIs

- **Authentication**: NextAuth.js v4 with Google OAuth provider
- **Databases (Microservice Architecture)**: 
  - `jee_challenger_auth`: User sessions and authentication
  - `jee_challenger_ai`: AI Tutor chat history
  - `jee_challenger_syllabus_tracker`: Cloud synced syllabus progress
  - `jee_challenger_pyqs`: High-performance Go microservice with MongoDB for Question Bank and Paper metadata
- **FastAPI AI Tutor Microservice**: Python & FastAPI microservice connected via Next.js proxy route `/api/ai/[...path]` with JWT authentication and streaming chat responses
- **Go PYQ Microservice**: High-performance Go microservice connected via Next.js proxy route `/api/pyqs/[...path]` with JWT authentication and Cloudflare R2 image CDN
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

# PYQ Go Backend Microservice URL (optional)
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
│   ├── (about)/                # Connect and Support
│   │   ├── contact-us/         # Contact form
│   │   └── donate/             # Support & Donations
│   ├── (home)/                 # Home page specific routes and components
│   ├── (legal)/                # Legal policies
│   │   ├── disclaimer/         # Disclaimer
│   │   ├── privacy-policy/     # Global Privacy Policy
│   │   └── terms-of-service/   # Global Terms of Service
│   ├── (official-links)/       # JEE official links & resources
│   │   ├── jee-advanced/       # JEE Advanced official links
│   │   └── jee-main/           # JEE Main official links
│   ├── (pyqs)/                 # Previous Year Questions system
│   │   ├── papers/[slug]/      # Dedicated Full Paper page with section navigation
│   │   ├── previous-year-questions/ # Main PYQ Hub & Practice feed
│   │   └── questions/[slug]/   # Dedicated Single Question page with KaTeX derivations
│   ├── (read-more)/            # Reading and content pages
│   │   ├── blog/               # Blog post display with dynamic routes
│   │   │   ├── [slug]/         # Dynamic blog post pages
│   │   │   ├── components/     # Blog UI components (TOC, Share, etc.)
│   │   │   └── hooks/          # Blog custom hooks
│   │   ├── blogs/              # Blog listing page with search/filter
│   │   └── news/               # Latest JEE news section
│   ├── (resources)/            # Resources
│   │   ├── chemistry/          # Chemistry resources
│   │   │   ├── periodic-table/ # Interactive Periodic Table explorer tool
│   │   │   └── unit-converter/ # Chemistry unit converter tool
│   │   ├── mathematics/        # Mathematics resources
│   │   │   └── unit-converter/ # Mathematics unit converter tool
│   │   └── physics/            # Physics resources
│   │       └── unit-converter/ # Physics unit converter tool
│   ├── (seo)/                  # SEO and Meta routes
│   │   ├── image-sitemap.xml/  # Sitemap generator
│   │   ├── og/                 # OpenGraph image generator
│   │   └── rss.xml/            # RSS feed generator
│   ├── (user)/                 # User-centric routes
│   │   ├── login/              # Login functionality
│   │   └── profile/            # User profile dashboard
│   ├── ai-tutor/               # AI Tutor functionality
│   │   ├── chat/               # Main chat interface and logic
│   │   └── components/         # AI Tutor specific components
│   ├── api/                    # API routes
│   │   ├── ai/                 # Reverse proxy to FastAPI AI Tutor microservice
│   │   ├── auth/               # NextAuth API endpoints
│   │   ├── pyqs/               # Reverse proxy to Go PYQ microservice
│   │   └── syllabus-tracker/   # Syllabus tracker sync API
│   ├── more-platforms/         # External platform links
│   └── syllabus-tracker/       # Progress tracking system
├── components/                 # Reusable React components
│   ├── common/                 # Shared components (Breadcrumbs, MarkdownMathRenderer, etc.)
│   ├── modals/                 # Modal components
│   ├── providers/              # Context providers
│   ├── resources/              # Resources components
│   │   └── pyqs/               # PYQ components (PYQFilterBar, PYQQuestionCard, etc.)
│   └── ui/                     # UI components (CustomSelect, BlogCard, etc.)
├── config/                     # Configuration files
├── data/                       # Content data
│   ├── blogs/                  # MDX blog articles
│   ├── resources/              # Formula, Unit Conversion, and Periodic Table data
│   │   ├── chemistry-formula-data.js
│   │   ├── mathematics-formula-data.js
│   │   ├── periodic-table-data.js
│   │   ├── periodic-table-explorer-constants.js
│   │   ├── physics-formula-data.js
│   │   └── unit-conversion-data.js
│   ├── faq-data.js             # General FAQ data
│   └── syllabus-data.js        # Syllabus Tracker data
├── docs/                       # Documentation
│   ├── blog-structure.md       # Blog system documentation
│   ├── color-system.md         # Design system colors
│   └── product-vision.md       # Platform vision and goals
├── public/                     # Static assets
├── server/                     # Server actions
└── utils/                      # Utility functions
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