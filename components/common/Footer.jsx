"use client";
import Link from "next/link";
import { FaTelegram } from "react-icons/fa";
import GoogleAdsUnit from "@/components/utils/GoogleAdsUnit";

const Footer = () => {
  return (
    <footer
      style={{
        textAlign: "center",
        padding: "2rem",
        backgroundColor: "rgba(128, 128, 128, 0.15)" /* gray with 25% opacity */
      }}
    >
      <Link
        href="https://t.me/+oOnj4y_ZYqYyZjA1"
        target="_blank"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#2e87ca',
          textDecoration: 'none',
          fontSize: '1rem',
          fontWeight: '500',
          margin: '10px 0',
        }}
      >
        Join us on Telegram
        <FaTelegram style={{ marginLeft: '5px', fontSize: '1.5rem' }} />
      </Link>

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

      <GoogleAdsUnit />
    </footer>
  );
};

export default Footer;
