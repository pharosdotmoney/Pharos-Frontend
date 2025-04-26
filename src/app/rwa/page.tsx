'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';

const RWAPage = () => {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  
  // State for assets and yields
  const [assets, setAssets] = useState([
    { id: 1, name: 'US Treasury Bond', amount: '10,000', yield: '4.2%', value: '10,250' },
    { id: 2, name: 'Corporate Bond ETF', amount: '5,000', yield: '5.8%', value: '5,120' },
    { id: 3, name: 'Real Estate Fund', amount: '15,000', yield: '7.1%', value: '15,600' },
  ]);
  
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: '',
    amount: '',
    yield: '',
  });
  
  // Calculate total yield
  const calculateTotalYield = () => {
    let totalValue = 0;
    let weightedYield = 0;
    
    assets.forEach(asset => {
      const value = parseFloat(asset.value.replace(/,/g, ''));
      const yieldRate = parseFloat(asset.yield.replace('%', '')) / 100;
      
      totalValue += value;
      weightedYield += value * yieldRate;
    });
    
    return totalValue > 0 ? (weightedYield / totalValue * 100).toFixed(2) : '0.00';
  };
  
  // Base yield (fixed for demo)
  const baseYield = '3.50';
  
  // Handle adding a new asset
  const handleAddAsset = () => {
    if (!newAsset.name || !newAsset.amount || !newAsset.yield) {
      alert('Please fill in all fields');
      return;
    }
    
    // Format the values
    const formattedAmount = parseFloat(newAsset.amount).toLocaleString();
    const formattedYield = `${parseFloat(newAsset.yield).toFixed(1)}%`;
    
    // Calculate estimated value (amount + simple yield for demo)
    const amount = parseFloat(newAsset.amount);
    const yieldRate = parseFloat(newAsset.yield) / 100;
    const estimatedValue = (amount * (1 + yieldRate * 0.1)).toLocaleString(); // Simplified calculation
    
    // Add new asset
    const newId = assets.length > 0 ? Math.max(...assets.map(a => a.id)) + 1 : 1;
    setAssets([...assets, {
      id: newId,
      name: newAsset.name,
      amount: formattedAmount,
      yield: formattedYield,
      value: estimatedValue
    }]);
    
    // Reset form and close modal
    setNewAsset({ name: '', amount: '', yield: '' });
    setShowAddAssetModal(false);
  };
  
  // Handle input change for new asset form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAsset({
      ...newAsset,
      [name]: value
    });
  };
  
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center font-mono" style={{ 
          letterSpacing: '0.05em',
          textShadow: '0.05em 0 0 rgba(255,0,0,0.75), -0.025em -0.05em 0 rgba(0,255,0,0.75), 0.025em 0.05em 0 rgba(0,0,255,0.75)',
          fontFamily: 'monospace'
        }}>
          REAL WORLD ASSETS
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Current Yield Box */}
          <div className="bg-black border border-gray-800 p-6 rounded-lg shadow-lg backdrop-blur-sm col-span-2" 
               style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '10px 10px' }}>
            <h2 className="text-xl font-semibold mb-4 text-[#C6D130]">Current Yield</h2>
            <div className="flex items-end mb-6">
              <span className="text-5xl font-bold text-white">{calculateTotalYield()}%</span>
              <span className="text-gray-400 ml-2 mb-1">APY</span>
            </div>
            
            <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Base Yield</span>
                <span className="text-xl font-semibold text-[#C6D130]">{baseYield}%</span>
              </div>
              <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-[#C6D130]" style={{ width: `${(parseFloat(baseYield) / parseFloat(calculateTotalYield())) * 100}%` }}></div>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="bg-black border border-gray-800 p-6 rounded-lg shadow-lg backdrop-blur-sm" 
               style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '10px 10px' }}>
            <h2 className="text-xl font-semibold mb-4 text-[#C6D130]">Portfolio Stats</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Total Value</p>
                <p className="text-2xl font-bold">
                  ${assets.reduce((sum, asset) => sum + parseFloat(asset.value.replace(/,/g, '')), 0).toLocaleString()}
                </p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">Asset Count</p>
                <p className="text-2xl font-bold">{assets.length}</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">Yield Premium</p>
                <p className="text-2xl font-bold text-green-400">
                  +{(parseFloat(calculateTotalYield()) - parseFloat(baseYield)).toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Assets Section */}
        <div className="bg-black border border-gray-800 p-6 rounded-lg shadow-lg backdrop-blur-sm mb-8" 
             style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '10px 10px' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[#C6D130]">Your Assets</h2>
            <button 
              onClick={() => setShowAddAssetModal(true)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-[#C6D130] text-black hover:bg-opacity-80 transition-colors shadow-[0_0_10px_rgba(198,209,48,0.7)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          
          {assets.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p>No assets yet. Click the + button to add your first asset.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-800">
                    <th className="pb-2 text-gray-400 font-medium">Asset</th>
                    <th className="pb-2 text-gray-400 font-medium">Amount (USDC)</th>
                    <th className="pb-2 text-gray-400 font-medium">Yield</th>
                    <th className="pb-2 text-gray-400 font-medium">Current Value</th>
                    <th className="pb-2 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map(asset => (
                    <tr key={asset.id} className="border-b border-gray-800">
                      <td className="py-4">{asset.name}</td>
                      <td className="py-4">${asset.amount}</td>
                      <td className="py-4 text-green-400">{asset.yield}</td>
                      <td className="py-4">${asset.value}</td>
                      <td className="py-4">
                        <button className="text-[#C6D130] hover:text-white transition-colors">
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Market Opportunities */}
        <div className="bg-black border border-gray-800 p-6 rounded-lg shadow-lg backdrop-blur-sm" 
             style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '10px 10px' }}>
          <h2 className="text-xl font-semibold mb-4 text-[#C6D130]">Market Opportunities</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">US Treasury Bonds</h3>
              <p className="text-gray-300 text-sm mb-2">Low risk government securities</p>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Yield</span>
                <span className="text-green-400 font-semibold">4.2%</span>
              </div>
              <button className="mt-4 w-full py-2 bg-black text-[#C6D130] border border-[#C6D130] rounded hover:bg-[#C6D130] hover:text-black transition-colors">
                Invest
              </button>
            </div>
            
            <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Corporate Bond ETF</h3>
              <p className="text-gray-300 text-sm mb-2">Diversified corporate debt</p>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Yield</span>
                <span className="text-green-400 font-semibold">5.8%</span>
              </div>
              <button className="mt-4 w-full py-2 bg-black text-[#C6D130] border border-[#C6D130] rounded hover:bg-[#C6D130] hover:text-black transition-colors">
                Invest
              </button>
            </div>
            
            <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Real Estate Fund</h3>
              <p className="text-gray-300 text-sm mb-2">Commercial property portfolio</p>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Yield</span>
                <span className="text-green-400 font-semibold">7.1%</span>
              </div>
              <button className="mt-4 w-full py-2 bg-black text-[#C6D130] border border-[#C6D130] rounded hover:bg-[#C6D130] hover:text-black transition-colors">
                Invest
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Asset Modal */}
      {showAddAssetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-[#C6D130]">Add New Asset</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">Asset Name</label>
              <input
                type="text"
                name="name"
                value={newAsset.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-black border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#C6D130]"
                placeholder="e.g., US Treasury Bond"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">Amount (USDC)</label>
              <input
                type="number"
                name="amount"
                value={newAsset.amount}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-black border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#C6D130]"
                placeholder="e.g., 10000"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-1">Expected Yield (%)</label>
              <input
                type="number"
                name="yield"
                value={newAsset.yield}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-black border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#C6D130]"
                placeholder="e.g., 4.2"
                step="0.1"
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleAddAsset}
                className="flex-1 py-2 bg-[#C6D130] text-black font-medium rounded-md hover:bg-opacity-90 transition-colors"
              >
                Add Asset
              </button>
              <button
                onClick={() => setShowAddAssetModal(false)}
                className="flex-1 py-2 bg-gray-800 text-white font-medium rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RWAPage;