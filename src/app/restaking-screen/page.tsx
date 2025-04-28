'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import LSTJson from '@/contracts/LST.sol/LST.json';
import ContractAddresses from '@/deployed-addresses.json';

const RestakingScreen = () => {
  const router = useRouter();
  
  // State variables
  const [balance, setBalance] = useState('0');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('stake');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  
  // Fetch LST balance
  const fetchBalance = async () => {
    if (!address || !publicClient) return;
    
    try {
      const balanceData = await publicClient.readContract({
        address: ContractAddresses.LST as `0x${string}`,
        abi: LSTJson.abi,
        functionName: 'balanceOf',
        args: [address]
      });
      
      setBalance(formatUnits(balanceData as bigint, 18));
    } catch (err) {
      console.error('Error fetching balance:', err);
    }
  };
  
  // Fetch balance on mount and when address changes
  useEffect(() => {
    if (isConnected && address && publicClient) {
      fetchBalance();
    }
  }, [address, isConnected, publicClient]);

  // Handle amount input change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimals
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  // Handle max button click
  const handleMaxClick = () => {
    setAmount(balance);
  };

  // Show notification
  const showNotification = (message: string, type: string) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 5000);
  };

  // Handle stake action
  const handleStake = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      showNotification('Please enter a valid amount', 'error');
      return;
    }
    
    if (!walletClient || !publicClient) {
      showNotification('Wallet not connected properly', 'error');
      return;
    }

    setIsLoading(true);
    try {
      // Call the stake function on the contract
      const { request } = await publicClient.simulateContract({
        address: ContractAddresses.Operator as `0x${string}`,
        abi: LSTJson.abi, // Replace with Operator ABI
        functionName: 'stake',
        args: [parseUnits(amount, 18)],
        account: address
      });
      
      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });
      
      // Update balance
      fetchBalance();
      
      showNotification(`Successfully staked ${amount} LST`, 'success');
      setAmount('');
    } catch (error: any) {
      console.error('Staking error:', error);
      showNotification(error.message || 'Failed to stake tokens', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle unstake action
  const handleUnstake = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      showNotification('Please enter a valid amount', 'error');
      return;
    }
    
    if (!walletClient || !publicClient) {
      showNotification('Wallet not connected properly', 'error');
      return;
    }

    setIsLoading(true);
    try {
      // Call the unstake function on the contract
      const { request } = await publicClient.simulateContract({
        address: ContractAddresses.Operator as `0x${string}`,
        abi: LSTJson.abi, // Replace with Operator ABI
        functionName: 'unstake',
        args: [parseUnits(amount, 18)],
        account: address
      });
      
      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });
      
      // Update balance
      fetchBalance();
      
      showNotification(`Successfully unstaked ${amount} LST`, 'success');
      setAmount('');
    } catch (error: any) {
      console.error('Unstaking error:', error);
      showNotification(error.message || 'Failed to unstake tokens', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center font-mono" style={{ 
          letterSpacing: '0.05em',
          textShadow: '0.05em 0 0 rgba(255,0,0,0.75), -0.025em -0.05em 0 rgba(0,255,0,0.75), 0.025em 0.05em 0 rgba(0,0,255,0.75)',
          fontFamily: 'monospace'
        }}>
          RESTAKING
        </h1>
        
        {/* Notification */}
        {notification.show && (
          <div className={`mb-4 p-3 rounded-md ${notification.type === 'error' ? 'bg-red-900 bg-opacity-50 text-red-200' : 'bg-green-900 bg-opacity-50 text-green-200'}`}>
            {notification.message}
          </div>
        )}
        
        {/* Main Content */}
        <div className="bg-black border border-gray-800 p-6 rounded-lg shadow-lg backdrop-blur-sm bg-[radial-gradient(#333_1px,transparent_1px)] bg-[size:10px_10px]">
          {/* Tabs */}
          <div className="flex mb-6 border-b border-gray-800">
            <button
              onClick={() => setActiveTab('stake')}
              className={`py-2 px-4 ${activeTab === 'stake' ? 'text-[#C6D130] border-b-2 border-[#C6D130]' : 'text-gray-400'}`}
            >
              Stake
            </button>
            <button
              onClick={() => setActiveTab('unstake')}
              className={`py-2 px-4 ${activeTab === 'unstake' ? 'text-[#C6D130] border-b-2 border-[#C6D130]' : 'text-gray-400'}`}
            >
              Unstake
            </button>
          </div>
          
          {/* Balance Display */}
          <div className="mb-6 p-4 bg-gray-900 bg-opacity-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Your LST Balance</span>
              <span className="text-xl font-semibold">{balance} LST</span>
            </div>
          </div>
          
          {/* Input Form */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#C6D130] mb-1">
              {activeTab === 'stake' ? 'Amount to Stake' : 'Amount to Unstake'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="w-full px-3 py-2 bg-gray-800 bg-opacity-50 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#C6D130]"
                disabled={isLoading}
              />
              <button
                onClick={handleMaxClick}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs bg-gray-700 px-2 py-1 rounded text-gray-300 hover:bg-gray-600"
              >
                MAX
              </button>
            </div>
          </div>
          
          {/* Action Button */}
          <div>
            <button
              onClick={activeTab === 'stake' ? handleStake : handleUnstake}
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
                isLoading ? 'opacity-70' : ''
              } bg-black border border-[#C6D130] shadow-[0_0_15px_rgba(198,209,48,0.7)] hover:shadow-[0_0_20px_rgba(198,209,48,1)] hover:text-[#C6D130]`}
            >
              {isLoading ? 'Processing...' : activeTab === 'stake' ? 'Stake Tokens' : 'Unstake Tokens'}
            </button>
          </div>
        </div>
        
        {/* Additional Info - with plain background */}
        <div className="mt-8 bg-black border border-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2 text-[#C6D130]">About Restaking</h2>
          <p className="text-gray-300 mb-2">
            Restaking allows you to earn rewards by providing security to the network. Your staked tokens help secure multiple blockchain protocols simultaneously.
          </p>
        </div>
        
        {/* Navigation */}
        <div className="mt-6 text-center">
       
        </div>
      </div>
    </div>
  );
};

export default RestakingScreen;