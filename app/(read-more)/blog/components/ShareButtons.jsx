'use client';

import { useState } from 'react';
import { Share2, Link2, Check } from 'lucide-react';
import { FaXTwitter, FaFacebook, FaLinkedin, FaWhatsapp, FaInstagram } from 'react-icons/fa6';

export default function ShareButtons({ shareUrl: shareUrlProp, shareTitle, inline = false }) {
  const [copied, setCopied] = useState(false);
  const [instagramMessage, setInstagramMessage] = useState('');

  const getShareUrl = () => {
    if (shareUrlProp) return shareUrlProp;
    if (typeof window !== 'undefined') return window.location.href;
    return '';
  };

  const handleWebShare = async () => {
    const url = getShareUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareTitle,
          url,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          // If share fails, copy link as fallback
          copyLink();
        }
      }
    } else {
      // Fallback to copy link
      copyLink();
    }
  };

  const handleShare = async (platform) => {
    const url = getShareUrl();
    // Fallback: Use platform-specific share URLs
    const urls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareTitle)}`,
      // Facebook only accepts URL, pulls title/description from Open Graph tags
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      // LinkedIn pulls from Open Graph but still supports these params as fallback
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + url)}`,
    };

    if (urls[platform]) {
      // Open in new tab (better than popup window)
      const link = document.createElement('a');
      link.href = urls[platform];
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.click();
    }
  };

  const handleInstagramShare = async () => {
    const url = getShareUrl();
    // Try Web Share API first (works on mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          url,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          // Fallback to copy link
          copyLinkForInstagram();
        }
      }
    } else {
      // Fallback to copy link
      copyLinkForInstagram();
    }
  };

  const copyLinkForInstagram = () => {
    const url = getShareUrl();
    navigator.clipboard.writeText(url);
    setInstagramMessage('Link copied! Open Instagram and paste in your story or post.');
    setTimeout(() => setInstagramMessage(''), 3000);
  };

  const copyLink = () => {
    const url = getShareUrl();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mobile inline version (shown on same line as date)
  if (inline) {
    return (
      <button
        onClick={handleWebShare}
        className="lg:hidden inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-colors border border-gray-200 dark:border-gray-700"
        aria-label={copied ? "Link copied" : "Share"}
        title={copied ? "Link copied!" : "Share"}
      >
        {copied ? (
          <Check size={16} className="text-green-600 dark:text-green-400" />
        ) : (
          <Share2 size={16} />
        )}
        <span className="text-sm">{copied ? 'Copied!' : 'Share'}</span>
      </button>
    );
  }

  // Desktop version (full section with all platform buttons)
  return (
    <div className="hidden lg:block mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4 flex-wrap">
        <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
          <Share2 size={18} />
          Share:
        </span>
        
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => handleShare('twitter')}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            aria-label="Share on Twitter"
          >
            <FaXTwitter size={18} />
          </button>
          <button
            onClick={() => handleShare('facebook')}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            aria-label="Share on Facebook"
          >
            <FaFacebook size={18} />
          </button>
          <button
            onClick={() => handleShare('linkedin')}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            aria-label="Share on LinkedIn"
          >
            <FaLinkedin size={18} />
          </button>
          <button
            onClick={() => handleShare('whatsapp')}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            aria-label="Share on WhatsApp"
          >
            <FaWhatsapp size={18} />
          </button>
          <button
            onClick={handleInstagramShare}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            aria-label="Share on Instagram"
          >
            <FaInstagram size={18} />
          </button>
          <button
            onClick={copyLink}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors relative"
            aria-label="Copy link"
          >
            {copied ? <Check size={18} /> : <Link2 size={18} />}
          </button>
        </div>

        {copied && (
          <span className="text-sm text-green-600 dark:text-green-400 font-medium">
            Copied!
          </span>
        )}
        {instagramMessage && (
          <span className="text-sm text-pink-600 dark:text-pink-400 font-medium">
            {instagramMessage}
          </span>
        )}
      </div>
    </div>
  );
}
