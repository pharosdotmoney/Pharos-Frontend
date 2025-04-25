import React from 'react'
import Link from 'next/link'

const Nav = () => {
  return (
    <nav className="bg-black text-white p-8">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold text-[#C6D130]">
          <Link href="/">
           PHAROSDOTMONEY
          </Link>
        </div>
        
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-gray-300 transition duration-300">
            CAP
          </Link>
          <Link href="/about" className="hover:text-gray-300 transition duration-300">
            Documentation
          </Link>
          <Link href="/landing" className="hover:text-gray-300 transition duration-300">
            Base
          </Link>
          <Link href="/contact" className="hover:text-gray-300 transition duration-300">
            Ecosystem
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
      <hr className="border-t border-gray-700 my-2"/>
    </nav>
  )
}

export default Nav