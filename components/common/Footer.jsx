"use client";
import Link from "next/link";
import { FaTelegram, FaInstagram, FaYoutube } from "react-icons/fa";
// import GoogleAdsUnit from "@/components/utils/GoogleAdsUnit";

const Footer = () => {
  return (
    <footer
      className="bg-gray-200/30 dark:bg-zinc-900"
      style={{
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '10px' }}>
        <Link
          href="https://t.me/+oOnj4y_ZYqYyZjA1"
          target="_blank"
          style={{
            display: 'flex',
            alignItems: 'center',
            color: '#2e87ca',
            textDecoration: 'none',
            fontSize: '1.5rem',
          }}
        >
          <FaTelegram />
        </Link>

        <Link
          href="https://www.instagram.com/jeechallenger"
          target="_blank"
          style={{
            display: 'flex',
            alignItems: 'center',
            color: '#E1306C',
            textDecoration: 'none',
            fontSize: '1.5rem',
          }}
        >
          <FaInstagram />
        </Link>

        <Link
          href="https://www.youtube.com/@jeechallenger"
          target="_blank"
          style={{
            display: 'flex',
            alignItems: 'center',
            color: '#FF0000',
            textDecoration: 'none',
            fontSize: '1.5rem',
          }}
        >
          <FaYoutube />
        </Link>
      </div>

      <div className="my-6">
        <p>
          Copyright © 2020-{new Date().getFullYear() % 100}{" "}
          <i style={{ fontWeight: 450 }}>Samya Saha</i>
        </p>
        <p>- All Rights Reserved.</p>
      </div>

      <p className="text-xs">
        View the source code on{' '}
        <Link
          href="https://github.com/Samya-S/jeechallenger-2.0"
          target="_blank"
          style={{ color: "#2e87ca", textDecoration: 'underline' }}
        >
          GitHub
        </Link>
      </p>

      {/* <GoogleAdsUnit /> */}
    </footer>
  );
};

export default Footer;
