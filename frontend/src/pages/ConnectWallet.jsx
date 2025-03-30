

import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
// import coinImage from '../assets/coin.png';
import { ethers } from "ethers";


function ConnectWallet() {
  const [walletAddress, setWalletAddress] = useState("");
  const [error, setError] = useState("");
  const [metaMaskAvailable, setMetaMaskAvailable] = useState(false);
  const [network, setNetwork] = useState("");

  useEffect(() => {
    // Check if MetaMask is installed
    setMetaMaskAvailable(!!window.ethereum?.isMetaMask);

    // Load wallet address if previously connected
    const savedWallet = localStorage.getItem("walletAddress");
    if (savedWallet) {
      setWalletAddress(savedWallet);
    }

    // Listen for account and network changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountChange);
      window.ethereum.on("chainChanged", handleNetworkChange);
    }

    // Listen for global wallet connection/disconnection events (for Navbar)
    window.addEventListener("walletConnected", loadWallet);
    window.addEventListener("walletDisconnected", clearWallet);

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountChange);
        window.ethereum.removeListener("chainChanged", handleNetworkChange);
      }
      window.removeEventListener("walletConnected", loadWallet);
      window.removeEventListener("walletDisconnected", clearWallet);
    };
  }, []);

  const handleAccountChange = (accounts) => {
    if (accounts.length > 0) {
      setWalletAddress(accounts[0]);
      localStorage.setItem("walletAddress", accounts[0]);
      window.dispatchEvent(new Event("walletConnected")); // Dispatch for Navbar
    } else {
      disconnectWallet();
    }
  };

  const handleNetworkChange = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      setNetwork(network.name);
    } catch (err) {
      setError("Failed to fetch network details.");
    }
  };

  const loadWallet = () => {
    const savedWallet = localStorage.getItem("walletAddress");
    if (savedWallet) {
      setWalletAddress(savedWallet);
    }
  };

  const connectMetaMask = async () => {
    if (!window.ethereum || !window.ethereum.isMetaMask) {
      setError("MetaMask is not installed. Please install it.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Clear any previous session before reconnecting
      localStorage.removeItem("walletAddress");

      const accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();

      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setNetwork(network.name);
        localStorage.setItem("walletAddress", accounts[0]);

        // Dispatch event for Navbar update
        window.dispatchEvent(new Event("walletConnected"));
      }
    } catch (err) {
      setError("Failed to connect MetaMask wallet.");
    }
  };

  const disconnectWallet = async () => {
    try {
      // Clear stored wallet data
      localStorage.removeItem("walletAddress");
      setWalletAddress(""); // Ensure UI updates
      setNetwork("");

      // Remove MetaMask event listeners to prevent auto-reconnection
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountChange);
      }

      // Dispatch global event for Navbar update
      window.dispatchEvent(new Event("walletDisconnected"));

      console.log("Wallet disconnected.");
    } catch (error) {
      console.error("Disconnect Error:", error);
    }
  };

  const clearWallet = () => {
    setWalletAddress(""); // Ensure UI updates
    setNetwork("");
  };

  return (
    <div >
      <Navbar />
<div className="flex justify-center items-center h-screen">
  <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96 text-center border-2 border-black">
    <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
    <p className="text-gray-600 mb-4">Choose a blockchain network.</p>

    {walletAddress ? (
      <div>
        <p className="text-green-600 mb-2 break-words">
          Connected: {walletAddress} <br />
          Network: {network || "Unknown"}
        </p>
        <button
          onClick={disconnectWallet}
          className="bg-red-500 px-4 py-2 rounded-md mr-2 transition-all duration-500 transform hover:bg-gradient-to-r hover:from-yellow-500 hover:to-red-700 hover:scale-105 hover:shadow-xl"
        >
          Disconnect
        </button>
      </div>
    ) : (
      <button
        onClick={connectMetaMask}
        disabled={!metaMaskAvailable}
        className={`p-3 rounded-md font-semibold w-full ${
          metaMaskAvailable
            ? "btn"
            : "bg-gray-400 text-gray-300 cursor-not-allowed"
        }`}
      >
        {metaMaskAvailable ? "Connect with MetaMask" : "MetaMask Not Available"}
      </button>
    )}

    {error && <p className="text-red-500 mt-2">{error}</p>}
  </div>
</div>

    </div>
  );
}

export default ConnectWallet;
