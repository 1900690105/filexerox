"use client";
import Image from "next/image";
import Link from "next/link";

export const Navbar = () => (
  <nav
    className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 z-50"
    role="navigation"
    aria-label="Main Navigation"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link href="/" tabIndex={0} aria-label="Homepage">
            <Image
              src="/logo.png"
              alt="Site logo"
              height={80}
              width={80}
              className="rounded-full"
              priority
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="hidden md:flex space-x-8 items-center" role="menubar">
          <li role="none">
            <a
              href="#howitworks"
              role="menuitem"
              tabIndex={0}
              className="text-gray-700 hover:text-blue-600 transition-colors focus:outline-none focus-visible:ring-2 ring-blue-400"
            >
              How it Works
            </a>
          </li>
          <li role="none">
            <Link
              href="/xerox"
              role="menuitem"
              tabIndex={0}
              className="text-gray-700 hover:text-blue-600 transition-colors focus:outline-none focus-visible:ring-2 ring-blue-400"
            >
              Xerox
            </Link>
          </li>
          <li role="none">
            <a
              href="/shops"
              role="menuitem"
              tabIndex={0}
              className="text-gray-700 hover:text-blue-600 transition-colors focus:outline-none focus-visible:ring-2 ring-blue-400"
            >
              Shops
            </a>
          </li>
          <li role="none">
            <a
              href="#"
              role="menuitem"
              tabIndex={0}
              className="text-gray-700 hover:text-blue-600 transition-colors focus:outline-none focus-visible:ring-2 ring-blue-400"
            >
              Support
            </a>
          </li>
        </ul>

        {/* Sign In Button */}
        <button
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus-visible:ring-2 ring-purple-500"
          tabIndex={0}
          aria-label="Sign in"
        >
          Sign In
        </button>
      </div>
    </div>
  </nav>
);
