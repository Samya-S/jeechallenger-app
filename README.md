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
 
A one-stop platform for all your JEE preparation needs, featuring books, notes, and other study materials.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Building for Production](#building-for-production)
- [All versions](#all-versions)
- [Contributing](#contributing)
- [License](#license)

## Features

- Modern and responsive UI built with Next.js and Tailwind CSS
- Dark/Light theme support
- Server-side rendering for better performance
- Contact form functionality with email integration
- SEO optimized with automatic sitemap generation
- Mobile-first design approach

## Technologies Used

- **Frontend Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **UI Components**: React 19
- **Icons**: React Icons
- **Email Service**: Nodemailer
- **Theme Management**: next-themes
- **SEO**: next-sitemap

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

## All versions

### jeechallenger v2.0
Upgraded the vanilla JavaScript project to `Next.js` application. 

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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
