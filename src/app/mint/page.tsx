'use client'

import React, { useState } from 'react'
import Image from 'next/image'

export default function MintPage() {
  const [depositAmount, setDepositAmount] = useState('')
  const [receiveAmount, setReceiveAmount] = useState('')
  
  // Update receive amount when deposit amount changes (1:1 ratio for simplicity)
  const handleDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setDepositAmount(value)
    setReceiveAmount(value) // 1:1 exchange rate for simplicity
  }
  
  const handleMaxClick = () => {
    // This would normally get the user's USDC balance
    const mockBalance = '1000'
    setDepositAmount(mockBalance)
    setReceiveAmount(mockBalance)
  }
  
  const handleMint = (e: React.FormEvent) => {
    e.preventDefault()
    // This would connect to a wallet and execute the mint transaction
    alert(`Minting ${receiveAmount} PUSD from ${depositAmount} USDC`)
    // Reset form after submission
    setDepositAmount('')
    setReceiveAmount('')
  }

  return (
    <div className="min-h-screen bg-black text-white pt-10">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 font-mono" style={{ 
              letterSpacing: '0.05em',
              textShadow: '0.05em 0 0 rgba(255,0,0,0.75), -0.025em -0.05em 0 rgba(0,255,0,0.75), 0.025em 0.05em 0 rgba(0,0,255,0.75)',
              fontFamily: 'monospace'
            }}>
              MINT PUSD
            </h1>
            <p className="text-xl text-gray-300">
              Deposit USDC to mint PUSD stablecoins
            </p>
          </div>
          
          {/* Mint Card */}
          <div className="bg-black p-8 rounded-lg border border-gray-800"
               style={{ 
                 backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)', 
                 backgroundSize: '10px 10px' 
               }}>
            <form onSubmit={handleMint}>
              {/* Deposit Section */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-gray-300">Deposit</label>
                  <button 
                    type="button" 
                    onClick={handleMaxClick}
                    className="text-sm text-[#C6D130] hover:text-white"
                  >
                    MAX
                  </button>
                </div>
                
                <div className="flex items-center p-4 bg-gray-900 rounded-lg">
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={handleDepositChange}
                    placeholder="0.0"
                    className="flex-grow bg-transparent text-2xl outline-none"
                    min="0"
                    step="0.01"
                    required
                  />
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-500 mr-2 flex items-center justify-center">
                      <span className="text-xs font-bold">USDC</span>
                    </div>
                    <span className="font-medium">USDC</span>
                  </div>
                </div>
                
                <div className="text-right mt-2">
                  <span className="text-sm text-gray-400">Balance: 1,000 USDC</span>
                </div>
              </div>
              
              {/* Arrow Down */}
              <div className="flex justify-center mb-8">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>
              
              {/* Receive Section */}
              <div className="mb-8">
                <label className="text-gray-300 mb-2 block">Receive</label>
                <div className="flex items-center p-4 bg-gray-900 rounded-lg">
                  <input
                    type="number"
                    value={receiveAmount}
                    readOnly
                    placeholder="0.0"
                    className="flex-grow bg-transparent text-2xl outline-none"
                  />
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-500 mr-2 flex items-center justify-center">
                      <span className="text-xs font-bold">PUSD</span>
                    </div>
                    <span className="font-medium">PUSD</span>
                  </div>
                </div>
                
                <div className="text-right mt-2">
                  <span className="text-sm text-gray-400">Balance: 0 PUSD</span>
                </div>
              </div>
              
              {/* Exchange Rate */}
              <div className="bg-gray-900 p-4 rounded-lg mb-8">
                <div className="flex justify-between">
                  <span className="text-gray-300">Exchange Rate</span>
                  <span className="font-medium">1 USDC = 1 PUSD</span>
                </div>
              </div>
              
              {/* Mint Button */}
              <button
                type="submit"
                className="w-full bg-[#C6D130] text-black py-4 rounded-lg font-bold text-lg hover:bg-opacity-90 transition duration-300"
              >
                MINT PUSD
              </button>
            </form>
          </div>
          
          {/* Info Section */}
          <div className="mt-8 p-6 border border-gray-800 rounded-lg">
            <h3 className="text-xl font-bold mb-4">About PUSD</h3>
            <p className="text-gray-300 mb-4">
              PUSD is a fully collateralized stablecoin backed by USDC. Each PUSD is backed 1:1 by USDC held in secure smart contracts.
            </p>
            <p className="text-gray-300">
              By minting PUSD, you can earn yield while maintaining the stability of a dollar-pegged asset.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}