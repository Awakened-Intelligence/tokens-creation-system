import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import Navbar from "../components/navbar";

import { getExplorerUrl } from "../utils/explorer";

import { Link } from "react-router-dom";

function Dashboard() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [tokens, setTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Check wallet connection status
  const checkWalletConnection = () => {
    const savedWallet = localStorage.getItem("walletAddress");
    if (savedWallet) {
      setWalletConnected(true);
      setWalletAddress(savedWallet);
    } else {
      setWalletConnected(false);
      setWalletAddress("");
    }
  };

  const fetchTokens = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      const response = await axios.get(`${config.API_BASE_URL}/tokens/get-tokens`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTokens(response.data.tokens);
    } catch (error) {
      console.error("Error fetching tokens:", error.response?.data || error);
    }
  };

  // Effects
  useEffect(() => {
    checkWalletConnection();
    fetchTokens();

    const handleWalletDisconnected = () => {
      console.log("Dashboard detected wallet disconnection.");
      checkWalletConnection();
    };

    window.addEventListener("walletDisconnected", handleWalletDisconnected);
    window.addEventListener("walletConnected", checkWalletConnection);

    return () => {
      window.removeEventListener("walletDisconnected", handleWalletDisconnected);
      window.removeEventListener("walletConnected", checkWalletConnection);
    };
  }, []);

  // Token Details Modal
  const handleTokenClick = (token) => {
    setSelectedToken(token);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedToken(null);
    setCopied(false);
  };

  const handleCopyAddress = async (address) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      // Hide "Copied!" after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  };

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto"; // Cleanup on unmount
    };
  }, [showModal]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Main Content Container (offset below navbar) */}
      <div className="relative z-10 pt-20 px-4">
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-bold text-center text-white">
            Token Dashboard
          </h2>

          {/* Outer Container for Wallet + Tokens */}
          <div className="max-w-5xl mx-auto p-6 backdrop-blur-lg bg-white/10 shadow-2xl rounded-3xl flex flex-col items-center mt-10 border border-white/20">
            {/* Wallet Connection Status */}
            <div className="mt-2 text-center">
              {walletConnected ? (
                <p className="text-black-600 font-semibold">
                  Connected Wallet:{" "}
                  {walletAddress.substring(0, 6)}...{walletAddress.slice(-4)}
                </p>
              ) : (
                <Link to="/connect-wallet">
                  <button className="btn">Connect Wallet</button>
                </Link>
              )}
            </div>

            {/* Token List */}
            <div className="mt-8 w-full">
              <h3 className="text-lg font-bold mb-4">Your Created Tokens</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 select-none">
                {tokens.length > 0 ? (
                  tokens.map((token, index) => (
                    <div
                      key={index}
                      className="p-4 backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl rounded-xl text-center transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-3xl text-white"
                      onClick={() => handleTokenClick(token)}
                    >
                      <h4 className="text-lg font-semibold">
                        {token.token_name} ({token.token_symbol})
                      </h4>
                      <p className="text-gray-600">
                        Supply: {token.total_supply}
                      </p>
                      <p className="text-gray-600">Network: {token.network}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">
                    No tokens created yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Token Info Modal */}
          {showModal && selectedToken && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
              <div className="backdrop-blur-lg bg-white/20 p-6 rounded-lg shadow-2xl w-96 border border-white/30 text-white">
                <h2 className="text-2xl font-semibold mb-4">
                  Token Information
                </h2>
                <p>
                  <strong>Name:</strong> {selectedToken.token_name}
                </p>
                <p>
                  <strong>Symbol:</strong> {selectedToken.token_symbol}
                </p>
                <p>
                  <strong>Total Supply:</strong> {selectedToken.total_supply}
                </p>
                <p>
                  <strong>Network:</strong> {selectedToken.network}
                </p>

                {/* <p>
                  <strong>Contract Address:</strong>{" "}
                  <a
     target="_blank"
                    rel="noopener noreferrer"
                    className="text-white-600 underline break-all"
                  >
                    {selectedToken.contract_address}
                  </a>
                </p> */}
                <p>

                    <strong>Contract Address:</strong>{" "}
                    <a
                      href={getExplorerUrl("token", selectedToken.contract_address, selectedToken.network)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white-600 underline break-all"
                    >
                      {selectedToken.contract_address}
                    </a>
                  </p>

                <button
                  className="btn mt-2"
                  onClick={() => handleCopyAddress(selectedToken.contract_address)}
                >
                  Copy Address
                </button>
                {copied && <span className="ml-2 text-green-500">Copied!</span>}

                <button className="btn mt-4" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
