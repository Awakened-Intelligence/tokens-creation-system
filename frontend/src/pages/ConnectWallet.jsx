
import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import { ethers } from "ethers";
import { motion } from "framer-motion";

function ConnectWallet() {
  const [walletAddress, setWalletAddress] = useState("");
  const [error, setError] = useState("");
  const [metaMaskAvailable, setMetaMaskAvailable] = useState(false);
  const [network, setNetwork] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const initializeWallet = async () => {
      setMetaMaskAvailable(!!window.ethereum?.isMetaMask);
      const savedWallet = localStorage.getItem("walletAddress");
      
      if (savedWallet && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const network = await provider.getNetwork();
          setWalletAddress(savedWallet);
          setNetwork(network.name);
        } catch (err) {
          console.error("Failed to restore wallet connection:", err);
          localStorage.removeItem("walletAddress");
          setWalletAddress("");
          setNetwork("");
        }
      }
    };

    initializeWallet();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountChange);
      window.ethereum.on("chainChanged", handleNetworkChange);
    }

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
      window.dispatchEvent(new Event("walletConnected"));
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
    setIsConnecting(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      localStorage.removeItem("walletAddress");
      const accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();

      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setNetwork(network.name);
        localStorage.setItem("walletAddress", accounts[0]);
        window.dispatchEvent(new Event("walletConnected"));
      }
    } catch (err) {
      setError("Failed to connect MetaMask wallet.");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      localStorage.removeItem("walletAddress");
      setWalletAddress("");
      setNetwork("");
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountChange);
      }
      window.dispatchEvent(new Event("walletDisconnected"));
    } catch (error) {
      console.error("Disconnect Error:", error);
    }
  };

  const clearWallet = () => {
    setWalletAddress("");
    setNetwork("");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex justify-center items-center h-screen">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-lg bg-white/20 p-8 rounded-3xl shadow-2xl w-full max-w-md mx-4 border border-white/30"
        >
          <motion.h2 
            className="text-4xl font-bold mb-6 text-white text-center"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            Connect Your Wallet
          </motion.h2>

          <div className="space-y-6">
            {walletAddress ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="space-y-4"
              >
                <div className="bg-white/40 p-4 rounded-2xl backdrop-blur-lg">
                  <p className="text-white text-center break-words">
                    <span className="block text-sm font-semibold mb-1 text-white/90">Connected Address</span>
                    <span className="font-mono text-lg font-bold">{walletAddress.substring(0, 6)}...{walletAddress.slice(-4)}</span>
                  </p>
                  <p className="text-white text-center mt-2">
                    <span className="block text-sm font-semibold text-white/90">Network</span>
                    <span className="font-bold text-lg">{network || "Unknown"}</span>
                  </p>
                </div>
                <motion.button
                  onClick={disconnectWallet}
                  className="w-full bg-red-500/80 text-white py-3 px-6 rounded-xl font-semibold backdrop-blur-sm"
                >
                  Disconnect
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {metaMaskAvailable ? (
                  <motion.button
                    onClick={connectMetaMask}
                    disabled={isConnecting}
                    className="w-full bg-black text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 backdrop-blur-sm border border-white/20"
                  >
                    {isConnecting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      "Connect with MetaMask"
                    )}
                  </motion.button>
                ) : (
                  <motion.a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-center py-4 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 backdrop-blur-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Install MetaMask
                  </motion.a>
                )}
              </motion.div>
            )}

            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-200 text-center mt-4"
              >
                {error}
              </motion.p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ConnectWallet;
