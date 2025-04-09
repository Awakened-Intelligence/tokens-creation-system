import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import Navbar from "../components/navbar";
// import GraphStats from "./pages/GraphStats";
import { Link } from "react-router-dom";

// import coinImage from '../assets/coin.png';

function Dashboard() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [tokens, setTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null); // State for the selected token (for modal)
  const [showModal, setShowModal] = useState(false); // Control modal visibility
  const [copied, setCopied] = useState(false);
  // Function to check wallet connection status
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
      const token = localStorage.getItem("token"); // Retrieve token from local storage
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      const response = await axios.get(`${config.API_BASE_URL}/tokens/get-tokens`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTokens(response.data.tokens); // Store the fetched tokens
    } catch (error) {
      console.error("Error fetching tokens:", error.response?.data || error);
    }
  };

  // Effect to check wallet status and listen for disconnect events
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
  }, [checkWalletConnection]);


  const handleTokenClick = (token) => {
    setSelectedToken(token); // Set the selected token's details
    setShowModal(true); // Show the modal
  };

  // Function to close the modal
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
    <>
    <Navbar />
    <div className="page-container">
  <div className="content-container mt-20">

  
    <h2 className="text-3xl mt-20 font-bold text-center text-black">Token Dashboard</h2>
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-2xl rounded-lg flex flex-col items-center mt-20 border-2 border-black">
    {/* Wallet Connection Section */}
    <div className="mt-8 text-center">
      {walletConnected ? (
        <p className="text-green-600 font-semibold">
          Connected Wallet: {walletAddress.substring(0, 6)}...{walletAddress.slice(-4)}
        </p>
      ) : (
        <Link to="/connect-wallet">
          <button className="btn">Connect Wallet</button>
        </Link>
      )}
    </div>

    {/* Token List */}
    <div className="mt-8 w-full">
      <h3 className="text-lg font-bold mb-4 ">Your Created Tokens</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 select-none">
        {tokens.length > 0 ? (
          tokens.map((token, index) => (
            <div
              key={index}
              className="p-4 border shadow-2xl rounded-lg text-center transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-3xl"
              onClick={() => handleTokenClick(token)}
            >
              <h4 className="text-lg font-semibold">
                {token.token_name} ({token.token_symbol})
              </h4>
              <p className="text-gray-600">Supply: {token.total_supply}</p>
              <p className="text-gray-600">Network: {token.network}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No tokens created yet.</p>
        )}
      </div>
    </div>

    {/* Token Stats & Live Data (Future Feature) */}
    {/* <div className="mt-8 text-center">
      <p className="text-gray-500">
        📊 Token price, staking, and transaction stats will be added soon.
      </p>
    </div> */}
      {/* Token Info Modal */}
      {showModal && selectedToken && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-2xl w-96">
      <h2 className="text-2xl font-semibold mb-4">Token Information</h2>
      <p><strong>Name:</strong> {selectedToken.token_name}</p>
      <p><strong>Symbol:</strong> {selectedToken.token_symbol}</p>
      <p><strong>Total Supply:</strong> {selectedToken.total_supply}</p>
      <p><strong>Network:</strong> {selectedToken.network}</p>

      <p>
        <strong>Contract Address:</strong>{" "}
        <a
          href={`https://sepolia.lineascan.build/address/${selectedToken.contract_address}#code`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {selectedToken.contract_address}
        </a>
      </p>

      <button className="btn mt-2" onClick={() => handleCopyAddress(selectedToken.contract_address)}>
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
</>

  );
}

export default Dashboard;
