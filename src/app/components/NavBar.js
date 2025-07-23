import Image from "next/image";
import Link from "next/link";

export const Navbar = () => (
  <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center space-x-2">
          <Link href={"/"}>
            <Image
              src={"/logo.png"}
              alt="logo"
              height={80}
              width={80}
              className="rounded-full"
            />
          </Link>
        </div>
        <div className="hidden md:flex space-x-8">
          <a
            href="#howitworks"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            How it Works
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            Xerox
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            Pricing
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            Support
          </a>
        </div>
        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105">
          Sign In
        </button>
      </div>
    </div>
  </nav>
);
