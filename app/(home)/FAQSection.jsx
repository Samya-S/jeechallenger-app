"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, Send } from "lucide-react";
import { FaChalkboardTeacher } from "react-icons/fa";
import { homepageFAQs } from "@/data/faq-data";

/**
 * Formats FAQ answers with structured lists if they contain numbered points (e.g. 1) ... 2) ...)
 * or bullet points, avoiding single-line text walls.
 */
function renderFaqAnswer(answer) {
  if (!answer) return null;

  // Detect numbered items like "1) ... 2) ..."
  if (/\b1\)\s+/.test(answer) && /\b2\)\s+/.test(answer)) {
    const firstIndex = answer.search(/\b1\)\s+/);
    const intro = answer.slice(0, firstIndex).trim();
    const listContent = answer.slice(firstIndex);

    const items = listContent
      .split(/\s*\b\d+\)\s*/)
      .map((item) => item.trim().replace(/[,;]$/, ""))
      .filter(Boolean);

    return (
      <div className="space-y-3">
        {intro && <p>{intro}</p>}
        <ul className="space-y-2.5 pl-0.5">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Detect newline bullet points
  if (answer.includes("\n- ") || answer.includes("\n• ")) {
    const lines = answer.split("\n");
    const introLines = [];
    const bulletItems = [];
    let inBullets = false;

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
        inBullets = true;
        bulletItems.push(trimmed.replace(/^[-•]\s*/, ""));
      } else if (!inBullets) {
        introLines.push(line);
      } else {
        bulletItems.push(trimmed);
      }
    });

    return (
      <div className="space-y-3">
        {introLines.length > 0 && <p>{introLines.join("\n")}</p>}
        <ul className="space-y-2 pl-0.5">
          {bulletItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0 mt-2" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return <p>{answer}</p>;
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0); // first item open by default

  const faqs = homepageFAQs?.questions || [];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-gray-200/60 dark:border-gray-800/80 bg-white dark:bg-transparent content-auto">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions? We&apos;ve Got Answers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to know about JEE Challenger, our study resources, AI Tutor, and syllabus tracking.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-white dark:bg-gray-900/95 border-blue-500 dark:border-blue-500 shadow-md shadow-blue-500/10 ring-1 ring-blue-500/30"
                    : "bg-white dark:bg-gray-900/80 border-gray-200/90 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                }`}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full py-4 sm:py-5 px-5 sm:px-6 flex items-center justify-between gap-4 text-left cursor-pointer transition-colors focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className={`text-base sm:text-lg font-bold tracking-tight transition-colors ${
                    isOpen 
                      ? "text-blue-600 dark:text-blue-400" 
                      : "text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                  }`}>
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                    isOpen 
                      ? "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rotate-180" 
                      : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300"
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 sm:px-6 pb-5 pt-2 text-sm sm:text-base text-gray-700 dark:text-gray-200 leading-relaxed border-t border-gray-100 dark:border-gray-800">
                      {renderFaqAnswer(faq.answer)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Support Callout */}
        <div className="mt-12 sm:mt-16 p-5 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50 dark:from-gray-900 dark:via-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-800/60 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">Still have a question or need study help?</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Ask our 24/7 AI Tutor or connect directly with our peer community on Telegram.
            </p>
          </div>

          <div className="flex flex-row flex-nowrap items-center justify-center sm:justify-start gap-2.5 sm:gap-3">
            <Link
              href="/ai-tutor"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all hover:scale-105 cursor-pointer whitespace-nowrap shrink-0"
            >
              <FaChalkboardTeacher className="w-4 h-4 shrink-0" />
              <span>Ask AI Tutor</span>
            </Link>

            <Link
              href="https://t.me/+oOnj4y_ZYqYyZjA1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#2AABEE] to-[#229ED9] hover:from-[#249ecc] hover:to-[#1d8ec6] shadow-sm transition-all hover:scale-105 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Send className="w-3.5 h-3.5 text-white shrink-0" />
              <span>Join us on Telegram</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
