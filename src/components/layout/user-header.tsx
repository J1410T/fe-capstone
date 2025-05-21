import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBell, FaBars, FaTimes, FaUser } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { FiSettings } from "react-icons/fi";
import { BiLogOut } from "react-icons/bi";
import { AiFillHome } from "react-icons/ai";
import { MdSpaceDashboard } from "react-icons/md";
import { RiFoldersFill, RiLogoutBoxRLine } from "react-icons/ri";
import { IoSettingsSharp } from "react-icons/io5";
import { useAuth } from "@/contexts/AuthContext";

const menuItems: string[] = ["Home", "Dashboard", "Projects", "Tasks"];

function UserHeader() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  return (
    <header
      className="w-full border-b border-gray-200 bg-white fixed top-0 left-0 right-0 z-20"
      style={{ height: "65px" }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between">
        {/* Left: Logo + Menu */}
        <div className="flex items-center space-x-10 h-full">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="text-xl text-emerald-600">🧪</div>
            <span className="font-bold text-xl leading-7 text-gray-800">
              SRPM
            </span>
          </div>
          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center space-x-6 h-full">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href="#"
                className="text-sm leading-5 font-medium h-full px-1 flex items-center text-gray-600 border-b-2 border-transparent hover:border-emerald-500 hover:text-black transition-all duration-200"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
        {/* Right (Desktop) */}
        <div className="hidden lg:flex items-center gap-6 relative">
          {/* Register Button */}
          {/* <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded transition-all duration-200">
            Register New Project
          </button> */}
          {/* Notification Icon */}
          <div className="relative">
            <FaBell className="text-lg text-gray-800 cursor-pointer" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full transform translate-x-1/2 -translate-y-1/2"></span>
          </div>
          {/* Avatar Dropdown */}
          <div className="relative">
            <img
              src={
                user
                  ? user.avatar
                  : "https://media.istockphoto.com/id/1180524517/vector/symbol-of-science-research-atom-logo-vector-icon-illustration-electrons-rotate-in-orbits.jpg?s=612x612&w=0&k=20&c=qQyhlNKferK_11yFIfwP947UgAn6sHA55kb-JNb_6mc="
              }
              className="w-8 h-8 rounded-full bg-gray-200 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            ></img>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded shadow-lg p-4 z-10"
                >
                  <div className="mb-3">
                    <div className="font-semibold text-gray-800">
                      Dr. Sarah Johnson
                    </div>
                    <div className="text-sm text-gray-500">
                      sarah.johnson@fe.edu.vn
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-700">
                    <a
                      href="#"
                      className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 transition-all"
                    >
                      <MdDashboard /> Dashboard
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 transition-all"
                    >
                      <FaUser /> Profile
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 transition-all"
                    >
                      <FiSettings /> Settings
                    </a>
                    <a
                      onClick={logout}
                      className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 transition-all"
                    >
                      <BiLogOut /> Log out
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden focus:outline-none"
        >
          {menuOpen ? (
            <FaTimes className="text-xl" />
          ) : (
            <FaBars className="text-xl" />
          )}
        </button>
      </div>
      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-gray-200 px-4 pb-4 overflow-hidden"
          >
            {/* Avatar Info */}
            <div className="py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              <div>
                <div className="font-semibold text-gray-800">
                  Dr. Sarah Johnson
                </div>
                <div className="text-sm text-gray-500">
                  sarah.johnson@fe.edu.vn
                </div>
              </div>
            </div>
            {/* Register Button */}
            {/* <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded mb-3 transition-all duration-200">
              Register New Project
            </button> */}
            {/* Menu Items */}
            <div className="space-y-2">
              <a
                href="#"
                className="flex items-center gap-2 py-2 px-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-all"
              >
                <AiFillHome /> Home
              </a>
              <a
                href="#"
                className="flex items-center gap-2 py-2 px-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-all"
              >
                <MdSpaceDashboard /> Dashboard
              </a>
              <a
                href="#"
                className="flex items-center gap-2 py-2 px-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-all"
              >
                <RiFoldersFill /> Projects
              </a>
              <a
                href="#"
                className="flex items-center gap-2 py-2 px-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-all"
              >
                <IoSettingsSharp /> Settings
              </a>
              <a
                onClick={logout}
                className="flex items-center gap-2 py-2 px-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-all"
              >
                <RiLogoutBoxRLine /> Log out
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default UserHeader;
