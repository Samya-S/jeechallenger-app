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
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollY > 20);
    };

    handleScroll();

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

  const isLandingPage = pathname === "/";
  const isFloating = (isLandingPage || isScrolled) && !showMobileNav;

  return (
    <header
      ref={navRef}
      className={`${
        isLandingPage ? "fixed top-0 left-0 right-0" : "sticky top-0"
      } z-50 w-full transition-[padding] duration-300 ease-out ${
        isFloating
          ? "pointer-events-none pt-2 px-3 sm:pt-3 sm:px-6 lg:px-8"
          : "pointer-events-auto pt-0 px-0"
      }`}
    >
      <div
        className={`w-full mx-auto flex items-center justify-between pointer-events-auto transform-gpu transition-all duration-300 ease-out border ${
          isFloating
            ? "max-w-7xl h-14 px-3.5 sm:px-6 rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-gray-200/80 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] ring-1 ring-black/5 dark:ring-0"
            : `max-w-full h-16 px-4 sm:px-6 lg:px-8 rounded-none ${
                showMobileNav
                  ? "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 border-t-transparent border-x-transparent"
                  : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-transparent border-b-gray-200/60 dark:border-b-gray-800/80"
              } shadow-none ring-0`
        }`}
      >
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="group flex items-center gap-2 text-lg sm:text-2xl font-bold tracking-tight"
            aria-label="JEE Challenger Homepage"
            onClick={() => {
              closeDesktopDropdownImmediately();
              setShowMobileNav(false);
            }}
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
                      <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200/90 dark:border-gray-800 shadow-xl ring-1 ring-black/5 dark:ring-0 p-1.5 backdrop-blur-xl flex flex-col gap-1">
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
                    <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200/90 dark:border-gray-800 shadow-xl ring-1 ring-black/5 dark:ring-0 p-1.5 backdrop-blur-xl flex flex-col gap-1">
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
            className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition-colors"
          >
            <span
              className={`w-5 h-0.5 bg-current rounded-full transform transition-all duration-300 ease-in-out ${
                showMobileNav ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`w-5 h-0.5 bg-current rounded-full transition-all duration-300 ease-in-out ${
                showMobileNav ? "opacity-0 scale-0" : "opacity-100 scale-100"
              }`}
            />
            <span
              className={`w-5 h-0.5 bg-current rounded-full transform transition-all duration-300 ease-in-out ${
                showMobileNav ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Drawer & Backdrop - Portaled to document.body */}
      {mounted && createPortal(
        <div
          className="lg:hidden fixed inset-0 z-40 pointer-events-none"
          aria-hidden={!showMobileNav}
        >
          {/* Backdrop Overlay - strictly below navbar */}
          <div
            className={`fixed top-16 inset-x-0 bottom-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
              showMobileNav ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setShowMobileNav(false)}
            aria-hidden="true"
          />

          {/* Mobile Menu Panel - Adapts to content height up to max viewport height with curved bottom */}
          <div
            className={`fixed top-16 inset-x-0 max-h-[calc(100dvh-4rem)] z-45 bg-white dark:bg-gray-900 border-b border-gray-200/90 dark:border-gray-800 shadow-2xl rounded-b-3xl flex flex-col overflow-hidden text-left transform-gpu transition-all duration-300 ease-in-out ${
              showMobileNav
                ? "translate-y-0 opacity-100 pointer-events-auto"
                : "-translate-y-4 opacity-0 pointer-events-none"
            }`}
          >
            {/* Scrollable Navigation Menu */}
            <div className="overflow-y-auto overscroll-contain px-4 pt-4 pb-6 space-y-4 flex-1 text-left">
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

                        {/* Expandable Accordion Sub-links with smooth height & opacity transition */}
                        <div
                          className={`grid transition-all duration-200 ease-out pl-6 sm:pl-10 pr-4 border-l-2 border-blue-500/50 ml-4 ${
                            isMobileOpen
                              ? "grid-rows-[1fr] opacity-100 py-1 mb-2"
                              : "grid-rows-[0fr] opacity-0 py-0 mb-0 pointer-events-none"
                          }`}
                        >
                          <div className="overflow-hidden space-y-1">
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
                        </div>
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
