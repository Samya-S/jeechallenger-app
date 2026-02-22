<p align="center" width="100%">
    <img width="18%" src="./public/images/jcicon.jpg"> 
</p>

<h1 align="center" style="font-family: 'Jost', sans-serif;">JEE Challenger</h1>

<p align="center">
  <a href="https://github.com/Samya-S/jeechallenger-2.0/releases">
    <img src="https://img.shields.io/github/package-json/v/Samya-S/jeechallenger-2.0" alt="Version">
  </a>
  <a href="https://github.com/Samya-S/jeechallenger-2.0/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/Samya-S/jeechallenger-2.0" alt="License">
  </a>
</p>
 
A comprehensive one-stop platform for all your JEE preparation needs, featuring AI-powered tutoring, study materials, official papers, and more.

## Table of Contents

- [Features](#features)
  - [Core Features](#-core-features)
  - [User Experience](#-user-experience)
  - [Study Resources](#-study-resources)
  - [AI Tutor Features](#-ai-tutor-features)
  - [News & Updates](#-news--updates)
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
- **AI Tutor**: Personalized JEE preparation assistance with Google OAuth integration
- **Study Materials**: Comprehensive resources for Physics, Chemistry, and Mathematics
- **Official Papers**: Direct access to JEE Main and Advanced official papers and answer keys
- **Chapter-wise PYQs**: Solved previous year questions organized by chapters
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

### 👨‍🏫 AI Tutor Features
- Google OAuth authentication
- File upload and attachment support
- Markdown and LaTeX rendering for mathematical expressions
- Chat history persistence
- Real-time message streaming
- Subscription management system

### 📰 News & Updates
- Real-time JEE news from GNews API
- Categorized news cards
- Automatic content refresh
- Mobile-responsive news layout

### 🔗 Platform Integrations
- **Unacademy**: Direct links to Unacademy JEE courses
- **Physics Wallah**: Access to PW study materials
- **Apni Kaksha**: Additional study resources

## Technologies Used

### Frontend
- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS with custom animations
- **Icons**: React Icons
- **Theme Management**: next-themes
- **Markdown Rendering**: React Markdown with KaTeX support
- **Math Rendering**: KaTeX for mathematical expressions

### Backend & APIs
- **Email Service**: Nodemailer for contact form
- **News API**: GNews API for real-time updates
- **Authentication**: Google OAuth with @react-oauth/google
- **File Handling**: Custom file upload system
- **API Routes**: Next.js API routes with rewrites

### Development & Deployment
- **Build Tool**: Turbopack for faster development
- **SEO**: next-sitemap for automatic sitemap generation
- **Analytics**: Google Analytics integration
- **Ad Integration**: Google AdSense support
- **Performance**: Image optimization and caching

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/Samya-S/jeechallenger-2.0.git
cd jeechallenger-2.0
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your environment variables:
```env
# Email Configuration for Contact form
AUTH_EMAIL=your-email@example.com
AUTH_PASS=your-email-password
SENDER_EMAIL=your-email@example.com
RECEIVER_EMAIL=recipient@example.com

# GNews API Configuration
GNEWS_API_KEY=your-gnews-api-key

# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id

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
jeechallenger-2.0/
├── app/                          # Next.js App Router pages
│   ├── ai-tutor/                # AI Tutor functionality
│   ├── contact-us/              # Contact form
│   ├── materials/               # Study materials
│   │   ├── physics/            # Physics resources
│   │   ├── chemistry/          # Chemistry resources
│   │   ├── mathematics/        # Mathematics resources
│   │   └── chapterwise-solved-pyqs/  # PYQs by chapter
│   ├── more-platforms/         # External platform links
│   ├── news/                   # News section
│   └── official-links/         # JEE official papers
├── components/                  # Reusable React components
│   ├── AiTutorComponents/      # AI Tutor specific components
│   ├── common/                 # Shared components
│   ├── home/                   # Home page components
│   └── utils/                  # Utility components
├── lib/                        # Utility functions and configs
├── server/                     # Server actions
└── public/                     # Static assets
```

## All versions

### jeechallenger v2.0
Upgraded the vanilla JavaScript project to a modern `Next.js` application with AI-powered features.

> [!NOTE]
> This is a major update and managed in this repository

### jeechallenger v1.2
This is version 1.2, made using `HTML`, `CSS` and vanilla `JavaScript`. The code is available at the `main branch` of the repository [Samya-S/jeechallenger](https://github.com/Samya-S/jeechallenger) (archived) and at [Samya-S/jeechallenger-v1.2](https://github.com/Samya-S/jeechallenger-v1.2) (archived).

### jeechallenger v1.1
This version includes `PHP`. The code is available at `v1.1 branch` of the repository [Samya-S/jeechallenger](https://github.com/Samya-S/jeechallenger) (archived) and at [Samya-S/jeechallenger-v1.1](https://github.com/Samya-S/jeechallenger-v1.1) (archived).

### jeechallenger v1.0
This version is made using `HTML`, `CSS` and vanilla `JavaScript`. The code is available at `v1.0 branch` of the repository [Samya-S/jeechallenger](https://github.com/Samya-S/jeechallenger) (archived).

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

If you find this project helpful and would like to support its development, consider becoming a sponsor. Your support helps maintain and improve the project.

<a href="https://github.com/sponsors/Samya-S">
  <img src="https://img.shields.io/badge/Sponsor-30363D?style=for-the-badge&logo=GitHub-Sponsors&logoColor=#EA4AAA" alt="Sponsor">
</a>
