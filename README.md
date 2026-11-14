# JEE Challenger

[![License](https://img.shields.io/github/license/Samya-S/jeechallenger-app)](https://github.com/Samya-S/jeechallenger-app/blob/main/LICENSE)

A comprehensive one-stop platform for all your JEE preparation needs, featuring AI-powered tutoring, study materials, official papers, previous year questions, and more.

## Table of Contents

- [Features](#features)
  - [Core Features](#-core-features)
  - [Computer-Based Test (CBT) Mock Test Engine](#-computer-based-test-cbt-mock-test-engine)
  - [Question Lists & Revision Vaults](#-question-lists--revision-vaults)
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

- **Computer-Based Test (CBT) Mock Test Engine (`/mock-test`)**: Authentic NTA (JEE Main) and TCS iON (JEE Advanced) full-length 3-hour examination simulator with 3-tier state hierarchy (Zustand -> IndexedDB -> Upstash Redis), multi-device anti-collision lease, official palette states, multi-correct checkbox input with partial marking (`MULTI_CORRECT_PARTIAL`), Section B 5-of-10 attempt enforcement, automatic Mistake Vault sync with active recall, interactive Time Traps & Speed Wins pacing analytics, and factual Attempt Rate scorecard evaluation.
- **Previous Year Questions (PYQs)**: Interactive practice hub with multi-parameter filtering, instant answer evaluation, dedicated question pages (`/question/:slug`) with step-by-step KaTeX derivations, and full shift paper explorers (`/paper/:slug`) with section navigation.
- **Question Lists & Revision Vaults (`/lists`)**: Create, organize, and practice personalized question lists. Save challenging problems to Favourites, track incorrect answers with an automatic Mistake Vault, share public lists with peers, and bookmark questions with real-time synchronization across PYQ cards, full shift papers, standalone questions, and CBT solution reviews.
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


### 📝 Previous Year Questions

- **Chapter-Wise Practice Hub (`/previous-year-questions`)**:
  - Filter by Subject (Physics, Chemistry, Mathematics), Dynamic Chapter cascading, Exam Type (JEE Main / Advanced), Exam Year, Difficulty, and Question Format.
  - Custom, instant `CustomSelect` dropdown with embedded search filter and zero animation delay.
  - Interactive self-testing: select options (MCQ / Multi-Correct / Numeric) and click **"Check Answer"** for instant scoring (`+4 Marks` / `-1 Mark`) and answer verification.
  - Click-to-zoom high-resolution diagram modal for detailed graphs and circuits.
  - "Full Papers" directory tab displaying published shift papers.
- **Dedicated Single Question Pages (`/question/[slug]`)**:
  - Standalone, indexable landing page for every question with dynamic SEO metadata, OpenGraph cards, and JSON-LD breadcrumbs (`Home > PYQs > {question.title}`).
  - Verified answer key and full **Step-by-Step KaTeX Derivation** with mathematical steps and diagrams.
  - One-click question URL sharing with clipboard feedback.
- **Dedicated Full Paper Pages (`/paper/[slug]`)**:
  - Complete official shift paper viewer with responsive **2-Tier Subject & Section Navigator** (`Physics Sec A/B`, `Chemistry Sec A/B`, `Mathematics Sec A/B`).
  - Real-time URL query parameter synchronization (`?subject=...&section=...`) to persist active state across reloads.
  - Sequential paper question numbering (`Q1..Q90`) and external solution links opening in new tabs.


### 🖥️ Computer-Based Test (CBT) Mock Test Engine

> 📖 **Full Architectural Specification**: See the comprehensive [CBT Engine Master Blueprint & Technical Specification](docs/cbt-master-spec.md) for deep technical details on the 3-tier state hierarchy, single-instance leased mutex, scoring judge algorithms, and authoritative MongoDB schemas.

- **Authentic Examination Interfaces (`/mock-test`)**:
  - **JEE Main Terminal**: Official NTA CBT software replica with 6-section navigation (`Physics/Chem/Math Sec A & B`), synchronized master countdown timer, Question Paper preview, Instructions modal, and official 5-state Question Palette (Not Visited, Not Answered, Answered, Marked for Review, Answered & Marked for Review).
  - **JEE Advanced Terminal**: TCS iON CBT replica with 2-tier hierarchy (Parts & Sub-Sections), accessibility zoom (`A+ / A / A-`), and section-filtered question palette.
  - **Unsaved Palette Jump Trait**: Replicates official NTA/IIT examination rules where jumping directly via the palette discards uncommitted choices.
  - **Virtual Numeric Keypad**: Mouse-only on-screen keypad strictly blocking physical keyboard strokes for numerical integer/decimal inputs.
  - **Multi-Correct Checkbox Support**: Dedicated square checkbox controls with simultaneous option toggling and official partial marking (`+4, +3, +2, +1, -2`).
- **Resilient 3-Tier State Architecture**:
  - Layer 1: Visual State (Zustand, 0 ms UI updates).
  - Layer 2: Local Crash Guard (IndexedDB `<1 ms` persistence against accidental browser close).
  - Layer 3: Cloud Persistence (Upstash Redis delta sync via lightweight HTTP REST calls).
  - Multi-device leased mutex anti-collision preventing concurrent device cheating (409 Conflict lockout overlay).
- **Comprehensive Scorecard & Pacing Analytics (`/mock-test/[slug]/results`)**:
  - **Factual Attempt Rate**: Replaced pseudo-percentiles with accurate attempted question ratios (`Attempt Rate: 84.0% (63/75)`).
  - **Interactive Time Traps & Speed Wins**: Benchmark pacing dashboard with click-to-jump smooth scrolling and amber focus highlight pulse.
  - **Mistake Vault with Active Recall**: Automatically stores incorrect attempts in MongoDB Atlas with step-by-step solutions collapsed and closed by default.
  - **In-Situ Bug Reporting**: Direct `<Bug />` report trigger on every review card linking into `ReportQuestionModal`.


### 📑 Question Lists & Revision Vaults

> 📖 **Full Architectural Specification**: See the comprehensive [Question Playlists & Custom Bookmarks Master Blueprint](docs/playlists-master-spec.md) for data schemas, Go microservice endpoints, and state synchronization details.

- **Personalized Revision Playlists (`/lists`)**:
  - System-seeded default lists: **Favourites** (priority revision) and **Mistake Vault** (revision tracker).
  - Create custom lists with personalized titles, descriptions, and public/private visibility toggles.
  - Search, sort, and filter bookmarked questions by Subject, Difficulty, and Chapter with progressive infinite scroll.
  - Direct "Solve" shortcuts navigating to standalone question solver pages.
  - Public playlist sharing with one-click link copying and clone-to-account capability for peers and study groups.
- **Universal Question Bookmarking**:
  - Embedded `<QuestionBookmarkButton />` consistently available across all four question surfaces:
    1. **PYQ Question Cards** (`/previous-year-questions`)
    2. **Full Shift Paper Explorers** (`/paper/[slug]`)
    3. **Dedicated Question Pages** (`/question/[slug]`)
    4. **CBT Exam Solution Reviews** (`/mock-test/[slug]/results`)
  - One-click multi-playlist checkbox selector with instant in-flight mutation and in-popover custom list creation.
  - Direct "Sign In to Bookmark" call-to-action for guest visitors with automatic post-login return.
- **Real-Time State Synchronization**:
  - Single source of truth via unified global `BookmarkContext` at the application root (`ConditionalLayout`).
  - Zero duplicate network requests; adding, editing, or deleting lists immediately updates bookmark popovers across the entire platform without page refreshes.


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

- **Unified Service Layer (`server/services/`)**: Centralized internal SDK and single source of truth for microservice communication, token signing, and caching rules:
  - `pyqs.js`: Go PYQ & CBT microservice client (`pyqs-api.jeechallenger.com`) for questions, papers, attempts, mistake vault, and test submissions.
  - `ai.js`: Python AI Tutor microservice client (`ai-api.jeechallenger.com`) with streaming chat proxy and multipart file upload forwarding.
  - `syllabus-tracker.js`: Syllabus tracker microservice client delegating progress synchronization and milestone retrieval to the Go PYQs microservice (`pyqs-api.jeechallenger.com`).
- **Authentication**: NextAuth.js v4 with Google OAuth provider & HS256 JWT microservice authentication tokens
- **Databases (Microservice Architecture)**: 
  - `jee_challenger_auth`: User sessions, accounts, and authentication (direct NextAuth adapter connection; indexed on `email`, `created_at`, `subscription_plan_id`, and `accounts.userId`)
  - `jee_challenger_ai`: AI Tutor chat history and message logs (owned by FastAPI AI backend)
  - `jee_challenger_pyqs` & `jee_challenger_syllabus_tracker`: Question bank, paper metadata, CBT test scorecards, mistake vault, revision playlists, and syllabus progress (owned and served exclusively by the high-performance Go microservice)
- **Caching & Live CBT State**: Upstash Redis (session locks, heartbeat sync, kiosk device transfer, and rate limiting)
- **Token Handling**: Centralized `jsonwebtoken` (JWT) signing with `NEXTAUTH_SECRET`
- **Email Service**: Nodemailer for contact form
- **News API**: GNews API for real-time updates
- **BFF API Routes (`app/api/`)**: Next.js Backend-For-Frontend API routes serving as secure browser-to-backend proxies and external webhook receivers


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
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# MongoDB Connection
MONGODB_URI=your-mongodb-connection-string

# Upstash Redis (Session Management & CBT State)
UPSTASH_REDIS_REST_URL=your-upstash-redis-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token

# Email Configuration (Nodemailer)
AUTH_EMAIL=your-email@gmail.com
AUTH_PASS=your-app-password
SENDER_EMAIL=your-sender-email@gmail.com
RECEIVER_EMAILS=receiver1@example.com,receiver2@example.com

# GNews API Configuration
GNEWS_API_KEY=your-gnews-api-key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Cloudflare Analytics (Optional)
NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN=your-token

# Google Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=your-ga-id

# Google AdSense (Optional)
NEXT_PUBLIC_ADSENSE_CLIENT_ID=your-adsense-id

# Internal Cron Secret (Optional, for CBT auto-submit)
INTERNAL_CRON_SECRET=your-cron-secret

# On-Demand Revalidation Secret (for Go backend & pipeline cache purges)
REVALIDATION_SECRET=your-revalidation-secret

# Microservice Internal Machine-to-Machine Secrets (HS256 X-Internal-Token)
PYQS_SERVICE_SECRET=your-pyqs-service-secret
AI_SERVICE_SECRET=your-ai-service-secret

# PYQ Go Backend Microservice URL (optional, defaults to https://pyqs-api.jeechallenger.com)
PYQS_API_URL=https://pyqs-api.jeechallenger.com

# AI Tutor Python Backend Microservice URL (optional, defaults to https://ai-api.jeechallenger.com)
AI_API_URL=https://ai-api.jeechallenger.com
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Building for Production

To create an optimized production build:

```bash
npm run build
```

This will run Turbopack production compilation, Next.js page generation, sitemap generation, and static SEO XML outputs.


## Project Structure

```text
jeechallenger-app/
├── app/                        # Next.js App Router routes
│   ├── (about)/                # About pages (contact-us, donate, etc.)
│   ├── (home)/                 # Homepage components, layout, and modular showcase
│   │   └── components/feature-hub/ # Decoupled demo widgets (CBT, PYQ, AI Tutor, Syllabus, Resources, Official, Blogs) and mock data
│   ├── (legal)/                # Legal pages (privacy-policy, terms-of-service, etc.)
│   ├── (official-links)/       # JEE Main and Advanced official resource portals
│   ├── (pyqs)/                 # Previous Year Questions hub, /paper/[slug], /question/[slug]
│   ├── (read-more)/            # Blogs and news pages
│   ├── (resources)/            # Formula sheets, Unit converters, Periodic Table explorer
│   ├── (seo)/                  # Sitemap, RSS, and OpenGraph generators
│   ├── (user)/                 # Login and candidate user profile dashboard
│   ├── ai-tutor/               # AI Tutor chat interface and attachment uploaders
│   │   ├── components/         # ChatMessageList, ChatInputArea, WelcomeScreen, ChatSidebar, AITutorNavbar
│   │   └── utils/              # aiTutorUtils.js (date grouping, error normalization, dynamic placeholders)
│   ├── api/                    # Backend-For-Frontend (BFF) API routes
│   │   ├── ai/                 # Proxy to FastAPI AI Tutor microservice via aiService
│   │   ├── auth/               # NextAuth API endpoints & Google OAuth callbacks
│   │   ├── cbt/                # CBT Redis session management, heartbeat sync, and submit
│   │   ├── playlists/          # User playlists & bookmarks CRUD routes
│   │   ├── pyqs/               # Proxy to Go PYQ microservice & cache purge webhook (revalidate)
│   │   └── syllabus-tracker/   # Syllabus tracker sync API
│   ├── lists/                  # Custom question playlists and bookmarks (/lists/[slug])
│   ├── mock-test/              # Official timed CBT Mock Test simulator & Mistake Vault
│   └── syllabus-tracker/       # Cloud-synced preparation tracking system
├── components/                 # Reusable React components
│   ├── cbt/                    # CBT exam rooms, palettes, scorecards, and solution review
│   │   └── hub/                # CBTHubComponent, CBTHubPerformanceStrip, and tabs/ (papers, attempts, vault)
│   ├── common/                 # Shared components (Breadcrumbs, MarkdownMathRenderer, etc.)
│   ├── modals/                 # Modal dialogs
│   ├── playlists/              # Unified BookmarkContext, sidebars, tables, and popover components
│   ├── providers/              # React Context providers
│   ├── resources/              # Formula sheets, unit converters, and PYQ components
│   │   └── pyqs/               # PaperDetailComponent, PYQImageLightbox, and modular paper views
│   │       └── paper-detail/   # PaperHeader, PaperNavigation, and PaperQuestionCard subcomponents
│   └── ui/                     # Primitives (CustomSelect, BlogCard, etc.)
├── config/                     # Configuration files
├── data/                       # Static resource data and formula constants
├── docs/                       # Technical blueprints and specifications
│   ├── blog-structure.md       # Blog system documentation
│   ├── cbt-master-spec.md      # CBT Exam Simulator & 3-Tier State Machine master blueprint
│   ├── color-system.md         # Design system colors
│   ├── playlists-master-spec.md# Question Playlists & Custom Bookmarks master blueprint
│   ├── product-vision.md       # Platform vision and goals
│   └── traffic-growth-strategy.md # Traffic, SEO, and indexing strategy
├── public/                     # Static assets
├── server/                     # Server-side business logic
│   ├── services/               # Centralized microservice clients & SDKs
│   │   ├── ai.js               # Python AI Tutor microservice client
│   │   ├── internal-token.js   # Short-lived internal service JWT signer (X-Internal-Token)
│   │   ├── pyqs.js             # Go PYQ & CBT microservice client
│   │   └── syllabus-tracker.js # Syllabus progress MongoDB service
│   ├── contact-actions.js      # Contact form email server action
│   ├── news-actions.js         # GNews server action
│   └── views-actions.js        # Upstash Redis article view counts
└── utils/                      # Low-level utilities & infrastructure singletons
    ├── cbt-auto-submit.js      # Lazy & cron expired CBT exam finalizer
    ├── cbt-helpers.js          # CBT palette, timer, and score formatting helpers
    ├── mongodb.js              # MongoDB client singleton
    ├── pyq-helpers.js          # PYQ taxonomy, slugs, badges, and search snippet helpers
    └── redis.js                # Upstash Redis client singleton
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
