'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const RestakingScreen = () => {
  const router = useRouter();
  
  // State variables
  const [balance, setBalance] = useState('0');
  const [pendingRewards, setPendingRewards] = useState('0');
  const [apr, setApr] = useState('5.00');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('stake');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Mock data - in a real app, this would come from blockchain
  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setBalance('1000.00');
      setPendingRewards('25.75');
      setApr('5.00');
    }, 1000);
  }, []);

  // Handle amount input change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
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

    setIsLoading(true);
    try {
      // Mock staking transaction
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update balance (in a real app, this would be fetched from the blockchain)
      const newBalance = (parseFloat(balance) + parseFloat(amount)).toFixed(2);
      setBalance(newBalance);
      
      showNotification(`Successfully staked ${amount} tokens`, 'success');
      setAmount('');
    } catch (error) {
      console.error('Staking error:', error);
      showNotification('Failed to stake tokens', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle unstake action
  const handleUnstake = async () => {
    if (!amount || parseFloat(amount) <= 0 || parseFloat(amount) > parseFloat(balance)) {
      showNotification('Please enter a valid amount', 'error');
      return;
    }

    setIsLoading(true);
    try {
      // Mock unstaking transaction
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update balance (in a real app, this would be fetched from the blockchain)
      const newBalance = (parseFloat(balance) - parseFloat(amount)).toFixed(2);
      setBalance(newBalance);
      
      showNotification(`Successfully unstaked ${amount} tokens`, 'success');
      setAmount('');
    } catch (error) {
      console.error('Unstaking error:', error);
      showNotification('Failed to unstake tokens', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle claim rewards action
  const handleClaimRewards = async () => {
    if (parseFloat(pendingRewards) <= 0) {
      showNotification('No rewards to claim', 'error');
      return;
    }

    setIsLoading(true);
    try {
      // Mock claiming rewards transaction
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update balance and reset pending rewards
      const newBalance = (parseFloat(balance) + parseFloat(pendingRewards)).toFixed(2);
      setBalance(newBalance);
      setPendingRewards('0');
      
      showNotification(`Successfully claimed ${pendingRewards} tokens in rewards`, 'success');
    } catch (error) {
      console.error('Claiming rewards error:', error);
      showNotification('Failed to claim rewards', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center font-mono" style={{ 
          letterSpacing: '0.05em',
          textShadow: '0.05em 0 0 rgba(255,0,0,0.75), -0.025em -0.05em 0 rgba(0,255,0,0.75), 0.025em 0.05em 0 rgba(0,0,255,0.75)',
          fontFamily: 'monospace'
        }}>
          RESTAKING Dashboard
        </h1>
        
        {/* Notification */}
        {notification.show && (
          <div className={`p-4 mb-6 rounded-md ${notification.type === 'error' ? 'bg-red-900 bg-opacity-50 text-red-200 border border-red-700' : 'bg-green-900 bg-opacity-50 text-green-200 border border-green-700'}`}>
            {notification.message}
          </div>
        )}
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-black border border-gray-800 p-4 rounded-lg shadow-lg backdrop-blur-sm bg-[radial-gradient(#333_1px,transparent_1px)] bg-[size:10px_10px]">
            <h3 className="text-sm text-gray-400 mb-1">Your Balance</h3>
            <p className="text-2xl font-bold text-blue-400">{balance} LST</p>
          </div>
          
          <div className="bg-black border border-gray-800 p-4 rounded-lg shadow-lg backdrop-blur-sm bg-[radial-gradient(#333_1px,transparent_1px)] bg-[size:10px_10px]">
            <h3 className="text-sm text-gray-400 mb-1">Pending Rewards</h3>
            <p className="text-2xl font-bold text-green-400">{pendingRewards} LST</p>
            <button 
              onClick={handleClaimRewards}
              disabled={isLoading || parseFloat(pendingRewards) <= 0}
              className="mt-2 text-sm bg-black text-[#0ff] py-1 px-3 rounded border border-[#0ff] hover:text-white disabled:border-gray-700 disabled:text-gray-500 transition-colors shadow-[0_0_10px_rgba(0,255,255,0.7)] hover:shadow-[0_0_15px_rgba(0,255,255,1)]"
            >
              {isLoading ? 'Processing...' : 'Claim'}
            </button>
          </div>
          
          <div className="bg-black border border-gray-800 p-4 rounded-lg shadow-lg backdrop-blur-sm bg-[radial-gradient(#333_1px,transparent_1px)] bg-[size:10px_10px]">
            <h3 className="text-sm text-gray-400 mb-1">Current APR</h3>
            <p className="text-2xl font-bold text-purple-400">{apr}%</p>
          </div>
        </div>
        
        {/* Action Tabs */}
        <div className="bg-black border border-gray-800 rounded-lg shadow-lg overflow-hidden backdrop-blur-sm bg-[radial-gradient(#333_1px,transparent_1px)] bg-[size:10px_10px]">
          <div className="flex border-b border-gray-800">
            <button 
              className={`flex-1 py-3 font-medium transition-colors ${activeTab === 'stake' ? 'bg-blue-900 bg-opacity-30 text-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
              onClick={() => setActiveTab('stake')}
            >
              Stake
            </button>
            <button 
              className={`flex-1 py-3 font-medium transition-colors ${activeTab === 'unstake' ? 'bg-blue-900 bg-opacity-30 text-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
              onClick={() => setActiveTab('unstake')}
            >
              Unstake
            </button>
          </div>
          
          <div className="p-6">
            <div className="mb-4">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
                Amount
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0.00"
                  className="flex-1 px-3 py-2 bg-black border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  onClick={handleMaxClick}
                  className="ml-2 bg-gray-700 text-gray-300 px-3 py-2 rounded-md hover:bg-gray-600 transition-colors"
                >
                  MAX
                </button>
              </div>
            </div>
            
            <button
              onClick={activeTab === 'stake' ? handleStake : handleUnstake}
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
                isLoading ? 'opacity-70' : ''
              } bg-black border border-[#0ff] shadow-[0_0_15px_rgba(0,255,255,0.7)] hover:shadow-[0_0_20px_rgba(0,255,255,1)] hover:text-[#0ff]`}
            >
              {isLoading ? 'Processing...' : activeTab === 'stake' ? 'Stake Tokens' : 'Unstake Tokens'}
            </button>
          </div>
        </div>
        
        {/* Additional Info */}
        <div className="mt-8 bg-black border border-gray-800 p-4 rounded-lg backdrop-blur-sm bg-[radial-gradient(#333_1px,transparent_1px)] bg-[size:10px_10px]">
          <h2 className="text-lg font-semibold mb-2 text-blue-400">About Restaking</h2>
          <p className="text-gray-300 mb-2">
            Restaking allows you to earn rewards by providing security to the network. Your staked tokens help secure multiple blockchain protocols simultaneously.
          </p>
          <p className="text-gray-300">
            The current APR is <span className="text-purple-400">{apr}%</span>, but this rate may vary based on network conditions and total staked amount.
          </p>
        </div>
        
        {/* Navigation */}
        <div className="mt-6 text-center">
          <button 
            onClick={() => router.push('/operator-screen')}
            className="text-[#0ff] hover:text-white font-medium transition-colors px-4 py-2 border border-[#0ff] rounded-md shadow-[0_0_10px_rgba(0,255,255,0.7)] hover:shadow-[0_0_20px_rgba(0,255,255,1)]"
          >
            View Operators →
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestakingScreen;