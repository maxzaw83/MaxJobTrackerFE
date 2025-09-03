import React, { useState } from "react";
import { Link } from "react-router-dom";

const Menu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <>
      <header className="bg-black text-white shadow-md">
        <div className="w-full px-2 md:px-35 py-4 flex justify-between items-center">
          <div className="hidden md:block text-lg font-bold tracking-wide px-10 -ml-4">
            Rohingya Association New Zealand
          </div>

          {/* Hamburger button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden focus:outline-none text-white self-start ml-4"
          >
            &#9776;
          </button>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-6 text-sm">
            <Link to="/" className="hover:text-[#FDC700]">
              HOME
            </Link>
            <Link to="/about_us" className="hover:text-[#FDC700]">
              ABOUT US
            </Link>

            <div className="relative group">
              <span className="hover:text-[#FDC700] cursor-pointer flex items-center">
                EVENTS
                <svg
                  className="ml-1 w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.186l3.71-3.955a.75.75 0 111.08 1.04l-4.24 4.52a.75.75 0 01-1.08 0l-4.24-4.52a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <div className="absolute top-full left-0 mt-2 bg-white text-black border rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[180px] z-10">
                <Link
                  to="/upcoming_event"
                  className="block px-5 py-2 hover:bg-gray-100 rounded"
                >
                  UPCOMING EVENT
                </Link>
                <Link
                  to="/past_event"
                  className="block px-5 py-2 hover:bg-gray-100 rounded"
                >
                  PAST EVENT
                </Link>
              </div>
            </div>
            <Link
              to="/news"
              onClick={() => setMenuOpen(false)}
              className="block hover:text-[#FDC700]"
            >
              NEWS
            </Link>
            <Link
              to="/docs"
              onClick={() => setMenuOpen(false)}
              className="block hover:text-[#FDC700]"
            >
              DOCS
            </Link>
            <Link
              to="/gallery"
              onClick={() => setMenuOpen(false)}
              className="block hover:text-[#FDC700]"
            >
              GALLERY
            </Link>

            <Link to="/contact" className="hover:text-[#FDC700]">
              CONTACT US
            </Link>
          </nav>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden px-4 pb-4 text-sm space-y-2 bg-black text-white">
            <Link
              to="/"
              className="block hover:text-[#FDC700]"
              onClick={() => setMenuOpen(false)}
            >
              HOME
            </Link>
            <Link
              to="/about_us"
              onClick={() => setMenuOpen(false)}
              className="block hover:text-[#FDC700]"
            >
              ABOUT US
            </Link>

            {/* Mobile Dropdown Toggle */}
            <div>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full text-left flex items-center justify-between hover:text-[#FDC700]"
              >
                EVENTS
                <span>{dropdownOpen ? "▲" : "▼"}</span>
              </button>
              {dropdownOpen && (
                <div className="ml-4 mt-2 space-y-1">
                  <Link
                    to="/upcoming_event"
                    className="block hover:text-[#FDC700]"
                    onClick={() => setMenuOpen(false)}
                  >
                    UPCOMING EVENT
                  </Link>
                  <Link
                    to="/past_event"
                    className="block hover:text-[#FDC700]"
                    onClick={() => setMenuOpen(false)}
                  >
                    PAST EVENT
                  </Link>
                </div>
              )}
            </div>
            <Link
              to="/news"
              onClick={() => setMenuOpen(false)}
              className="block hover:text-[#FDC700]"
            >
              NEWS
            </Link>
            <Link
              to="/docs"
              onClick={() => setMenuOpen(false)}
              className="block hover:text-[#FDC700]"
            >
              DOCS
            </Link>
            <Link
              to="/gallery"
              onClick={() => setMenuOpen(false)}
              className="block hover:text-[#FDC700]"
            >
              Gallery
            </Link>
            <Link
              to="/contact"
              className="block hover:text-[#FDC700]"
              onClick={() => setMenuOpen(false)}
            >
              CONTACT US
            </Link>
          </div>
        )}
      </header>
    </>
  );
};

export default Menu;
