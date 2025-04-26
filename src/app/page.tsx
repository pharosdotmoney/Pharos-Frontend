'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import StablecoinAnimation from '@/components/StablecoinAnimation';

const HomePage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#C6D130] font-mono" style={{ 
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
      </div>
    </div>
  );
};

export default HomePage;
