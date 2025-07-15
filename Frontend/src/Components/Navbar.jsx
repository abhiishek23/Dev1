import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-10 bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img className="h-10 w-auto" src="https://tailwindflex.com/images/logo.svg" alt="Logo" />
              <span className="ml-2 text-xl font-bold text-white">Company</span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-10">
              <Link to="/" className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium">Home</Link>
              <Link to="/problems" className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium">Problems</Link>
              <Link to="/contests" className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium">Contests</Link>
              <Link to="/contact" className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium">Contact</Link>
            </div>
          </div>

          <div className="flex items-center">
            <div className="hidden md:ml-4 md:flex md:items-center md:space-x-4">
              <Link to="/login" className="text-white hover:text-gray-300 px-3 py-2 text-sm font-medium">Login</Link>
              <Link to="/signup" className="bg-white text-indigo-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100">Sign Up</Link>
            </div>

            <div className="flex items-center md:hidden">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-300 hover:bg-gray-800 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800 bg-opacity-90">
            <Link to="/" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Home</Link>
            <Link to="/problems" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Problems</Link>
            <Link to="/contests" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Contests</Link>
            <Link to="/contact" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Contact</Link>
            <div className="pt-4 pb-3 border-t border-gray-700">
              <div className="px-5">
                <Link to="/login" className="block w-full text-center text-white bg-gray-700 px-3 py-2 rounded-md text-base font-medium hover:bg-gray-600">Login</Link>
              </div>
              <div className="mt-3 px-5">
                <Link to="/signup" className="block w-full text-center bg-white text-indigo-600 px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100">Sign Up</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
