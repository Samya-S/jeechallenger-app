"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { 
  PanelLeft, 
  Plus, 
  Sun, 
  Moon, 
  User as UserIcon, 
  Home, 
  LogOut,
  ChevronDown
} from "lucide-react";
import { useTheme } from "@teispace/next-themes";

const AITutorNavbar = ({ user, onLogout, onToggleSidebar, onNewChat }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { theme, setTheme, resolvedTheme } = useTheme();

  const isDark = (resolvedTheme ?? theme) === "dark";

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    // Strictly lg:hidden - Desktop has ZERO top bar, only the sidebar handles everything!
    <header className="lg:hidden flex items-center justify-between px-3.5 py-2.5 bg-slate-50/95 dark:bg-[#090e18]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shrink-0 z-40">
      {/* Left: Mobile Sidebar Toggle */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-2xs active:scale-95 transition-all"
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
        >
          <PanelLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Center: Brand Logo + AI Tutor Pill */}
      <Link href="/" className="flex items-center gap-1.5 shrink-0" title="JEE Challenger Home">
        <img
          src="/brand/jee-challenger-navbar-no-tagline-light-mode.svg"
          alt="JEE Challenger"
          className="h-6 w-auto dark:hidden"
        />
        <img
          src="/brand/jee-challenger-navbar-no-tagline-dark-mode.svg"
          alt="JEE Challenger"
          className="h-6 w-auto hidden dark:block"
        />
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
          AI Tutor
        </span>
      </Link>

      {/* Right: Only the User Profile Avatar (Single clean button, zero congestion) */}
      <div className="relative shrink-0" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen((open) => !open)}
          className="flex items-center rounded-full p-0.5 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95 transition-transform"
          title="User menu"
          aria-label="User menu"
        >
          {user?.image ? (
            <Image
              src={user.image}
              alt={user.name || "User"}
              width={30}
              height={30}
              unoptimized
              className="w-7 h-7 rounded-full object-cover"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
              {user?.name ? user.name[0].toUpperCase() : <UserIcon className="w-3.5 h-3.5" />}
            </div>
          )}
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-1.5 animate-fadeIn">
            <div className="px-2.5 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-1">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {user?.name || "Student"}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-400 truncate">
                {user?.email}
              </p>
            </div>

            {/* Quick Theme Toggle Option */}
            <button
              type="button"
              onClick={() => {
                setTheme(isDark ? "light" : "dark");
              }}
              className="group/menu-theme w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                {isDark ? (
                  <Sun className="w-3.5 h-3.5 text-slate-400 group-hover/menu-theme:text-amber-400 transition-colors" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-slate-500 group-hover/menu-theme:text-slate-800 dark:group-hover/menu-theme:text-slate-200 transition-colors" />
                )}
                <span>Theme</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase">
                {isDark ? "Dark" : "Light"}
              </span>
            </button>

            <Link
              href="/"
              onClick={() => setDropdownOpen(false)}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-blue-500" />
              <span>Return to Home</span>
            </Link>

            <Link
              href="/profile"
              onClick={() => setDropdownOpen(false)}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <UserIcon className="w-3.5 h-3.5 text-indigo-500" />
              <span>Profile</span>
            </Link>

            <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

            <button
              type="button"
              onClick={() => {
                setDropdownOpen(false);
                onLogout?.();
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-500" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default AITutorNavbar;
