"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Styles from "./Navbar.module.css";
import { FaBars, FaTimes, FaCaretDown, FaHome, FaBook, FaLink, FaGlobe, FaNewspaper } from "react-icons/fa";
import NavbarItems from "./NavbarItems";
import ThemeToggle from "@/components/utils/ThemeToggle";
import { useTheme } from "next-themes";

export default function NavBar() {
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [dropdownState, setDropdownState] = useState({});
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileNav = () => {
    setShowMobileNav(!showMobileNav);
  };

  const toggleDropdown = (index) => {
    setDropdownState((prevState) => {
      const newState = Object.keys(prevState).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});
      return {
        ...newState,
        [index]: !prevState[index],
      };
    });
  };

  const closeMobileNav = () => {
    setShowMobileNav(false);
    setDropdownState({});
  };

  // Icon mapping for navigation items
  const getIcon = (title) => {
    switch (title.toLowerCase()) {
      case 'home':
        return <FaHome />;
      case 'materials':
        return <FaBook />;
      case 'official links':
        return <FaLink />;
      case 'more platforms':
        return <FaGlobe />;
      case 'latest news':
        return <FaNewspaper />;
      default:
        return null;
    }
  };

  return (
    <nav 
      className={`${Styles.navbar} ${isScrolled ? Styles.navbarScrolled : ''}`} 
      role="navigation" 
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className={Styles.navbarLogo}>
        <Link href="/" aria-label="Go to homepage">
          JEE Challenger
        </Link>
      </div>

      {/* Desktop Navigation */}
      <ul className={Styles.navbarLinks} role="menubar">
        {NavbarItems.map((item, index) => {
          if (item.type === "link") {
            return (
              <li key={index} className={Styles.li} role="none">
                <Link 
                  href={item.url} 
                  role="menuitem"
                  aria-label={`Go to ${item.title} page`}
                >
                  {item.title}
                </Link>
              </li>
            );
          } else if (item.type === "dropdown") {
            return (
              <li
                key={index}
                className={Styles.li}
                role="none"
                onMouseLeave={() => toggleDropdown(index)}
              >
                <button
                  className={Styles.columnsDropdown}
                  onMouseEnter={() => toggleDropdown(index)}
                  onClick={() => toggleDropdown(index)}
                  aria-expanded={dropdownState[index]}
                  aria-haspopup="true"
                  aria-label={`Open dropdown for ${item.title} options`}
                  role="menuitem"
                >
                  {item.title}
                  <span
                    className={Styles.columnsDropdownArrow}
                    style={{
                      transform: dropdownState[index] ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    <FaCaretDown />
                  </span>
                </button>
                <div
                  className={Styles.columnsDropdownContent}
                  style={{ height: dropdownState[index] ? 'auto' : '0' }}
                  role="menu"
                  aria-label={`${item.title} submenu`}
                >
                  <ul>
                    {item.items.map((subitem, subindex) => (
                      <li key={subindex} className={Styles.columnsDropdownContentli} role="none">
                        <Link 
                          href={subitem.url} 
                          role="menuitem"
                          aria-label={`Go to ${subitem.title} page`}
                        >
                          {subitem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          }
          return null;
        })}
        <li className={Styles.li} role="none">
          <ThemeToggle />
        </li>
      </ul>

      {/* Mobile Navigation Controls */}
      <div className="flex lg:hidden items-center gap-4">
        <button
          className={Styles.hamburger}
          onClick={toggleMobileNav}
          aria-expanded={showMobileNav}
          aria-label={showMobileNav ? 'Close navigation menu' : 'Open navigation menu'}
          aria-controls="mobile-menu"
        >
          <div className={Styles.hamburgerIcon}>
            <FaBars style={{ opacity: showMobileNav ? 0 : 1 }} />
            <FaTimes style={{ opacity: showMobileNav ? 1 : 0 }} />
          </div>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        id="mobile-menu"
        className={Styles.mobileNav}
        style={{ width: showMobileNav ? '100vw' : '0' }}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <div className={Styles.mobileNavContainer}>
          <button
            className={Styles.mobileCloseButton}
            onClick={closeMobileNav}
            aria-label="Close navigation menu"
          >
            <FaTimes />
          </button>
          <ul className={Styles.mobileNavLinks} role="menu">
            {NavbarItems.map((item, index) => {
              if (item.type === 'link') {
                return (
                  <li key={index} role="none">
                    <Link 
                      href={item.url} 
                      onClick={closeMobileNav}
                      role="menuitem"
                      aria-label={`Go to ${item.title} page`}
                    >
                      {getIcon(item.title)}
                      {item.title}
                    </Link>
                  </li>
                );
              } else if (item.type === 'dropdown') {
                return (
                  <li key={index} className={Styles.mobileDropdown} role="none">
                    <button
                      onClick={(event) => {
                        event.preventDefault();
                        toggleDropdown(index);
                      }}
                      aria-expanded={dropdownState[index]}
                      aria-haspopup="true"
                      aria-label={`Open dropdown for ${item.title} options`}
                      role="menuitem"
                      className={Styles.mobileDropdownButton}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {getIcon(item.title)}
                        {item.title}
                      </span>
                      <span
                        className={Styles.mobileDropdownArrow}
                        style={{
                          transform: dropdownState[index] ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                      >
                        <FaCaretDown />
                      </span>
                    </button>
                    <div
                      className={Styles.columnsDropdownMobile}
                      style={{ maxHeight: dropdownState[index] ? '500px' : '0' }}
                      role="menu"
                      aria-label={`${item.title} submenu`}
                    >
                      <ul>
                        {item.items.map((subitem, subindex) => (
                          <li key={subindex} role="none">
                            <Link 
                              href={subitem.url} 
                              onClick={closeMobileNav}
                              role="menuitem"
                              aria-label={`Go to ${subitem.title} page`}
                            >
                              {subitem.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              }
              return null;
            })}
            <li className={Styles.mobileThemeToggle} role="none">
              <div 
                className={Styles.mobileThemeToggleContainer}
                onClick={() => {
                  // Toggle theme directly using the useTheme hook
                  setTheme(theme === 'dark' ? 'light' : 'dark');
                }}
              >
                <div 
                  className={Styles.mobileThemeToggleIcon}
                  onClick={(e) => {
                    // Prevent the icon click from bubbling up to avoid double toggle
                    e.stopPropagation();
                  }}
                >
                  <ThemeToggle />
                </div>
                <div className={Styles.mobileThemeToggleContent}>
                  <span className={Styles.mobileThemeToggleLabel}>
                    {theme === 'dark' ? 'Change to Light Mode' : 'Change to Dark Mode'}
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
