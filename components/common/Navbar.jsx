"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { 
  Menu, 
  X, 
  ChevronDown, 
  User, 
  LogOut, 
  ExternalLink,
  Sparkles
} from "lucide-react";
import NavbarItems from "./NavbarItems";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useTheme } from "@teispace/next-themes";

export default function NavBar() {
  const [mounted, setMounted] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [activeDesktopDropdown, setActiveDesktopDropdown] = useState(null);
  const [mobileDropdownState, setMobileDropdownState] = useState({});
  const [isScrolled, setIsScrolled] = useState(false);

  const closeTimeoutRef = useRef(null);
  const navRef = useRef(null);

  const { theme, resolvedTheme, setTheme } = useTheme();
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearchParams = searchParams ? searchParams.toString() : "";
  const fullCurrentPath = currentSearchParams ? `${pathname}?${currentSearchParams}` : pathname;
  const encodedReturnUrl = encodeURIComponent(fullCurrentPath);

  const loginHref = pathname === '/login'
    ? (currentSearchParams ? `/login?${currentSearchParams}` : '/login')
    : `/login?returnUrl=${encodedReturnUrl}`;

  // Set mounted for client-side portals
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change cleanly
  useEffect(() => {
    setShowMobileNav(false);
    setActiveDesktopDropdown(null);
    setMobileDropdownState({});
  }, [pathname, searchParams]);

  // Handle escape key and click outside to close desktop dropdowns
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveDesktopDropdown(null);
        setShowMobileNav(false);
      }
    };

    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDesktopDropdown(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Body scroll lock on mobile nav
  useEffect(() => {
    if (showMobileNav) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [showMobileNav]);

  const openDesktopDropdown = (key) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDesktopDropdown(key);
  };

  const closeDesktopDropdownWithDelay = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDesktopDropdown(null);
    }, 180);
  };

  const closeDesktopDropdownImmediately = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDesktopDropdown(null);
  };

  const toggleDesktopDropdown = (key) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDesktopDropdown((prev) => (prev === key ? null : key));
  };

  const toggleMobileDropdown = (index) => {
    setMobileDropdownState((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <header
      ref={navRef}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/80 dark:border-gray-800 shadow-sm"
          : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/60"
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="group flex items-center gap-2 text-xl sm:text-2xl font-bold tracking-tight"
            aria-label="JEE Challenger Homepage"
            onClick={closeDesktopDropdownImmediately}
          >
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
              JEE Challenger
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5" aria-label="Main Navigation">
          {NavbarItems.map((item, index) => {
            if (item.type === "link") {
              const isActive = pathname === item.url;
              return (
                <Link
                  key={index}
                  href={item.url}
                  onClick={closeDesktopDropdownImmediately}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/40"
                      : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100/70 dark:hover:bg-gray-800/70"
                  }`}
                >
                  {item.title}
                </Link>
              );
            }

            if (item.type === "dropdown") {
              const isOpen = activeDesktopDropdown === index;
              const isChildActive = item.items?.some(
                (sub) => pathname === sub.url || pathname.startsWith(sub.url + "/")
              );

              return (
                <div
                  key={index}
                  className="relative"
                  onMouseEnter={() => openDesktopDropdown(index)}
                  onMouseLeave={closeDesktopDropdownWithDelay}
                >
                  <button
                    onClick={() => toggleDesktopDropdown(index)}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    className={`group flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isOpen || isChildActive
                        ? "text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/40"
                        : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100/70 dark:hover:bg-gray-800/70"
                    }`}
                  >
                    <span>{item.title}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-all duration-200 ${
                        isOpen ? "rotate-180" : ""
                      } ${
                        isOpen || isChildActive
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-400 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isOpen && (
                    <div
                      className="absolute left-0 top-full pt-1 w-56 z-50 animate-in fade-in zoom-in-95 duration-150"
                      role="menu"
                      aria-label={`${item.title} submenu`}
                    >
                      <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200/90 dark:border-gray-800 shadow-xl ring-1 ring-black/5 dark:ring-white/5 p-1.5 backdrop-blur-xl flex flex-col gap-1">
                        {item.items.map((subitem, subindex) => {
                          const isSubActive = pathname === subitem.url;
                          return (
                            <Link
                              key={subindex}
                              href={subitem.url}
                              onClick={closeDesktopDropdownImmediately}
                              role="menuitem"
                              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                isSubActive
                                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50"
                                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                              }`}
                            >
                              <span>{subitem.title}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return null;
          })}
        </nav>

        {/* Right Actions: Theme Toggle + User Auth + Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>

          {/* Desktop User Auth Section */}
          <div className="hidden sm:flex items-center">
            {status === "loading" ? (
              <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse border border-gray-300 dark:border-gray-600" />
            ) : status === "authenticated" ? (
              <div
                className="relative"
                onMouseEnter={() => openDesktopDropdown("user")}
                onMouseLeave={closeDesktopDropdownWithDelay}
              >
                <button
                  onClick={() => toggleDesktopDropdown("user")}
                  aria-expanded={activeDesktopDropdown === "user"}
                  aria-label="User menu"
                  className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-blue-500/40 transition-all"
                >
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User Profile"}
                      width={34}
                      height={34}
                      unoptimized
                      className="w-8.5 h-8.5 rounded-full object-cover border border-gray-300 dark:border-gray-700"
                    />
                  ) : (
                    <div className="w-8.5 h-8.5 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                    </div>
                  )}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-all duration-200 ${
                      activeDesktopDropdown === "user"
                        ? "rotate-180 text-blue-600 dark:text-blue-400"
                        : "text-gray-400 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                    }`}
                  />
                </button>

                {/* User Dropdown */}
                {activeDesktopDropdown === "user" && (
                  <div
                    className="absolute right-0 top-full pt-1 w-52 z-50 animate-in fade-in zoom-in-95 duration-150"
                    role="menu"
                  >
                    <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200/90 dark:border-gray-800 shadow-xl ring-1 ring-black/5 dark:ring-white/5 p-1.5 backdrop-blur-xl flex flex-col gap-1">
                      <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                          {session.user?.name || "Student"}
                        </p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                          {session.user?.email || ""}
                        </p>
                      </div>
                      <Link
                        href={`/profile${pathname === "/" ? "" : `?returnUrl=${encodedReturnUrl}`}`}
                        onClick={closeDesktopDropdownImmediately}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mt-1"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={() => {
                          closeDesktopDropdownImmediately();
                          signOut({ callbackUrl: fullCurrentPath });
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={loginHref}
                className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setShowMobileNav(!showMobileNav)}
            aria-expanded={showMobileNav}
            aria-label={showMobileNav ? "Close navigation menu" : "Open navigation menu"}
            className="lg:hidden p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {showMobileNav ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer & Backdrop - Portaled to document.body to avoid stacking context & backdrop-filter clipping */}
      {mounted && showMobileNav && createPortal(
        <div className="lg:hidden fixed inset-0 z-[9999] flex flex-col animate-in fade-in duration-200">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setShowMobileNav(false)}
            aria-hidden="true"
          />

          {/* Mobile Menu Panel */}
          <div className="relative z-10 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-left">
            {/* Header bar inside drawer */}
            <div className="h-16 px-4 sm:px-6 flex items-center justify-between border-b border-gray-200/80 dark:border-gray-800 shrink-0">
              <Link
                href="/"
                className="text-xl sm:text-2xl font-bold tracking-tight"
                onClick={() => setShowMobileNav(false)}
              >
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  JEE Challenger
                </span>
              </Link>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  onClick={() => setShowMobileNav(false)}
                  aria-label="Close navigation menu"
                  className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Scrollable Navigation Menu */}
            <div className="overflow-y-auto px-4 py-6 space-y-4 flex-1 text-left">
              <nav className="flex flex-col space-y-1">
                {NavbarItems.map((item, index) => {
                  if (item.type === "link") {
                    const isActive = pathname === item.url;
                    return (
                      <Link
                        key={index}
                        href={item.url}
                        onClick={() => setShowMobileNav(false)}
                        className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                          isActive
                            ? "bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
                            : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      >
                        {item.icon && (
                          <span className={`transition-colors ${
                            isActive
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                          }`}>
                            {item.icon}
                          </span>
                        )}
                        <span>{item.title}</span>
                      </Link>
                    );
                  }

                  if (item.type === "dropdown") {
                    const isMobileOpen = Boolean(mobileDropdownState[index]);
                    const isChildActive = item.items?.some(
                      (sub) => pathname === sub.url || pathname.startsWith(sub.url + "/")
                    );

                    return (
                      <div key={index} className="flex flex-col">
                        <button
                          onClick={() => toggleMobileDropdown(index)}
                          className={`group flex items-center justify-between w-full px-4 py-3 text-base font-medium text-left transition-colors rounded-xl ${
                            isChildActive || isMobileOpen
                              ? "text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30"
                              : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {item.icon && (
                              <span className={`transition-colors ${
                                isChildActive || isMobileOpen
                                  ? "text-blue-600 dark:text-blue-400"
                                  : "text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                              }`}>
                                {item.icon}
                              </span>
                            )}
                            <span>{item.title}</span>
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 transition-all duration-200 ${
                              isMobileOpen ? "rotate-180" : ""
                            } ${
                              isChildActive || isMobileOpen
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-400 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                            }`}
                          />
                        </button>

                        {/* Expandable Accordion Sub-links */}
                        {isMobileOpen && (
                          <div className="pl-10 pr-4 py-1 space-y-1 border-l-2 border-blue-500/50 ml-4 mb-2 text-left">
                            {item.items.map((subitem, subindex) => {
                              const isSubActive = pathname === subitem.url;
                              return (
                                <Link
                                  key={subindex}
                                  href={subitem.url}
                                  onClick={() => setShowMobileNav(false)}
                                  className={`block py-2.5 px-3 rounded-lg text-sm font-medium text-left transition-colors ${
                                    isSubActive
                                      ? "text-blue-600 dark:text-blue-400 font-semibold"
                                      : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                                  }`}
                                >
                                  {subitem.title}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return null;
                })}
              </nav>

              {/* Mobile Auth & Account Info */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex flex-col gap-2">
                {status === "authenticated" ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 dark:bg-gray-800/60 rounded-xl mb-1">
                      {session?.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || "User Profile"}
                          width={36}
                          height={36}
                          unoptimized
                          className="w-9 h-9 rounded-full object-cover border border-gray-300 dark:border-gray-700"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                          {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {session.user?.name || "Student"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {session.user?.email || ""}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/profile${pathname === "/" ? "" : `?returnUrl=${encodedReturnUrl}`}`}
                      onClick={() => setShowMobileNav(false)}
                      className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                        pathname === "/profile"
                          ? "bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <User className={`w-5 h-5 transition-colors ${
                        pathname === "/profile"
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                      }`} />
                      <span>View Profile</span>
                    </Link>

                    <button
                      onClick={() => {
                        setShowMobileNav(false);
                        signOut({ callbackUrl: fullCurrentPath });
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href={loginHref}
                    onClick={() => setShowMobileNav(false)}
                    className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 rounded-xl shadow-md transition-all text-center"
                  >
                    Sign In to Account
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}
