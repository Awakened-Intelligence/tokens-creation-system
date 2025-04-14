import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import config from "../config";
import { BrowserProvider } from "ethers";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function CreateToken() {
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [decimals, setDecimals] = useState("");
  const [network, setNetwork] = useState("Ethereum");
  const [burnRate, setBurnRate] = useState("");
  const [staking, setStaking] = useState(false);
  const [mintable, setMintable] = useState(false);
  const [status, setStatus] = useState("");
  const [solidityCode, setSolidityCode] = useState(""); // New state for Solidity code
  const [transactionHash, setTransactionHash] = useState("");
  const [deploymentDetails, setDeploymentDetails] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load from sessionStorage when component mounts
  useEffect(() => {
    const code = sessionStorage.getItem("generatedCode");
    if (code) {
      setSolidityCode(code);
    }
  }, []);

  // Clear on refresh only
  useEffect(() => {
    const isRefresh = performance.getEntriesByType("navigation")[0].type === "reload";
    if (isRefresh) {
      sessionStorage.removeItem("generatedCode");
    }
  }, []);

  useEffect(() => {
    if (deploymentDetails) {
      console.log("Deployment details updated:", deploymentDetails);
    }
  }, [deploymentDetails]);

  // Helper: Generate Smart Contract (GPT-4 route)
  const generateSmartContract = async () => {
    const walletAddress = localStorage.getItem("walletAddress");

    if (!walletAddress) {
      toast.error("Please connect your MetaMask wallet before generating the contract.");
      return;
    }
    if (!tokenName || !tokenSymbol || !totalSupply || !decimals) {
      toast.error("Please fill in all required fields before generating the contract.");
      return;
    }
    try {
      setIsLoading(true);
      setSolidityCode("");

      const payload = {
        token_name: tokenName,
        token_symbol: tokenSymbol,
        total_supply: totalSupply,
        decimals: decimals,
        network: network,
        burn_rate: parseFloat(burnRate),
        staking: staking,
        mintable: mintable,
      };

      const response = await axios.post(`${config.API_BASE_URL}/gpt/generate-smart-contract`, payload);
      const code = response.data.smart_contract_code;
      setSolidityCode(code);
      sessionStorage.setItem("generatedCode", code);

      toast.success("Smart contract generated successfully!");
    } catch (error) {
      console.error("Error generating contract:", error);
      toast.error("Error generating smart contract!");
    } finally {
      setIsLoading(false);
    }
  };

  // Deploy Smart Contract
  const deploySmartContract = async () => {
    if (!solidityCode) {
      toast.error("No Solidity code available. Generate a contract first.");
      return;
    }
    const walletAddress = localStorage.getItem("walletAddress");
    if (!walletAddress) {
      toast.error("Wallet not connected! Please connect your MetaMask wallet.");
      return;
    }
    try {
      setStatus("🔄 Preparing deployment transaction...");

      // Request unsigned transaction from backend
      const response = await axios.post(
        `${config.API_BASE_URL}/blockchain/get-deploy-tx`,
        {
          contract_code: solidityCode,
          token_name: tokenName,
          token_symbol: tokenSymbol,
          total_supply: totalSupply,
          wallet_address: walletAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const { unsignedTx, bytecode, flattened_contract_path } = response.data;

      const details = {
        flattened_contract_path,
        deployment_bytecode: bytecode,
        token_name: tokenName,
        token_symbol: tokenSymbol,
        total_supply: totalSupply,
      };
      setDeploymentDetails(details);

      // Sign and send transaction with MetaMask
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tx = {
        data: unsignedTx.data,
        gasLimit: unsignedTx.gas,
      };

      const txResponse = await signer.sendTransaction(tx);
      toast.warning("Transaction sent, waiting for confirmation...");
      const txReceipt = await txResponse.wait();

      const contractAddress = txReceipt.contractAddress;
      const transactionHash = txReceipt.hash;  // or 'txReceipt.transactionHash' in some versions
      setTransactionHash(transactionHash);

      toast.success(`Token successfully deployed! TX Hash: ${transactionHash}`);
      console.log("Transaction receipt:", txReceipt);
      console.log("Contract address:", contractAddress);

      // Clean up generated code from session & state
      sessionStorage.removeItem("generatedCode");
      setSolidityCode("");

      // Verification step
      if (details) {
        const verifyResponse = await axios.post(
          `${config.API_BASE_URL}/blockchain/verify-contract`,
          {
            contract_address: contractAddress,
            flattened_contract_path: details.flattened_contract_path,
            deployment_bytecode: details.deployment_bytecode,
            token_name: details.token_name,
            token_symbol: details.token_symbol,
            total_supply: details.total_supply,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Verification response:", verifyResponse.data);
        toast.success("Verification completed!");
      } else {
        console.error("Deployment details missing for verification.");
      }

      // Store token details in DB
      await saveTokenDetails(transactionHash, contractAddress);
    } catch (error) {
      console.error("Error during deployment:", error);
      toast.error("Deployment failed.");
    }
  };

  // Store token details in the database
  const saveTokenDetails = async (txHash, contractAddress) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("user_id");

      if (!token || !userId) {
        toast.warning("Authorization token or user ID missing. Please log in.");
        return;
      }

      await axios.post(
        `${config.API_BASE_URL}/tokens/create`,
        {
          user_id: userId,
          token_name: tokenName,
          token_symbol: tokenSymbol,
          total_supply: totalSupply,
          decimals: decimals,
          network: network,
          transaction_hash: txHash,
          contract_address: contractAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setStatus("Token details stored successfully!");
    } catch (error) {
      setStatus("Error storing token details.");
      console.error(error);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="loader">
            <div className="box box0"><div></div></div>
            <div className="box box1"><div></div></div>
            <div className="box box2"><div></div></div>
            <div className="box box3"><div></div></div>
            <div className="box box4"><div></div></div>
            <div className="box box5"><div></div></div>
            <div className="box box6"><div></div></div>
            <div className="box box7"><div></div></div>
            <div className="ground"><div></div></div>
          </div>
        </div>
      )}

      {/* Fixed Navbar */}
      <Navbar />

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Main Content Container (offset below navbar) */}
      <div className="relative z-10 pt-20 px-4">
        <div className="flex flex-col items-center">
          {/* Form Container */}
          <div className="mb-20 space-y-6 backdrop-blur-lg bg-white/10 shadow-2xl rounded-3xl p-8 max-w-3xl w-full mx-auto border border-white/20">
            <h2 className="text-3xl font-semibold text-white text-center">
              Create Your Token
            </h2>

            {/* Token Name */}
            <div className="flex justify-center">
              <input
                type="text"
                placeholder="Token Name"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                className="w-3/4 max-w-lg p-4 border rounded-xl shadow-md bg-white bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Token Symbol */}
            <div className="flex justify-center">
              <input
                type="text"
                placeholder="Token Symbol"
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value)}
                className="w-3/4 max-w-lg p-4 border rounded-xl shadow-md"
                required
              />
            </div>

            {/* Total Supply */}
            <div className="flex justify-center">
              <input
                type="number"
                placeholder="Total Supply"
                value={totalSupply}
                onChange={(e) => setTotalSupply(e.target.value)}
                className="w-3/4 max-w-lg p-4 border rounded-xl shadow-md"
                required
              />
            </div>

            {/* Decimals */}
            <div className="flex justify-center">
              <input
                type="number"
                placeholder="Decimals"
                value={decimals}
                onChange={(e) => setDecimals(e.target.value)}
                className="w-3/4 max-w-lg p-4 border rounded-xl shadow-md"
                required
              />
            </div>

            {/* Network (disabled = Ethereum) */}
            <div className="flex justify-center">
              <select
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                className="w-3/4 max-w-lg p-4 border rounded-xl shadow-md"
                disabled
              >
                <option value="Ethereum">Ethereum (ERC-20)</option>
                {/* <option value="BEP-20">Binance Smart Chain (BEP-20)</option> */}
                {/* <option value="Solana">Solana (SPL)</option> */}
              </select>
            </div>

            {/* Additional Features */}
            <div className="flex flex-col items-center space-y-4">
              <input
                type="number"
                placeholder="Burn Rate (%)"
                value={burnRate}
                onChange={(e) => setBurnRate(e.target.value)}
                className="w-3/4 max-w-lg p-4 border rounded-xl shadow-md"
              />

              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={staking}
                    onChange={(e) => setStaking(e.target.checked)}
                    className="transform transition-all duration-300"
                  />
                  <span className="text-white">Enable Staking</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={mintable}
                    onChange={(e) => setMintable(e.target.checked)}
                    className="transform transition-all duration-300"
                  />
                  <span className="text-white">Mintable</span>
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0 justify-center items-center">
              <button
                onClick={generateSmartContract}
                className="btn"
                style={{ background: "linear-gradient(45deg, #8B5CF6, #3B82F6)" }}
              >
                Generate Contract
              </button>
              <button
                onClick={deploySmartContract}
                className="btn"
                style={{ background: "linear-gradient(45deg, #8B5CF6, #3B82F6)" }}
              >
                Deploy Token
              </button>
            </div>

            {/* Display Solidity Code */}
            {solidityCode && (
              <div className="mt-6 p-4 border rounded-xl bg-gray-100 text-gray-700 overflow-auto max-w-full break-words shadow-md">
                <strong>Generated Solidity Code:</strong>
                <pre className="whitespace-pre-wrap break-words text-sm bg-white p-4 rounded-xl">
                  {solidityCode || "No contract generated yet."}
                </pre>
              </div>
            )}

            {/* Status & Transaction Hash */}
            {status && (
              <p className="text-center text-green-500 mt-6">{status}</p>
            )}
            {transactionHash && (
              <div className="mt-6 p-4 bg-gray-100 border rounded-xl shadow-md">
                <h3 className="text-lg font-semibold">Transaction Hash:</h3>
                <pre className="text-sm text-gray-700">{transactionHash}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateToken;
