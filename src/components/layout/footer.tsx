import { Link as LinkIcon, Phone } from "lucide-react";
import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-emerald-800 to-emerald-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        {/* Grid 3 cột đều nhau trên md trở lên */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and description */}
          <div>
            <div className="logo-container mb-4 flex items-center space-x-2">
              <img
                alt="SRPM Logo"
                className="logo-medium"
                src="/images/pg-logo-white.png"
              />
              <span className="font-bold text-xl leading-7 !text-white font-secondary">
                SRPM
              </span>
            </div>
            <p className="text-emerald-100 text-sm">
              A comprehensive platform for researchers to collaborate, track
              progress, and manage scientific projects from inception to
              completion.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <LinkIcon size={20} />
              Quick Links
            </h3>
            <ul className="space-y-2 text-emerald-200">
              <li>
                <a href="#" className="hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Projects
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Phone size={20} />
              Contact Us
            </h3>
            <ul className="space-y-2 text-emerald-200 text-sm">
              <li>FPT University</li>
              <li>
                <a
                  href="https://daihoc.fpt.edu.vn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  daihoc.fpt.edu.vn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-emerald-700 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-emerald-200 text-sm">
            &copy; {currentYear} SRPM. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
