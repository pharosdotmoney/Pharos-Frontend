'use client'

import React, { useState } from 'react'
import Link from 'next/link'

// Mock data for existing loans
const mockLoans = [
  { id: '1', amount: '50000', collateral: '75000', apr: '5.2', status: 'Active', dueDate: '2025-03-15' },
  { id: '2', amount: '25000', collateral: '40000', apr: '4.8', status: 'Active', dueDate: '2025-04-22' },
  { id: '3', amount: '100000', collateral: '150000', apr: '5.5', status: 'Overdue', dueDate: '2024-12-01' },
]

// Mock data for RWA
const rwaData = {
  currentYield: '5.93',
  baseYield: '3.50',
  restaking: {
    totalRestaked: '15,000',
    loanTaken: '8,500',
    loanAvailable: '6,500'
  },
  assets: [
    { id: 1, name: 'US Treasury Bond', amount: '10,000', yield: '4.2%', value: '10,250' },
    { id: 2, name: 'Corporate Bond ETF', amount: '5,000', yield: '5.8%', value: '5,120' },
    { id: 3, name: 'Real Estate Fund', amount: '15,000', yield: '7.1%', value: '15,600' },
  ],
  opportunities: [
    { name: 'US Treasury Bonds', description: 'Low risk government securities', yield: '4.2%' },
    { name: 'Corporate Bond ETF', description: 'Diversified corporate debt', yield: '5.8%' },
    { name: 'Real Estate Fund', description: 'Commercial property portfolio', yield: '7.1%' },
  ]
}

export default function OperatorScreen() {
  const [activeTab, setActiveTab] = useState('rwa')
  const [loanAmount, setLoanAmount] = useState('')
  const [collateralAmount, setCollateralAmount] = useState('')
  const [repayLoanId, setRepayLoanId] = useState('')
  const [repayAmount, setRepayAmount] = useState('')
  
  const handleTakeLoan = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Loan request submitted: $${loanAmount} with $${collateralAmount} collateral`)
    setLoanAmount('')
    setCollateralAmount('')
  }
  
  const handleRepayLoan = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Repayment of $${repayAmount} for loan #${repayLoanId} submitted`)
    setRepayLoanId('')
    setRepayAmount('')
  }
  
  const calculateCollateral = (amount: string) => {
    const loanValue = parseFloat(amount) || 0
    return (loanValue * 1.5).toFixed(2)
  }
  
  const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLoanAmount(value)
    setCollateralAmount(calculateCollateral(value))
  }

  return (
    <div className="min-h-screen bg-black text-white pt-10 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 font-mono" style={{ 
              letterSpacing: '0.05em',
              textShadow: '0.05em 0 0 rgba(255,0,0,0.75), -0.025em -0.05em 0 rgba(0,255,0,0.75), 0.025em 0.05em 0 rgba(0,0,255,0.75)',
              fontFamily: 'monospace'
            }}>
              OPERATOR DASHBOARD
            </h1>
            <p className="text-xl text-gray-300">
              Manage your loans and collateral
            </p>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-800 mb-8">
            <button 
              className={`px-6 py-3 font-medium ${activeTab === 'rwa' ? 'text-[#C6D130] border-b-2 border-[#C6D130]' : 'text-gray-400'}`}
              onClick={() => setActiveTab('rwa')}
            >
              About RWA
            </button>
            <button 
              className={`px-6 py-3 font-medium ${activeTab === 'existing' ? 'text-[#C6D130] border-b-2 border-[#C6D130]' : 'text-gray-400'}`}
              onClick={() => setActiveTab('existing')}
            >
              Existing Loans
            </button>
            <button 
              className={`px-6 py-3 font-medium ${activeTab === 'take' ? 'text-[#C6D130] border-b-2 border-[#C6D130]' : 'text-gray-400'}`}
              onClick={() => setActiveTab('take')}
            >
              Take Loan
            </button>
            <button 
              className={`px-6 py-3 font-medium ${activeTab === 'repay' ? 'text-[#C6D130] border-b-2 border-[#C6D130]' : 'text-gray-400'}`}
              onClick={() => setActiveTab('repay')}
            >
              Repay Loan
            </button>
          </div>
          
          {/* RWA Tab */}
          {activeTab === 'rwa' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Current Yield Box */}
                <div className="bg-black border border-gray-800 p-6 rounded-lg shadow-lg backdrop-blur-sm col-span-2" 
                    style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '10px 10px' }}>
                  <h2 className="text-xl font-semibold mb-4 text-[#C6D130]">Current Yield</h2>
                  <div className="flex items-end mb-6">
                    <span className="text-5xl font-bold text-white">{rwaData.currentYield}%</span>
                    <span className="text-gray-400 ml-2 mb-1">APY</span>
                  </div>
                  
                  <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Base Yield</span>
                      <span className="text-xl font-semibold text-[#C6D130]">{rwaData.baseYield}%</span>
                    </div>
                    <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-[#C6D130]" style={{ width: `${(parseFloat(rwaData.baseYield) / parseFloat(rwaData.currentYield)) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
                
                {/* Restaking Overview */}
                <div className="bg-black border border-gray-800 p-6 rounded-lg shadow-lg backdrop-blur-sm" 
                    style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '10px 10px' }}>
                  <h2 className="text-xl font-semibold mb-4 text-[#C6D130]">Restaking Overview</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400 text-sm">Total Restaked</p>
                      <p className="text-2xl font-bold">${rwaData.restaking.totalRestaked}</p>
                      <div className="mt-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-[#C6D130]" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-gray-400 text-sm">Loan Taken</p>
                      <p className="text-2xl font-bold">${rwaData.restaking.loanTaken}</p>
                      <div className="mt-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500" style={{ width: `${(parseFloat(rwaData.restaking.loanTaken.replace(/,/g, '')) / parseFloat(rwaData.restaking.totalRestaked.replace(/,/g, ''))) * 100}%` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-gray-400 text-sm">Loan Available</p>
                      <p className="text-2xl font-bold">${rwaData.restaking.loanAvailable}</p>
                      <div className="mt-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${(parseFloat(rwaData.restaking.loanAvailable.replace(/,/g, '')) / parseFloat(rwaData.restaking.totalRestaked.replace(/,/g, ''))) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Assets Section */}
              <div className="bg-black border border-gray-800 p-6 rounded-lg shadow-lg backdrop-blur-sm mb-8" 
                  style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '10px 10px' }}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-[#C6D130]">Your Assets</h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-gray-800">
                        <th className="pb-2">Asset</th>
                        <th className="pb-2">Amount (USDC)</th>
                        <th className="pb-2">Yield</th>
                        <th className="pb-2">Current Value</th>
                        <th className="pb-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rwaData.assets.map(asset => (
                        <tr key={asset.id} className="border-b border-gray-800">
                          <td className="py-3">{asset.name}</td>
                          <td className="py-3">${asset.amount}</td>
                          <td className="py-3">{asset.yield}</td>
                          <td className="py-3">${asset.value}</td>
                          <td className="py-3">
                            <button className="text-[#C6D130] hover:underline">Details</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Market Opportunities */}
              <div className="bg-black border border-gray-800 p-6 rounded-lg shadow-lg backdrop-blur-sm" 
                  style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '10px 10px' }}>
                <h2 className="text-xl font-semibold mb-4 text-[#C6D130]">Market Opportunities</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {rwaData.opportunities.map((opportunity, index) => (
                    <div key={index} className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">{opportunity.name}</h3>
                      <p className="text-gray-300 text-sm mb-2">{opportunity.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Yield</span>
                        <span className="text-green-400 font-semibold">{opportunity.yield}</span>
                      </div>
                      <button className="mt-4 w-full py-2 bg-black text-[#C6D130] border border-[#C6D130] rounded hover:bg-[#C6D130] hover:text-black transition-colors">
                        Invest
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Existing Loans Tab */}
          {activeTab === 'existing' && (
            <div>
              <div className="bg-black p-6 rounded-lg border border-gray-800 mb-8"
                style={{ 
                  backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)', 
                  backgroundSize: '10px 10px' 
                }}>
                <h2 className="text-2xl font-bold mb-6">Your Active Loans</h2>
                
                {mockLoans.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-gray-800">
                          <th className="pb-3 pr-4">Loan ID</th>
                          <th className="pb-3 pr-4">Amount (PUSD)</th>
                          <th className="pb-3 pr-4">Collateral (USDC)</th>
                          <th className="pb-3 pr-4">APR (%)</th>
                          <th className="pb-3 pr-4">Status</th>
                          <th className="pb-3 pr-4">Due Date</th>
                          <th className="pb-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockLoans.map(loan => (
                          <tr key={loan.id} className="border-b border-gray-800">
                            <td className="py-4 pr-4">#{loan.id}</td>
                            <td className="py-4 pr-4">${loan.amount}</td>
                            <td className="py-4 pr-4">${loan.collateral}</td>
                            <td className="py-4 pr-4">{loan.apr}%</td>
                            <td className="py-4 pr-4">
                              <span className={`px-2 py-1 rounded text-xs ${loan.status === 'Active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                                {loan.status}
                              </span>
                            </td>
                            <td className="py-4 pr-4">{loan.dueDate}</td>
                            <td className="py-4">
                              <button 
                                onClick={() => {
                                  setActiveTab('repay');
                                  setRepayLoanId(loan.id);
                                  setRepayAmount(loan.amount);
                                }}
                                className="text-[#C6D130] hover:underline"
                              >
                                Repay
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    No active loans found.
                  </div>
                )}
              </div>
              
              <div className="bg-gray-900 p-6 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold">Total Borrowed</h3>
                    <p className="text-2xl text-[#C6D130] mt-2">$175,000</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Total Collateral</h3>
                    <p className="text-2xl text-[#C6D130] mt-2">$265,000</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Health Factor</h3>
                    <p className="text-2xl text-green-400 mt-2">1.51</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Take Loan Tab */}
          {activeTab === 'take' && (
            <div className="bg-black p-8 rounded-lg border border-gray-800"
              style={{ 
                backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)', 
                backgroundSize: '10px 10px' 
              }}>
              <h2 className="text-2xl font-bold mb-6">Take a New Loan</h2>
              
              <form onSubmit={handleTakeLoan}>
                <div className="mb-6">
                  <label className="block text-gray-300 mb-2">Loan Amount (PUSD)</label>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={handleLoanAmountChange}
                    placeholder="Enter loan amount"
                    className="w-full p-4 bg-gray-900 rounded-lg text-white outline-none"
                    min="1000"
                    required
                  />
                  <p className="text-sm text-gray-400 mt-2">Minimum loan amount: 1,000 PUSD</p>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-300 mb-2">Required Collateral (USDC)</label>
                  <input
                    type="number"
                    value={collateralAmount}
                    readOnly
                    className="w-full p-4 bg-gray-900 rounded-lg text-white outline-none"
                  />
                  <p className="text-sm text-gray-400 mt-2">Collateral ratio: 150%</p>
                </div>
                
                <div className="mb-8 p-4 bg-gray-900 rounded-lg">
                  <h3 className="font-bold mb-2">Loan Terms</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400">Interest Rate (APR)</p>
                      <p className="font-medium">5.0%</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Term Length</p>
                      <p className="font-medium">90 days</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Liquidation Threshold</p>
                      <p className="font-medium">120%</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Origination Fee</p>
                      <p className="font-medium">0.5%</p>
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-[#C6D130] text-black py-4 rounded-lg font-bold text-lg hover:bg-opacity-90 transition duration-300"
                >
                  TAKE LOAN
                </button>
              </form>
            </div>
          )}
          
          {/* Repay Loan Tab */}
          {activeTab === 'repay' && (
            <div className="bg-black p-8 rounded-lg border border-gray-800"
              style={{ 
                backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)', 
                backgroundSize: '10px 10px' 
              }}>
              <h2 className="text-2xl font-bold mb-6">Repay Loan</h2>
              
              <form onSubmit={handleRepayLoan}>
                <div className="mb-6">
                  <label className="block text-gray-300 mb-2">Select Loan to Repay</label>
                  <select
                    value={repayLoanId}
                    onChange={(e) => setRepayLoanId(e.target.value)}
                    className="w-full p-4 bg-gray-900 rounded-lg text-white outline-none"
                    required
                  >
                    <option value="">Select a loan</option>
                    {mockLoans.map(loan => (
                      <option key={loan.id} value={loan.id}>
                        Loan #{loan.id} - ${loan.amount} (Due: {loan.dueDate})
                      </option>
                    ))}
                  </select>
                </div>
                
                {repayLoanId && (
                  <>
                    <div className="mb-6">
                      <label className="block text-gray-300 mb-2">Repayment Amount (PUSD)</label>
                      <input
                        type="number"
                        value={repayAmount}
                        onChange={(e) => setRepayAmount(e.target.value)}
                        placeholder="Enter repayment amount"
                        className="w-full p-4 bg-gray-900 rounded-lg text-white outline-none"
                        required
                      />
                      <p className="text-sm text-gray-400 mt-2">
                        Full repayment will release all collateral
                      </p>
                    </div>
                    
                    <div className="mb-8 p-4 bg-gray-900 rounded-lg">
                      <h3 className="font-bold mb-2">Loan Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400">Principal</p>
                          <p className="font-medium">${repayAmount}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Interest Due</p>
                          <p className="font-medium">$250</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Collateral to Release</p>
                          <p className="font-medium">${parseFloat(repayAmount) * 1.5}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Due Date</p>
                          <p className="font-medium">
                            {mockLoans.find(l => l.id === repayLoanId)?.dueDate || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                <button
                  type="submit"
                  className="w-full bg-[#C6D130] text-black py-4 rounded-lg font-bold text-lg hover:bg-opacity-90 transition duration-300"
                  disabled={!repayLoanId}
                >
                  REPAY LOAN
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}