'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'
import { parseUnits, formatUnits } from 'viem'
import LSTJson from '@/contracts/LST.sol/LST.json'
import USDCJson from '@/contracts/USDC.sol/USDC.json'
import LoanManagerJson from '@/contracts/LoanManager.sol/LoanManager.json'
import ContractAddresses from '@/deployed-addresses.json'

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

// Interface for loan data
interface Loan {
  id: string;
  amount: string;
  collateral: string;
  apr: string;
  status: string;
  dueDate: string;
}

export default function OperatorScreen() {
  const [activeTab, setActiveTab] = useState('rwa')
  const [loanAmount, setLoanAmount] = useState('')
  const [collateralAmount, setCollateralAmount] = useState('')
  const [repayLoanId, setRepayLoanId] = useState('')
  const [repayAmount, setRepayAmount] = useState('')
  const [mockLoans, setMockLoans] = useState<Loan[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState({ show: false, message: '', type: '' })
  const [lstBalance, setLstBalance] = useState('0')
  const [usdcBalance, setUsdcBalance] = useState('0')
  
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()
  
  // Fetch balances and active loans
  useEffect(() => {
    if (isConnected && address && publicClient) {
      fetchBalances()
      fetchActiveLoans()
    }
  }, [address, isConnected, publicClient])
  
  // Fetch LST and USDC balances
  const fetchBalances = async () => {
    if (!address || !publicClient) return
    
    try {
      // Fetch LST balance
      const lstBalanceData = await publicClient.readContract({
        address: ContractAddresses.LST as `0x${string}`,
        abi: LSTJson.abi,
        functionName: 'balanceOf',
        args: [address]
      })
      
      setLstBalance(formatUnits(lstBalanceData as bigint, 18))
      
      // Fetch USDC balance
      const usdcBalanceData = await publicClient.readContract({
        address: ContractAddresses.USDC as `0x${string}`,
        abi: USDCJson.abi,
        functionName: 'balanceOf',
        args: [address]
      })
      
      setUsdcBalance(formatUnits(usdcBalanceData as bigint, 6))
    } catch (err) {
      console.error('Error fetching balances:', err)
    }
  }
  
  // Fetch active loans from LoanManager contract
  const fetchActiveLoans = async () => {
    if (!address || !publicClient) return;
    
    try {
      console.log("Fetching active loans for address:", address);
      
      // For testing purposes, add a mock loan to ensure we have data to display
      // Remove this in production
      const mockLoan = {
        id: '1',
        amount: '1000',
        collateral: '1500',
        apr: '5.00',
        status: 'Active',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
      };
      
      setMockLoans([mockLoan]);
      console.log("Added mock loan for testing:", mockLoan);
      
      
    } catch (err) {
      console.error('Error fetching active loans:', err);
    }
  };
  
  // Show notification
  const showNotification = (message: string, type: string) => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' })
    }, 5000)
  }
  
  // Handle loan amount change and calculate required collateral
  const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLoanAmount(value)
    setCollateralAmount(calculateCollateral(value))
  }
  
  // Calculate required collateral (LST) based on loan amount (USDC)
  const calculateCollateral = (amount: string) => {
    const loanValue = parseFloat(amount) || 0
    return (loanValue * 1.5).toFixed(2)
  }
  
  // Handle take loan action
  const handleTakeLoan = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!loanAmount || parseFloat(loanAmount) <= 0) {
      showNotification('Please enter a valid loan amount', 'error')
      return
    }
    
    if (!walletClient || !publicClient) {
      showNotification('Wallet not connected properly', 'error')
      return
    }
    
    setIsLoading(true)
    try {

      
      // Now call createLoan on LoanManager contract
      const { request } = await publicClient.simulateContract({
        address: ContractAddresses.LoanManager as `0x${string}`,
        abi: LoanManagerJson.abi,
        functionName: 'createLoan',
        args: [parseUnits(loanAmount, 6)],
        account: address
      })
      
      const hash = await walletClient.writeContract(request)
      await publicClient.waitForTransactionReceipt({ hash })
      
      // Update balances and loans
      fetchBalances()
      fetchActiveLoans()
      
      showNotification(`Successfully created loan for ${loanAmount} USDC`, 'success')
      setLoanAmount('')
      setCollateralAmount('')
    } catch (error: any) {
      console.error('Error creating loan:', error)
      showNotification(error.message || 'Failed to create loan', 'error')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Handle repay loan action
  const handleRepayLoan = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!repayLoanId) {
      showNotification('Please select a loan to repay', 'error')
      return
    }
    
    if (!repayAmount || parseFloat(repayAmount) <= 0) {
      showNotification('Please enter a valid repayment amount', 'error')
      return
    }
    
    if (!walletClient || !publicClient) {
      showNotification('Wallet not connected properly', 'error')
      return
    }
    
    setIsLoading(true)
    try {
      
      
      // Now call repayLoan on LoanManager contract
      const { request } = await publicClient.simulateContract({
        address: ContractAddresses.LoanManager as `0x${string}`,
        abi: LoanManagerJson.abi,
        functionName: 'repayLoan',
        args: [],
        account: address
      })
      
      const hash = await walletClient.writeContract(request)
      await publicClient.waitForTransactionReceipt({ hash })
      
      // Update balances and loans
      fetchBalances()
      fetchActiveLoans()
      
      showNotification(`Successfully repaid ${repayAmount} USDC for loan #${repayLoanId}`, 'success')
      setRepayLoanId('')
      setRepayAmount('')
    } catch (error: any) {
      console.error('Error repaying loan:', error)
      showNotification(error.message || 'Failed to repay loan', 'error')
    } finally {
      setIsLoading(false)
    }
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
          
          {/* Notification */}
          {notification.show && (
            <div className={`mb-6 p-3 rounded-md ${notification.type === 'error' ? 'bg-red-900 bg-opacity-50 text-red-200' : 'bg-green-900 bg-opacity-50 text-green-200'}`}>
              {notification.message}
            </div>
          )}
          
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
                          <th className="pb-3 pr-4">Amount (USDC)</th>
                          <th className="pb-3 pr-4">Delegation (LST)</th>
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
                    <h3 className="text-xl font-bold">Your LST Balance</h3>
                    <p className="text-2xl text-[#C6D130] mt-2">{lstBalance} LST</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Your USDC Balance</h3>
                    <p className="text-2xl text-[#C6D130] mt-2">{usdcBalance} USDC</p>
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
                  <label className="block text-gray-300 mb-2">Loan Amount (USDC)</label>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={handleLoanAmountChange}
                    placeholder="Enter loan amount"
                    className="w-full p-4 bg-gray-900 rounded-lg text-white outline-none"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-300 mb-2">Required Delegation (LST)</label>
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
                  disabled={isLoading}
                  className={`w-full bg-[#C6D130] text-black py-4 rounded-lg font-bold text-lg hover:bg-opacity-90 transition duration-300 ${isLoading ? 'opacity-70' : ''}`}
                >
                  {isLoading ? 'PROCESSING...' : 'TAKE LOAN'}
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
              
              {mockLoans && mockLoans.length > 0 ? (
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
                          Loan #{loan.id} - {loan.amount} USDC (Due: {loan.dueDate})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {repayLoanId && (
                    <>
                      <div className="mb-6">
                        <label className="block text-gray-300 mb-2">Repayment Amount (USDC)</label>
                        <input
                          type="number"
                          value={repayAmount}
                          onChange={(e) => setRepayAmount(e.target.value)}
                          placeholder="Enter repayment amount"
                          className="w-full p-4 bg-gray-900 rounded-lg text-white outline-none"
                          required
                        />
                        <p className="text-sm text-gray-400 mt-2">
                          Full repayment will release all delegation
                        </p>
                      </div>
                      
                      <div className="mb-8 p-4 bg-gray-900 rounded-lg">
                        <h3 className="font-bold mb-2">Loan Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {mockLoans.find(l => l.id === repayLoanId) && (
                            <>
                              <div>
                                <p className="text-gray-400">Principal</p>
                                <p className="font-medium">{mockLoans.find(l => l.id === repayLoanId)?.amount} USDC</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Interest Due</p>
                                <p className="font-medium">{(parseFloat(mockLoans.find(l => l.id === repayLoanId)?.amount || '0') * 0.05).toFixed(2)} USDC</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Delegation to Release</p>
                                <p className="font-medium">{mockLoans.find(l => l.id === repayLoanId)?.collateral} LST</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Due Date</p>
                                <p className="font-medium">
                                  {mockLoans.find(l => l.id === repayLoanId)?.dueDate || 'N/A'}
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                  
                  <button
                    type="submit"
                    className="w-full bg-[#C6D130] text-black py-4 rounded-lg font-bold text-lg hover:bg-opacity-90 transition duration-300"
                    disabled={!repayLoanId || isLoading}
                  >
                    {isLoading ? 'PROCESSING...' : 'REPAY LOAN'}
                  </button>
                </form>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p className="mb-4">No active loans found to repay.</p>
                  <button
                    onClick={() => setActiveTab('take')}
                    className="px-6 py-2 bg-[#C6D130] text-black rounded-lg font-medium hover:bg-opacity-90 transition duration-300"
                  >
                    Take a New Loan
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}