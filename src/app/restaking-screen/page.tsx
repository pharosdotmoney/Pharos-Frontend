"use client";

import React, { useState, useEffect } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import LSTJson from "@/contracts/LST.sol/LST.json";
import EigenJson from "@/contracts/Eigen.sol/Eigen.json";
import ContractAddresses from "@/deployed-addresses.json";

const RestakingScreen = () => {
  // State variables
  const [balance, setBalance] = useState("0");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("delegate");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [delegatedAmount, setDelegatedAmount] = useState("0");

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
        functionName: "balanceOf",
        args: [address],
      });

      setBalance(formatUnits(balanceData as bigint, 18));

      // Also fetch delegated amount
      try {
        const delegatedData = await publicClient.readContract({
          address: ContractAddresses.Eigen as `0x${string}`,
          abi: EigenJson.abi,
          functionName: "getDelegatedAmount",
          args: [address],
        });

        setDelegatedAmount(formatUnits(delegatedData as bigint, 18));
      } catch (err) {
        console.error("Error fetching delegated amount:", err);
        // If this fails, we'll just show 0 delegated
      }
    } catch (err) {
      console.error("Error fetching balance:", err);
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
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  // Handle max button click
  const handleMaxClick = () => {
    if (activeTab === "delegate") {
      setAmount(balance);
    } else {
      setAmount(delegatedAmount);
    }
  };

  // Show notification
  const showNotification = (message: string, type: string) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 5000);
  };

  // Handle delegate action (addDelegation)
  const handleDelegate = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      showNotification("Please enter a valid amount", "error");
      return;
    }

    if (!walletClient || !publicClient) {
      showNotification("Wallet not connected properly", "error");
      return;
    }

    setIsLoading(true);
    try {
      const { request } = await publicClient.simulateContract({
        address: ContractAddresses.Eigen as `0x${string}`,
        abi: EigenJson.abi,
        functionName: "addDelegation",
        args: [parseUnits(amount, 18)],
        account: address,
      });

      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });

      // Update balance
      fetchBalance();

      showNotification(`Successfully delegated ${amount} LST`, "success");
      setAmount("");
    } catch (error: unknown) {
      console.error("Delegation error:", error);
      showNotification(
        error instanceof Error ? error.message : "Failed to delegate tokens",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle undelegate action (removeDelegation)
  const handleUndelegate = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      showNotification("Please enter a valid amount", "error");
      return;
    }

    if (!walletClient || !publicClient) {
      showNotification("Wallet not connected properly", "error");
      return;
    }

    setIsLoading(true);
    try {
      // Call removeDelegation with separate parameters
      const { request } = await publicClient.simulateContract({
        address: ContractAddresses.Eigen as `0x${string}`,
        abi: EigenJson.abi,
        functionName: "removeDelegation",
        args: [parseUnits(amount, 18)],
        account: address,
      });

      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });

      // Update balance
      fetchBalance();

      showNotification(`Successfully undelegated ${amount} LST`, "success");
      setAmount("");
    } catch (error: unknown) {
      console.error("Undelegation error:", error);
      showNotification(
        error instanceof Error ? error.message : "Failed to undelegate tokens",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1
          className="text-4xl font-bold mb-6 text-center font-mono"
          style={{
            letterSpacing: "0.05em",
            textShadow:
              "0.05em 0 0 rgba(255,0,0,0.75), -0.025em -0.05em 0 rgba(0,255,0,0.75), 0.025em 0.05em 0 rgba(0,0,255,0.75)",
            fontFamily: "monospace",
          }}
        >
          RESTAKING
        </h1>

        {/* Notification */}
        {notification.show && (
          <div
            className={`mb-4 p-3 rounded-md ${
              notification.type === "error"
                ? "bg-red-900 bg-opacity-50 text-red-200"
                : "bg-green-900 bg-opacity-50 text-green-200"
            }`}
          >
            {notification.message}
          </div>
        )}

        {/* Main Content */}
        <div className="bg-black border border-gray-800 p-6 rounded-lg shadow-lg backdrop-blur-sm bg-[radial-gradient(#333_1px,transparent_1px)] bg-[size:10px_10px]">
          {/* Tabs */}
          <div className="flex mb-6 border-b border-gray-800">
            <button
              onClick={() => setActiveTab("delegate")}
              className={`py-2 px-4 ${
                activeTab === "delegate"
                  ? "text-[#C6D130] border-b-2 border-[#C6D130]"
                  : "text-gray-400"
              }`}
            >
              Delegate
            </button>
            <button
              onClick={() => setActiveTab("undelegate")}
              className={`py-2 px-4 ${
                activeTab === "undelegate"
                  ? "text-[#C6D130] border-b-2 border-[#C6D130]"
                  : "text-gray-400"
              }`}
            >
              Undelegate
            </button>
          </div>

          {/* Balance Display */}
          <div className="mb-6 p-4 bg-gray-900 bg-opacity-50 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-400">Your LST Balance</span>
              <span className="text-xl font-semibold">{balance} LST</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Delegated LST</span>
              <span className="text-xl font-semibold">
                {delegatedAmount} LST
              </span>
            </div>
          </div>

          {/* Input Form */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#C6D130] mb-1">
              {activeTab === "delegate"
                ? "Amount to Delegate"
                : "Amount to Undelegate"}
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
              onClick={
                activeTab === "delegate" ? handleDelegate : handleUndelegate
              }
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
                isLoading ? "opacity-70" : ""
              } bg-black border border-[#C6D130] shadow-[0_0_15px_rgba(198,209,48,0.7)] hover:shadow-[0_0_20px_rgba(198,209,48,1)] hover:text-[#C6D130]`}
            >
              {isLoading
                ? "Processing..."
                : activeTab === "delegate"
                ? "Delegate Tokens"
                : "Undelegate Tokens"}
            </button>
          </div>
        </div>

        {/* Additional Info - with plain background */}
        <div className="mt-8 bg-black border border-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2 text-[#C6D130]">
            About Restaking
          </h2>
          <p className="text-gray-300 mb-2">
            Restaking allows you to earn rewards by providing security to the
            network. Your delegated tokens help secure multiple blockchain
            protocols simultaneously.
          </p>
          <p className="text-gray-300">
            When you delegate your LST tokens to an operator, they can use your
            stake to validate transactions across different networks, increasing
            your potential rewards.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RestakingScreen;
