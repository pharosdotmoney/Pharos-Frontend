'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import StablecoinAnimation from '@/components/StablecoinAnimation';
import Link from 'next/link'
import Image from 'next/image'

const HomePage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white">
    {/* Hero Section */}
    <div className="container mx-auto px-4 py-20">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-6xl font-bold mb-4 font-mono" style={{ 
            letterSpacing: '0.05em',
            textShadow: '0.05em 0 0 rgba(255,0,0,0.75), -0.025em -0.05em 0 rgba(0,255,0,0.75), 0.025em 0.05em 0 rgba(0,0,255,0.75)',
            fontFamily: 'monospace'
          }}>
            VERIFIABLE MONEY
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            Stablecoin protocol with credible financial guarantees
          </p>
          <button 
            onClick={() => router.push('/mint')}
            className="px-8 py-3 bg-black text-[#C6D130] text-lg font-semibold border-2 border-[#C6D130] rounded-md hover:bg-[#C6D130] hover:text-black transition-colors shadow-[0_0_15px_rgba(198,209,48,0.7)] hover:shadow-[0_0_25px_rgba(198,209,48,1)]"
          >
            LAUNCH APP
          </button>
        </div>
        
        <div className="md:w-1/2 h-[500px]">
          <StablecoinAnimation />
        </div>
      </div>

      {/* Flow Diagram - Full Width */}
      <div className="w-full mt-20 bg-black p-8 rounded-lg border border-gray-800" style={{
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
        backgroundSize: '10px 10px'
      }}>
        <Image
          src="/flow.png"
          alt="Protocol Flow Diagram"
          width={1200}
          height={600}
          className="w-full rounded-lg shadow-lg"
          priority
          style={{ 
            filter: 'invert(1) hue-rotate(180deg) brightness(2) contrast(1.5)',
            mixBlendMode: 'difference',
            backgroundColor: 'transparent'
          }}
        />

        {/* Diagram Explanation */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[#C6D130]">Collateral Flow</h3>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start">
                <span className="text-[#C6D130] mr-2">1.</span>
                <span>Users deposit LST tokens as collateral into the protocol</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#C6D130] mr-2">2.</span>
                <span>LST tokens are delegated to verified operators for restaking</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#C6D130] mr-2">3.</span>
                <span>Operators provide security across multiple networks</span>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[#C6D130]">Stablecoin Flow</h3>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start">
                <span className="text-[#C6D130] mr-2">4.</span>
                <span>Users receive PUSD stablecoins against their collateral</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#C6D130] mr-2">5.</span>
                <span>PUSD can be deposited into sPUSD vault for yield generation</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#C6D130] mr-2">6.</span>
                <span>Yield is generated from operator rewards and lending markets</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    {/* Why Choose PHAROSDOTMONEY Section */}
    <div className="container mx-auto px-4 py-20 border-t border-gray-800">
      <div className="text-left mb-16">
        <h2 className="text-4xl font-bold mb-4 font-mono" style={{ 
          letterSpacing: '0.05em',
          textShadow: '0.05em 0 0 rgba(255,0,0,0.75), -0.025em -0.05em 0 rgba(0,255,0,0.75), 0.025em 0.05em 0 rgba(0,0,255,0.75)',
          fontFamily: 'monospace'
        }}>
          WHY CHOOSE PHAROSDOTMONEY
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl">
          Earn yield safely while maintaining access to your funds.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Feature Box 1 */}
        <div className="bg-black p-8 rounded-lg border border-gray-800 hover:border-gray-400 transition duration-300 flex flex-col justify-between min-h-[220px]" 
             style={{ 
               backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)', 
               backgroundSize: '10px 10px' 
             }}>
          <h3 className="text-xl font-bold mb-4">NON-CUSTODIAL</h3>
          <p className="text-gray-300">
            No party has access to unsecured user deposits
          </p>
        </div>

        {/* Feature Box 2 */}
        <div className="bg-black p-8 rounded-lg border border-gray-800 hover:border-gray-400 transition duration-300 flex flex-col justify-between min-h-[220px]" 
             style={{ 
               backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)', 
               backgroundSize: '10px 10px' 
             }}>
          <h3 className="text-xl font-bold mb-4">PRIVATE CREDIT</h3>
          <p className="text-gray-300">
            Competitive yield generated by efficient markets
          </p>
        </div>

        {/* Feature Box 3 */}
        <div className="bg-black p-8 rounded-lg border border-gray-800 hover:border-gray-400 transition duration-300 flex flex-col justify-between min-h-[220px]" 
             style={{ 
               backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)', 
               backgroundSize: '10px 10px' 
             }}>
          <h3 className="text-xl font-bold mb-4">FULLY COVERED YIELD</h3>
          <p className="text-gray-300">
            Shared security model underwrites counterparty activity
          </p>
        </div>
      </div>
    </div>

    {/* How PHAROSDOTMONEY Works Section */}
    <div className="container mx-auto px-4 py-20 border-t border-gray-800">
      <div className="text-left mb-16">
        <h2 className="text-4xl font-bold mb-4 font-mono" style={{ 
          letterSpacing: '0.05em',
          textShadow: '0.05em 0 0 rgba(255,0,0,0.75), -0.025em -0.05em 0 rgba(0,255,0,0.75), 0.025em 0.05em 0 rgba(0,0,255,0.75)',
          fontFamily: 'monospace'
        }}>
          HOW PHAROSDOTMONEY WORKS
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Step 1 */}
        <div className="bg-black p-8 rounded-lg border border-gray-800 hover:border-gray-400 transition duration-300 flex flex-col min-h-[220px]" 
             style={{ 
               backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)', 
               backgroundSize: '10px 10px' 
             }}>
          <div className="flex items-center mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-black font-bold text-xl mr-3">
              1
            </div>
            <h3 className="text-xl font-bold">Deposit Collateral</h3>
          </div>
          <p className="text-gray-300">
            Securely deposit your crypto assets as collateral.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-black p-8 rounded-lg border border-gray-800 hover:border-gray-400 transition duration-300 flex flex-col min-h-[220px]" 
             style={{ 
               backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)', 
               backgroundSize: '10px 10px' 
             }}>
          <div className="flex items-center mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-black font-bold text-xl mr-3">
              2
            </div>
            <h3 className="text-xl font-bold">Receive Stablecoins</h3>
          </div>
          <p className="text-gray-300">
            Instantly mint stablecoins that can be used anywhere.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-black p-8 rounded-lg border border-gray-800 hover:border-gray-400 transition duration-300 flex flex-col min-h-[220px]" 
             style={{ 
               backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)', 
               backgroundSize: '10px 10px' 
             }}>
          <div className="flex items-center mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-black font-bold text-xl mr-3">
              3
            </div>
            <h3 className="text-xl font-bold">Earn Yield</h3>
          </div>
          <p className="text-gray-300">
            Earn yield while you hold your stablecoins.
          </p>
        </div>
      </div>
    </div>

    {/* Footer Section */}
    <footer className="mt-20 border-t border-gray-800" style={{
      backgroundColor: '#C6D130',
      boxShadow: 'inset 0 10px 30px -10px rgba(0,0,0,0.3)'
    }}>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-6 md:mb-0">
            <p className="text-sm text-black mb-2 font-medium">
              Stablecoin protocol with credible financial guarantees
            </p>
            <p className="text-xs text-gray-700">
              PHAROSDOTMONEY © 2025 All rights reserved.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-x-8 gap-y-3">
            <Link href="/about" className="text-xs text-gray-800 hover:text-black font-medium transition duration-300">
              WHAT IS PHAROSDOTMONEY
            </Link>
            <Link 
              href="https://deepwiki.com/pharosdotmoney/Pharos-Frontend/1-overview" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs text-gray-800 hover:text-black font-medium transition duration-300"
            >
              DOCUMENTATION
            </Link>
            <Link href="/knowledge" className="text-xs text-gray-800 hover:text-black font-medium transition duration-300">
              KNOWLEDGE BASE
            </Link>
            <Link href="/ecosystem" className="text-xs text-gray-800 hover:text-black font-medium transition duration-300">
              ECOSYSTEM
            </Link>
            <Link href="/media" className="text-xs text-gray-800 hover:text-black font-medium transition duration-300">
              MEDIA KIT
            </Link>
          </div>
        </div>
        
      </div>
    </footer>
  </div>
  );
};

export default HomePage;
