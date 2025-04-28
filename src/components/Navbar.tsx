'use client';

import React from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar = () => {
  return (
    <nav className="bg-black text-white p-8">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold text-[#C6D130]">
          <Link href="/">
            PHAROSDOTMONEY
          </Link>
        </div>
        
        <div className="flex items-center">
          <ConnectButton />
        </div>
        
        <div className="hidden md:flex space-x-6">
          <Link href="/mint" className="hover:text-gray-300 transition duration-300">
            mint
          </Link>
          <Link href="/cap-admin" className="hover:text-gray-300 transition duration-300">
            capadmin
          </Link>
          <Link href="/operator-screen" className="hover:text-gray-300 transition duration-300">
            operaotrscreen
          </Link>
          <Link href="/restaking-screen" className="hover:text-gray-300 transition duration-300">
            restscreen
          </Link>
          <Link href="/usdc" className="hover:text-gray-300 transition duration-300">
            usdc
          </Link>
          <Link href="/lst" className="hover:text-gray-300 transition duration-300">
            lst
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
  );
};

export default Navbar; 