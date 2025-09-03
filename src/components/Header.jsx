import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { FaFacebookF, FaTwitter, FaTelegramPlane } from "react-icons/fa";
import Menu from "../components/Menu";

const Header = () => {
  return (
    <div>
      <header className="shadow-md bg-white fixed w-full z-40">
        <div className="container mx-auto md:px-35 flex items-center justify-between px-4 py-0">
          <div className="flex items-center gap-3 sm:gap-7">
            <a
              href="https://www.facebook.com/brwonztrust"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white border hover:bg-blue-100 text-blue-800"
            >
              <FaFacebookF size={18} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white border hover:bg-blue-100 text-blue-800"
            >
              <FaTwitter size={18} />
            </a>
            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white border hover:bg-blue-100 text-blue-800"
            >
              <FaTelegramPlane size={18} />
            </a>
            <Link
              to="/login"
              className="px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-white bg-blue-500 hover:bg-blue-700 text-sm font-semibold"
            >
              SIGN IN
            </Link>
          </div>
        </div>
        <Menu />
      </header>
    </div>
  );
};

export default Header;
