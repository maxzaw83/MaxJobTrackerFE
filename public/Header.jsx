import React, { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { motion } from "framer-motion";

import MobileMenu from "./MobileMenu";

const MoonIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

const SunIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);
export default function Header({ onLinkClick }) {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    {
      id: "experience",
      name: "Experience",
      icon: "/icons/icon_experience.png",
    },
    {
      id: "skills",
      name: "Skills",
      icon: "/icons/preferences-desktop.png",
    },
    {
      id: "projects",
      name: "Projects",
      icon: "/icons/icon_project.png",
    },
    { id: "awards", name: "Awards", icon: "/icons/award.png" },
    {
      id: "education",
      name: "Education",
      icon: "/icons/icon_education.png",
    },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";
  }, [isMobileMenuOpen]);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Header height offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };
  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "sticky z-50 w-full backdrop-blur-md backdrop-filter bg-background/70 dark:bg-background/40 border-b border-border/40 supports-[backdrop-filter]:bg-background/60"
            : ""
        }`}
      >
        <motion.header
          className=""
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="container mx-auto max-w-7xl px-3 md:px-37 ">
            <div className="flex justify-between items-center h-20">
              <a
                href="#"
                onClick={() => onLinkClick("home")}
                className="text-xl font-bold text-slate-800 dark:text-slate-100 hover:text-indigo-500 dark:hover:text-fuchsia-400   ease-in-out transition-transform hover:scale-103  "
              >
                🌠 Max Zaw
              </a>
              <nav className="hidden md:flex items-center gap-6 ">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => onLinkClick(link.id)}
                    className="flex items-center gap-1 font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-fuchsia-400 transition-transform duration-300 ease-in-out hover:-translate-y-1"
                  >
                    <img
                      src={link.icon}
                      alt={link.name}
                      className="w-6 h-6 hover:scale-110 transition-transform"
                    />
                    {link.name}
                  </button>
                ))}
              </nav>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {theme === "light" ? <MoonIcon /> : <SunIcon />}
              </button>
              {/* Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="md:hidden p-5 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                aria-label="Toggle Menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
              {isMobileMenuOpen && (
                <MobileMenu
                  navLinks={navLinks}
                  onLinkClick={scrollTo}
                  onClose={() => setIsMobileMenuOpen(false)}
                />
              )}
            </div>
          </div>
        </motion.header>
      </header>
    </>
  );
}
