"use client";
import Link from "next/link";
import { FaTelegram, FaInstagram, FaYoutube, FaEnvelope, FaGithub, FaChalkboardTeacher, FaNewspaper, FaChartLine } from "react-icons/fa";
// import GoogleAdsUnit from "@/components/utils/GoogleAdsUnit";

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900/80 backdrop-blur-[20px]">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Study Materials */}
          <div className="order-2 lg:order-1">
            <p className="font-semibold text-gray-900 dark:text-white mb-4 text-lg">Study Materials</p>
            <ul className="space-y-2">
              <li>
                <Link href="/materials/physics" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                  Physics PDFs
                </Link>
              </li>
              <li>
                <Link href="/materials/chemistry" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                  Chemistry PDFs
                </Link>
              </li>
              <li>
                <Link href="/materials/mathematics" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                  Mathematics PDFs
                </Link>
              </li>
              <li>
                <Link href="/materials/chapterwise-solved-pyqs" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                  Chapterwise PYQs
                </Link>
              </li>
              <li>
                <Link href="/materials/more-study-materials" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                  More Materials
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Access */}
          <div className="order-1 lg:order-2">
            <p className="font-semibold text-gray-900 dark:text-white mb-4 text-lg">Quick Access</p>
            <ul className="space-y-2">
              <li>
                <Link href="/ai-tutor" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors inline-flex items-center gap-1.5">
                  <FaChalkboardTeacher className="text-sm" />
                  AI Tutor
                </Link>
              </li>
              <li>
                <Link href="/syllabus-tracker" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors inline-flex items-center gap-1.5">
                  <FaChartLine className="text-sm" />
                  Syllabus Tracker
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors inline-flex items-center gap-1.5">
                  <FaNewspaper className="text-sm" />
                  Latest News
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors inline-flex items-center gap-1.5">
                  <FaEnvelope className="text-sm" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="https://github.com/Samya-S/jeechallenger-2.0" target="_blank" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors inline-flex items-center gap-1.5">
                  <FaGithub className="text-sm" />
                  Source Code
                </Link>
              </li>
            </ul>
          </div>

          {/* Platforms & Official Links */}
          <div className="order-3">
            <p className="font-semibold text-gray-900 dark:text-white mb-4 text-lg">Platforms & Official Links</p>
            <ul className="space-y-2">
              <li>
                <Link href="/more-platforms/physicswallah" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                  Physics Wallah
                </Link>
              </li>
              <li>
                <Link href="/more-platforms/apnikaksha" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                  Apni Kaksha
                </Link>
              </li>
              <li>
                <Link href="/more-platforms/unacademy" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                  Unacademy
                </Link>
              </li>
              <li>
                <Link href="/official-links/jee-main" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                  JEE Main Links
                </Link>
              </li>
              <li>
                <Link href="/official-links/jee-advanced" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                  JEE Advanced Links
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-300 dark:bg-gray-700 mb-8"></div>

        {/* Social Links */}
        <div className="flex justify-center gap-8 mb-8">
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

        {/* Copyright */}
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p className="text-base">
            Copyright © 2020-{new Date().getFullYear()}{" "}
            <span className="font-medium">JEE Challenger</span>
          </p>
          <p className="text-sm mt-2">All Rights Reserved</p>
        </div>
      </div>

      {/* <GoogleAdsUnit /> */}
    </footer>
  );
};

export default Footer;
