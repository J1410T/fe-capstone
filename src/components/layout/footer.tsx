import React from "react";
import { FaGithub, FaTwitter, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-emerald-800 to-emerald-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="text-xl text-white">🧪</div>
              <span className="font-bold text-xl leading-7 text-white">
                SRPM
              </span>
            </div>
            <p className="text-emerald-100 text-sm mb-4">
              A comprehensive platform for researchers to collaborate, track
              progress, and manage scientific projects from inception to
              completion.
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="#"
                className="text-emerald-200 hover:text-white transition-colors"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="#"
                className="text-emerald-200 hover:text-white transition-colors"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="#"
                className="text-emerald-200 hover:text-white transition-colors"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="#"
                className="text-emerald-200 hover:text-white transition-colors"
              >
                <FaEnvelope size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-emerald-200 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-emerald-200 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/projects"
                  className="text-emerald-200 hover:text-white transition-colors"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-emerald-200 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-emerald-200 hover:text-white transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-emerald-200 hover:text-white transition-colors"
                >
                  Research Guidelines
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-emerald-200 hover:text-white transition-colors"
                >
                  Templates
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-emerald-200 hover:text-white transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2 text-emerald-200">
              <li>FPT University</li>
              <li>Hoa Lac High Tech Park, Hanoi, Vietnam</li>
              <li>Email: info@srpm.edu.vn</li>
              <li>Phone: +84 123 456 789</li>
            </ul>
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div className="border-t border-emerald-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-emerald-200 text-sm">
            &copy; {currentYear} SRPM. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6 text-sm">
              <li>
                <a
                  href="#"
                  className="text-emerald-200 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-emerald-200 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-emerald-200 hover:text-white transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
