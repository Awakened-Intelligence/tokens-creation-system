import React, { useState,useEffect } from "react";
import Navbar from "../components/navbar";
import config from "../config";
import { BrowserProvider } from "ethers";
// import coinImage from '../assets/coin.png';
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
  const [transactionHash, setTransactionHash] = useState(""); // Store transaction hash after deployment
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


  // Step 1: Call GPT-4 to Generate Solidity Code
  const generateSmartContract = async () => {
    try {
      setIsLoading(true); //  Show loader
      setSolidityCode(""); //  Clear old code before generating a new one
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

        console.log(" Sending Payload to GPT Route:", payload); // Debugging

        const response = await axios.post(`${config.API_BASE_URL}/gpt/generate-smart-contract`, payload);
        // setSolidityCode(response.data.smart_contract_code);
        const code = response.data.smart_contract_code;
setSolidityCode(code);
sessionStorage.setItem("generatedCode", code); // ✅ Save it

toast.success(" Smart contract generated successfully!");


    } catch (error) {
        console.error(" Error generating contract:", error);
        toast.error("Error generating smart contract!");

    }finally {
      setIsLoading(false);  //Hide loader after completion
    }
};


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

      // Request unsigned transaction and extra deployment details from backend
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
      console.log("Unsigned transaction received:", unsignedTx);

      const details = {
        flattened_contract_path,
        deployment_bytecode: bytecode,
        token_name: tokenName,
        token_symbol: tokenSymbol,
        total_supply: totalSupply,
      };
      setDeploymentDetails(details);

      // Use MetaMask to sign and send the transaction
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tx = {
        data: unsignedTx.data,
        gasLimit: unsignedTx.gas,
      };

      const txResponse = await signer.sendTransaction(tx);
      toast.warning("Transaction sent, waiting for confirmation...");
      const txReceipt = await txResponse.wait();
      // const { transactionHash, contractAddress } = txReceipt;
      const contractAddress=txReceipt.contractAddress
      setTransactionHash(transactionHash);
      toast.success(`Token successfully deployed! TX Hash: ${transactionHash}`);
      console.log("Transaction receipt:", txReceipt);
      console.log("contract address:", contractAddress);
      // console.log("hash :", txReceipt.hash);

      // Clean up generated code from session and state
      sessionStorage.removeItem("generatedCode");
      setSolidityCode("");

      // Now, automatically call the verification endpoint using the stored details and the received contractAddress
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

      // Finally, save token details in the database
      await saveTokenDetails(transactionHash, contractAddress);
    } catch (error) {
      console.error("Error during deployment:", error);
      toast.error("Deployment failed.");
    }
  };


  // Step 3: Store Token Details in Database
  const saveTokenDetails = async (txHash,contractAddress) => {
    try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("user_id");

        if (!token || !userId) {
            toast.warning("Authorization token or user ID missing. Please log in.");
            return;
        }

        await axios.post(`${config.API_BASE_URL}/tokens/create`, {
            user_id: userId, 
            token_name: tokenName,
            token_symbol: tokenSymbol,
            total_supply: totalSupply,
            decimals: decimals,
            network: network,
            transaction_hash: txHash,
            contract_address: contractAddress,

        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        setStatus("Token details stored successfully!");

    } catch (error) {
        setStatus("Error storing token details.");
        console.error(error);
    }
};
        
  return (
<div>
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

  <Navbar />
  <ToastContainer position="top-right" autoClose={3000} />
  {/* Hero Section */}
  <div className="flex flex-col items-center mt-20 px-4">
    
    
    {/* Token Input Fields */}
    <div className="mt-20 mb-20 space-y-6 bg-black shadow-2xl rounded-3xl p-8 max-w-3xl border-2 border-black w-full mx-auto">
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
      className="w-3/4 max-w-lg p-4 border rounded-xl shadow-md"
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

  {/* Blockchain Network Selection */}
  <div className="flex justify-center">
  <select
    value={network}
    onChange={(e) => setNetwork(e.target.value)}
    className="w-3/4 max-w-lg p-4 border rounded-xl shadow-md "
    disabled  // Disable the select dropdown so it cannot be changed
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
    className="btn" style={{backgroundColor:"#4169e1"}}
  >
    Generate Contract
  </button>
  <button
    onClick={deploySmartContract}
    className="btn" style={{backgroundColor:"#4169e1"}}
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

  {status && <p className="text-center text-green-500 mt-6">{status}</p>}

  {transactionHash && (
    <div className="mt-6 p-4 bg-gray-100 border rounded-xl shadow-md">
      <h3 className="text-lg font-semibold">Transaction Hash:</h3>
      <pre className="text-sm text-gray-700">{transactionHash}</pre>
    </div>
  )}
</div>


  </div>
</div>

    
  );
}

export default CreateToken;
