'use client'

import React, { useState } from 'react'

// Mock data for operators
const mockOperators = [
  { id: '1', name: 'Operator Alpha', address: '0x1a2b...3c4d', collateral: '500000', status: 'Active', loans: 3 },
  { id: '2', name: 'Operator Beta', address: '0x5e6f...7g8h', collateral: '750000', status: 'Active', loans: 5 },
  { id: '3', name: 'Operator Gamma', address: '0x9i0j...1k2l', collateral: '250000', status: 'Probation', loans: 1 },
]

export default function CapAdminScreen() {
  const [activeTab, setActiveTab] = useState('operators')
  const [baseRate, setBaseRate] = useState('5.0')
  const [slashOperatorId, setSlashOperatorId] = useState('')
  const [slashAmount, setSlashAmount] = useState('')
  const [slashReason, setSlashReason] = useState('')
  const [newOperatorName, setNewOperatorName] = useState('')
  const [newOperatorAddress, setNewOperatorAddress] = useState('')
  const [newOperatorCollateral, setNewOperatorCollateral] = useState('')
  
  const handleBaseRateChange = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Base rate updated to ${baseRate}%`)
  }
  
  const handleSlashOperator = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Operator #${slashOperatorId} slashed for $${slashAmount}. Reason: ${slashReason}`)
    setSlashOperatorId('')
    setSlashAmount('')
    setSlashReason('')
  }
  
  const handleOnboardOperator = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`New operator onboarded: ${newOperatorName} (${newOperatorAddress}) with $${newOperatorCollateral} collateral`)
    setNewOperatorName('')
    setNewOperatorAddress('')
    setNewOperatorCollateral('')
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
              CAP ADMIN DASHBOARD
            </h1>
            <p className="text-xl text-gray-300">
              Manage protocol parameters and operators
            </p>
          </div>
          
          {/* Admin Badge */}
          <div className="flex justify-center mb-8">
            <div className="px-4 py-2 bg-[#C6D130] text-black rounded-full font-bold text-sm">
              ADMIN ACCESS
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-800 mb-8">
            <button 
              className={`px-6 py-3 font-medium ${activeTab === 'operators' ? 'text-[#C6D130] border-b-2 border-[#C6D130]' : 'text-gray-400'}`}
              onClick={() => setActiveTab('operators')}
            >
              Operators
            </button>
            <button 
              className={`px-6 py-3 font-medium ${activeTab === 'rates' ? 'text-[#C6D130] border-b-2 border-[#C6D130]' : 'text-gray-400'}`}
              onClick={() => setActiveTab('rates')}
            >
              Base Rate
            </button>
            <button 
              className={`px-6 py-3 font-medium ${activeTab === 'slash' ? 'text-[#C6D130] border-b-2 border-[#C6D130]' : 'text-gray-400'}`}
              onClick={() => setActiveTab('slash')}
            >
              Slash Operator
            </button>
            <button 
              className={`px-6 py-3 font-medium ${activeTab === 'onboard' ? 'text-[#C6D130] border-b-2 border-[#C6D130]' : 'text-gray-400'}`}
              onClick={() => setActiveTab('onboard')}
            >
              Onboard Operator
            </button>
          </div>
          
          {/* Operators Tab */}
          {activeTab === 'operators' && (
            <div className="bg-black p-6 rounded-lg border border-gray-800"
              style={{ 
                backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)', 
                backgroundSize: '10px 10px' 
              }}>
              <h2 className="text-2xl font-bold mb-6">Active Operators</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-800">
                      <th className="pb-3 pr-4">ID</th>
                      <th className="pb-3 pr-4">Name</th>
                      <th className="pb-3 pr-4">Address</th>
                      <th className="pb-3 pr-4">Collateral</th>
                      <th className="pb-3 pr-4">Status</th>
                      <th className="pb-3 pr-4">Active Loans</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockOperators.map(operator => (
                      <tr key={operator.id} className="border-b border-gray-800">
                        <td className="py-4 pr-4">#{operator.id}</td>
                        <td className="py-4 pr-4">{operator.name}</td>
                        <td className="py-4 pr-4">{operator.address}</td>
                        <td className="py-4 pr-4">${operator.collateral}</td>
                        <td className="py-4 pr-4">
                          <span className={`px-2 py-1 rounded text-xs ${operator.status === 'Active' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                            {operator.status}
                          </span>
                        </td>
                        <td className="py-4 pr-4">{operator.loans}</td>
                        <td className="py-4">
                          <button 
                            onClick={() => {
                              setActiveTab('slash');
                              setSlashOperatorId(operator.id);
                            }}
                            className="text-[#C6D130] hover:underline mr-3"
                          >
                            Slash
                          </button>
                          <button className="text-gray-400 hover:text-white hover:underline">
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-8 p-4 bg-gray-900 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold">Total Operators</h3>
                    <p className="text-xl text-[#C6D130] mt-1">{mockOperators.length}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Total Collateral</h3>
                    <p className="text-xl text-[#C6D130] mt-1">
                      ${mockOperators.reduce((sum, op) => sum + parseInt(op.collateral), 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Total Loans</h3>
                    <p className="text-xl text-[#C6D130] mt-1">
                      {mockOperators.reduce((sum, op) => sum + op.loans, 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Base Rate Tab */}
          {activeTab === 'rates' && (
            <div className="bg-black p-8 rounded-lg border border-gray-800"
              style={{ 
                backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)', 
                backgroundSize: '10px 10px' 
              }}>
              <h2 className="text-2xl font-bold mb-6">Set Base Interest Rate</h2>
              
              <form onSubmit={handleBaseRateChange}>
                <div className="mb-8">
                  <label className="block text-gray-300 mb-2">Base Interest Rate (APR %)</label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={baseRate}
                      onChange={(e) => setBaseRate(e.target.value)}
                      placeholder="Enter base rate"
                      className="flex-grow p-4 bg-gray-900 rounded-l-lg text-white outline-none"
                      min="0"
                      max="100"
                      step="0.1"
                      required
                    />
                    <div className="bg-gray-800 p-4 rounded-r-lg">
                      <span className="text-xl font-bold">%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">Current base rate: 5.0%</p>
                </div>
                
                <div className="mb-8 p-4 bg-gray-900 rounded-lg">
                  <h3 className="font-bold mb-2">Rate Impact Analysis</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400">Operator Margin</p>
                      <p className="font-medium">+2.0%</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Effective Borrower Rate</p>
                      <p className="font-medium">{(parseFloat(baseRate) + 2.0).toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Protocol Fee</p>
                      <p className="font-medium">0.5%</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Yield to Stablecoin Holders</p>
                      <p className="font-medium">{(parseFloat(baseRate) * 0.8).toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-[#C6D130] text-black py-4 rounded-lg font-bold text-lg hover:bg-opacity-90 transition duration-300"
                >
                  UPDATE BASE RATE
                </button>
              </form>
            </div>
          )}
          
          {/* Slash Operator Tab */}
          {activeTab === 'slash' && (
            <div className="bg-black p-8 rounded-lg border border-gray-800"
              style={{ 
                backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)', 
                backgroundSize: '10px 10px' 
              }}>
              <h2 className="text-2xl font-bold mb-6">Slash Operator</h2>
              
              <form onSubmit={handleSlashOperator}>
                <div className="mb-6">
                  <label className="block text-gray-300 mb-2">Select Operator</label>
                  <select
                    value={slashOperatorId}
                    onChange={(e) => setSlashOperatorId(e.target.value)}
                    className="w-full p-4 bg-gray-900 rounded-lg text-white outline-none"
                    required
                  >
                    <option value="">Select an operator</option>
                    {mockOperators.map(operator => (
                      <option key={operator.id} value={operator.id}>
                        {operator.name} (#{operator.id}) - ${operator.collateral} collateral
                      </option>
                    ))}
                  </select>
                </div>
                
                {slashOperatorId && (
                  <>
                    <div className="mb-6">
                      <label className="block text-gray-300 mb-2">Slash Amount (USDC)</label>
                      <input
                        type="number"
                        value={slashAmount}
                        onChange={(e) => setSlashAmount(e.target.value)}
                        placeholder="Enter amount to slash"
                        className="w-full p-4 bg-gray-900 rounded-lg text-white outline-none"
                        min="1"
                        required
                      />
                      <div className="flex justify-between mt-2">
                        <p className="text-sm text-gray-400">
                          Available collateral: $
                          {mockOperators.find(op => op.id === slashOperatorId)?.collateral || '0'}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            const operator = mockOperators.find(op => op.id === slashOperatorId);
                            if (operator) setSlashAmount(operator.collateral);
                          }}
                          className="text-sm text-[#C6D130] hover:underline"
                        >
                          Slash All
                        </button>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-gray-300 mb-2">Reason for Slashing</label>
                      <textarea
                        value={slashReason}
                        onChange={(e) => setSlashReason(e.target.value)}
                        placeholder="Provide a reason for slashing this operator"
                        className="w-full p-4 bg-gray-900 rounded-lg text-white outline-none min-h-[100px]"
                        required
                      />
                    </div>
                    
                    <div className="mb-8 p-4 bg-red-900 bg-opacity-30 border border-red-800 rounded-lg">
                      <h3 className="font-bold mb-2 text-red-400">Warning</h3>
                      <p className="text-gray-300">
                        Slashing an operator is a severe action that will reduce their collateral and may affect their status. 
                        This action is recorded on-chain and cannot be reversed.
                      </p>
                    </div>
                  </>
                )}
                
                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition duration-300"
                  disabled={!slashOperatorId || !slashAmount || !slashReason}
                >
                  CONFIRM SLASH
                </button>
              </form>
            </div>
          )}
          
          {/* Onboard Operator Tab */}
          {activeTab === 'onboard' && (
            <div className="bg-black p-8 rounded-lg border border-gray-800"
              style={{ 
                backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)', 
                backgroundSize: '10px 10px' 
              }}>
              <h2 className="text-2xl font-bold mb-6">Onboard New Operator</h2>
              
              <form onSubmit={handleOnboardOperator}>
                <div className="mb-6">
                  <label className="block text-gray-300 mb-2">Operator Name</label>
                  <input
                    type="text"
                    value={newOperatorName}
                    onChange={(e) => setNewOperatorName(e.target.value)}
                    placeholder="Enter operator name"
                    className="w-full p-4 bg-gray-900 rounded-lg text-white outline-none"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-300 mb-2">Wallet Address</label>
                  <input
                    type="text"
                    value={newOperatorAddress}
                    onChange={(e) => setNewOperatorAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full p-4 bg-gray-900 rounded-lg text-white outline-none"
                    pattern="0x[a-fA-F0-9]{40}"
                    required
                  />
                  <p className="text-sm text-gray-400 mt-2">Enter a valid Ethereum address</p>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-300 mb-2">Required Collateral (USDC)</label>
                  <input
                    type="number"
                    value={newOperatorCollateral}
                    onChange={(e) => setNewOperatorCollateral(e.target.value)}
                    placeholder="Enter required collateral"
                    className="w-full p-4 bg-gray-900 rounded-lg text-white outline-none"
                    min="100000"
                    required
                  />
                  <p className="text-sm text-gray-400 mt-2">Minimum required: $100,000 USDC</p>
                </div>
                
                <div className="mb-8 p-4 bg-gray-900 rounded-lg">
                  <h3 className="font-bold mb-2">Operator Parameters</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400">Initial Status</p>
                      <p className="font-medium">Probation (30 days)</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Loan Limit</p>
                      <p className="font-medium">3x Collateral</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Margin</p>
                      <p className="font-medium">2.0% above base rate</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Liquidation Threshold</p>
                      <p className="font-medium">110% collateralization</p>
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-[#C6D130] text-black py-4 rounded-lg font-bold text-lg hover:bg-opacity-90 transition duration-300"
                >
                  ONBOARD OPERATOR
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}