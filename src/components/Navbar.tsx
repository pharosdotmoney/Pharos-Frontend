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
            PHAROS.MONEY
          </Link>
        </div>
        
        <div className="hidden md:flex space-x-8">
          <Link href="/mint" className="font-medium tracking-wide hover:text-[#C6D130] transition duration-300">
            MINT
          </Link>
          <Link href="/cap-admin" className="font-medium tracking-wide hover:text-[#C6D130] transition duration-300">
            CAP ADMIN
          </Link>
          <Link href="/operator-screen" className="font-medium tracking-wide hover:text-[#C6D130] transition duration-300">
            OPERATOR
          </Link>
          <Link href="/restaking-screen" className="font-medium tracking-wide hover:text-[#C6D130] transition duration-300">
            RESTAKING
          </Link>
          <Link href="/spusd" className="font-medium tracking-wide hover:text-[#C6D130] transition duration-300">
            SPUSD
          </Link>
          <Link href="/usdc" className="font-medium tracking-wide hover:text-[#C6D130] transition duration-300">
            USDC
          </Link>
          <Link href="/lst" className="font-medium tracking-wide hover:text-[#C6D130] transition duration-300">
            LST
          </Link>
        </div>
        
        <div className="flex items-center">
          <ConnectButton />
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