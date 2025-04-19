import React from 'react'
import Link from 'next/link'

const Nav = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link href="/">
            Brand Logo
          </Link>
        </div>
        
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-gray-300 transition duration-300">
            Home
          </Link>
          <Link href="/about" className="hover:text-gray-300 transition duration-300">
            About
          </Link>
          <Link href="/landing" className="hover:text-gray-300 transition duration-300">
            Landing
          </Link>
          <Link href="/contact" className="hover:text-gray-300 transition duration-300">
            Contact
          </Link>
        </div>
        
        <div className="md:hidden">
          {/* Mobile menu button - you can expand this with a dropdown later */}
          <button className="focus:outline-none">
            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
              <path d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Nav