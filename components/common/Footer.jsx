"use client";
import Link from "next/link";
import { FaTelegram, FaInstagram, FaYoutube, FaEnvelope, FaGithub, FaNewspaper } from "react-icons/fa";
// import GoogleAdsUnit from "@/components/utils/GoogleAdsUnit";

const Footer = () => {
  return (
    <footer className="bg-gray-200/30 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Social Links */}
        <div className="flex justify-center gap-8 mb-10">
          <Link
            href="https://t.me/+oOnj4y_ZYqYyZjA1"
            target="_blank"
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            aria-label="Join our Telegram channel"
          >
            <FaTelegram className="text-3xl" />
          </Link>
          <Link
            href="https://www.instagram.com/jeechallenger"
            target="_blank"
            className="text-pink-500 hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300 transition-colors"
            aria-label="Follow us on Instagram"
          >
            <FaInstagram className="text-3xl" />
          </Link>
          <Link
            href="https://www.youtube.com/@jeechallenger"
            target="_blank"
            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            aria-label="Subscribe to our YouTube channel"
          >
            <FaYoutube className="text-3xl" />
          </Link>
        </div>

        {/* Divider */}
        <div className="w-24 h-px bg-gray-300 dark:bg-gray-700 mx-auto mb-10"></div>

        {/* Quick Links */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 mb-10">
          <Link
            href="/news"
            className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors flex items-center gap-2 px-3 py-1 rounded-md hover:bg-white dark:hover:bg-gray-800"
          >
            <FaNewspaper className="text-base" />
            Latest News
          </Link>
          <Link
            href="/contact-us"
            className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors flex items-center gap-2 px-3 py-1 rounded-md hover:bg-white dark:hover:bg-gray-800"
          >
            <FaEnvelope className="text-base" />
            Contact Us
          </Link>
          <Link
            href="https://github.com/Samya-S/jeechallenger-2.0"
            target="_blank"
            className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors flex items-center gap-2 px-3 py-1 rounded-md hover:bg-white dark:hover:bg-gray-800"
          >
            <FaGithub className="text-base" />
            Source Code
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p className="text-base">
            Copyright © 2020-{new Date().getFullYear()}{" "}
            <span className="font-medium">Samya Saha</span>
          </p>
          <p className="text-sm mt-2">All Rights Reserved</p>
        </div>
      </div>

      {/* <GoogleAdsUnit /> */}
    </footer>
  );
};

export default Footer;
