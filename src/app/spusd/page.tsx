'use client'

import React, { useState, useEffect } from 'react'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'
import { parseUnits, formatUnits } from 'viem'
import USDCJson from '@/contracts/USDC.sol/USDC.json'
import sPUSDJson from '@/contracts/sPUSD.sol/sPUSD.json'
import ContractAddresses from '@/deployed-addresses.json'

const SPUSDPage = () => {
  const [activeTab, setActiveTab] = useState('deposit')
  const [amount, setAmount] = useState('')
  const [usdcBalance, setUsdcBalance] = useState('0')
  const [spusdBalance, setSpusdBalance] = useState('0')
  const [shareBalance, setShareBalance] = useState('0')
  const [conversionRate, setConversionRate] = useState('1')
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState({ show: false, message: '', type: '' })
  
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  // Fetch balances and conversion rate
  const fetchVaultData = async () => {
    if (!address || !publicClient) return
    
    try {
      // Fetch USDC balance (asset)
      const usdcBalanceData = await publicClient.readContract({
        address: ContractAddresses.USDC as `0x${string}`,
        abi: USDCJson.abi,
        functionName: 'balanceOf',
        args: [address]
      })
      setUsdcBalance(formatUnits(usdcBalanceData as bigint, 6))
      
      // Fetch sPUSD balance (shares) - use 6 decimals instead of 18
      const shareBalanceData = await publicClient.readContract({
        address: ContractAddresses.sPUSD as `0x${string}`,
        abi: sPUSDJson.abi,
        functionName: 'balanceOf',
        args: [address]
      })
      setShareBalance(formatUnits(shareBalanceData as bigint, 6)) // Changed to 6 decimals

      // For 1:1 ratio, we don't need complex conversion calculations
      setConversionRate('1')

      // Preview shares for current amount if depositing
      if (amount && activeTab === 'deposit') {
        // For 1:1 ratio, shares will equal assets
        setSpusdBalance(amount)
      }

      // Preview assets for current amount if withdrawing
      if (amount && activeTab === 'withdraw') {
        // For 1:1 ratio, assets will equal shares
        setSpusdBalance(amount)
      }
    } catch (err) {
      console.error('Error fetching vault data:', err)
    }
  }

  useEffect(() => {
    if (isConnected && address && publicClient) {
      fetchVaultData()
    }
  }, [address, isConnected, publicClient, amount, activeTab])

  // Handle amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value)
    }
  }

  // Handle deposit (using deposit function)
  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      showNotification('Please enter a valid amount', 'error')
      return
    }
    
    if (!walletClient || !publicClient) {
      showNotification('Wallet not connected properly', 'error')
      return
    }
    
    setLoading(true)
    try {
      // First approve USDC
      const { request: approveRequest } = await publicClient.simulateContract({
        address: ContractAddresses.USDC as `0x${string}`,
        abi: USDCJson.abi,
        functionName: 'approve',
        args: [ContractAddresses.sPUSD, parseUnits(amount, 6)],
        account: address
      })
      
      const approveHash = await walletClient.writeContract(approveRequest)
      await publicClient.waitForTransactionReceipt({ hash: approveHash })
      
      // Deposit assets - use 6 decimals
      const { request: depositRequest } = await publicClient.simulateContract({
        address: ContractAddresses.sPUSD as `0x${string}`,
        abi: sPUSDJson.abi,
        functionName: 'deposit',
        args: [parseUnits(amount, 6), address],
        account: address
      })
      
      const depositHash = await walletClient.writeContract(depositRequest)
      await publicClient.waitForTransactionReceipt({ hash: depositHash })
      
      fetchVaultData()
      setAmount('')
      showNotification(`Successfully deposited ${amount} USDC`, 'success')
    } catch (error: any) {
      console.error('Error depositing:', error)
      showNotification(error.message || 'Failed to deposit', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Handle withdraw (using redeem function for exact shares)
  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      showNotification('Please enter a valid amount', 'error')
      return
    }
    
    if (!walletClient || !publicClient) {
      showNotification('Wallet not connected properly', 'error')
      return
    }
    
    setLoading(true)
    try {
      const { request } = await publicClient.simulateContract({
        address: ContractAddresses.sPUSD as `0x${string}`,
        abi: sPUSDJson.abi,
        functionName: 'redeem',
        args: [parseUnits(amount, 6), address, address], // Changed to 6 decimals
        account: address
      })
      
      const hash = await walletClient.writeContract(request)
      await publicClient.waitForTransactionReceipt({ hash })
      
      fetchVaultData()
      setAmount('')
      showNotification(`Successfully withdrawn ${spusdBalance} USDC`, 'success')
    } catch (error: any) {
      console.error('Error withdrawing:', error)
      showNotification(error.message || 'Failed to withdraw', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Show notification helper
  const showNotification = (message: string, type: string) => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' })
    }, 5000)
  }

  // Update the formatNumber function
  const formatNumber = (value: string, decimals: number = 6) => {
    const num = parseFloat(value)
    if (isNaN(num) || num === 0) return '0'
    if (num < 0.000001) return '< 0.000001'
    
    // Format with up to 6 decimals but remove trailing zeros
    const formatted = num.toFixed(decimals)
    // Remove trailing zeros after decimal point
    return formatted.replace(/\.?0+$/, '')
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center font-mono" style={{ 
          letterSpacing: '0.05em',
          textShadow: '0.05em 0 0 rgba(255,0,0,0.75), -0.025em -0.05em 0 rgba(0,255,0,0.75), 0.025em 0.05em 0 rgba(0,0,255,0.75)',
          fontFamily: 'monospace'
        }}>
          SPUSD VAULT
        </h1>

        {notification.show && (
          <div className={`mb-4 p-3 rounded-md ${
            notification.type === 'error' ? 'bg-red-900 bg-opacity-50 text-red-200' : 'bg-green-900 bg-opacity-50 text-green-200'
          }`}>
            {notification.message}
          </div>
        )}

        <div className="bg-black border border-gray-800 p-6 rounded-lg shadow-lg backdrop-blur-sm" 
             style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '10px 10px' }}>
          
          {/* Tabs */}
          <div className="flex mb-6 border-b border-gray-800">
            <button
              onClick={() => setActiveTab('deposit')}
              className={`py-2 px-4 ${activeTab === 'deposit' ? 'text-[#C6D130] border-b-2 border-[#C6D130]' : 'text-gray-400'}`}
            >
              Deposit
            </button>
            <button
              onClick={() => setActiveTab('withdraw')}
              className={`py-2 px-4 ${activeTab === 'withdraw' ? 'text-[#C6D130] border-b-2 border-[#C6D130]' : 'text-gray-400'}`}
            >
              Withdraw
            </button>
          </div>

          {/* Balances */}
          <div className="mb-6">
            <p className="text-gray-300 mb-2">
              Your USDC Balance: <span className="text-[#C6D130] font-bold">{formatNumber(usdcBalance)} USDC</span>
            </p>
            <p className="text-gray-300 mb-2">
              Your sPUSD Balance: <span className="text-[#C6D130] font-bold">{formatNumber(shareBalance)} sPUSD</span>
            </p>
            <p className="text-gray-300 mb-4">
              Exchange Rate: <span className="text-[#C6D130] font-bold">1:1 (1 sPUSD = 1 USDC)</span>
            </p>
          </div>

          {/* Amount Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#C6D130] mb-1">
              {activeTab === 'deposit' ? 'USDC Amount to Deposit' : 'sPUSD Shares to Redeem'}
            </label>
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
              className="w-full px-3 py-2 bg-black border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#C6D130]"
              disabled={loading}
            />
            {amount && (
              <p className="text-sm text-gray-400 mt-2">
                You will receive: {activeTab === 'deposit' ? 
                  `${formatNumber(amount)} sPUSD (1:1 ratio)` : 
                  `${formatNumber(amount)} USDC (1:1 ratio)`}
              </p>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={activeTab === 'deposit' ? handleDeposit : handleWithdraw}
            disabled={loading || !amount}
            className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
              loading ? 'opacity-70' : ''
            } bg-black border border-[#C6D130] shadow-[0_0_15px_rgba(198,209,48,0.7)] hover:shadow-[0_0_20px_rgba(198,209,48,1)] hover:text-[#C6D130]`}
          >
            {loading ? 'Processing...' : activeTab === 'deposit' ? 'Deposit USDC' : 'Withdraw USDC'}
          </button>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-black border border-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2 text-[#C6D130]">About sPUSD Vault</h2>
          <p className="text-gray-300 mb-2">
            sPUSD is an ERC4626 tokenized vault that accepts USDC deposits and provides sPUSD shares in return.
          </p>
          <p className="text-gray-300">
            The vault automatically compounds yield from lending markets, increasing the value of each sPUSD share over time.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SPUSDPage 