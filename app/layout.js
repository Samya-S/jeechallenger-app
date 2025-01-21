import "./globals.css";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export const metadata = {
  title: "JEE Challenger",
  description: "A one-stop platform for all your JEE preparation needs, featuring books, notes, and other study materials.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          as="image"
          href="/images/home.jpg"
        />
        <link
          rel="preload"
          as="image"
          href="/images/tg-bg.jpg"
        />
        <link
          rel="preload"
          as="image"
          href="https://img.youtube.com/vi/6Ebb-oe2IUc/maxresdefault.jpg"
        />
      </head>
      <body
        className={`antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
