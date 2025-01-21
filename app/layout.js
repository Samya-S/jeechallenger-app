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
        <link rel="preload" href="/images/home-blur.webp" as="image" media="(max-width: 900px)" />
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
