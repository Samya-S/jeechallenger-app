import "./globals.css";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import TelegramJoinFloat from "@/components/utils/TelegramJoinFloat";
import { GoogleAnalytics } from '@next/third-parties/google'
import AIAnnouncementModal from "@/components/common/AIAnnouncementModal";
import { ThemeProvider } from 'next-themes';
// import SplashCursor from "@/components/utils/SplashCursor";

export const metadata = {
  title: "JEE Challenger",
  description: "A one-stop platform for all your JEE preparation needs, featuring books, notes, and other study materials.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/images/home.webp" as="image" media="(max-width: 900px)" />
        <meta name="google-adsense-account" content="ca-pub-5566043353022333" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5566043353022333" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <TelegramJoinFloat />
          {children}
          <Footer />
          <AIAnnouncementModal />
          {/* <SplashCursor /> */}
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-6YPF169T9S" />
    </html>
  );
}
