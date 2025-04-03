import React, { useState } from "react";
import Navbar from "../components/navbar";
import config from "../config";
import { ethers } from "ethers";
import axios from "axios";

function CreateToken() {
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [decimals, setDecimals] = useState(0);
  const [network, setNetwork] = useState("Ethereum");
  const [burnRate, setBurnRate] = useState(0);
  const [staking, setStaking] = useState(false);
  const [mintable, setMintable] = useState(false);
  const [status, setStatus] = useState("");
  const [solidityCode, setSolidityCode] = useState(""); // New state for Solidity code
  const [transactionHash, setTransactionHash] = useState(""); // Store transaction hash after deployment
  const [isLoading, setIsLoading] = useState(false);
  

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
        setSolidityCode(response.data.smart_contract_code);
        setStatus("Smart contract generated successfully!");

    } catch (error) {
        console.error(" Error generating contract:", error);
        setStatus("Error generating contract.");
    }finally {
      setIsLoading(false);  //Hide loader after completion
    }
};

  // Step 2: Deploy Solidity Code to Blockchain
  


const deploySmartContract = async () => {
    if (!solidityCode) {
        setStatus("❌ No Solidity code available. Generate a contract first.");
        return;
    }

    const walletAddress = localStorage.getItem("walletAddress");
    if (!walletAddress) {
        setStatus("❌ Wallet not connected! Please connect your MetaMask wallet.");
        return;
    }

    try {
        setStatus("🔄 Preparing deployment transaction...");

        // ✅ Step 1: Request Unsigned Transaction from Backend
        const response = await axios.post(
            `${config.API_BASE_URL}/blockchain/get-deploy-tx`,
            {
                contract_code: solidityCode,
                token_name: tokenName,
                token_symbol: tokenSymbol,
                total_supply: totalSupply,
                wallet_address: walletAddress, // ✅ Send user's wallet address
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const { unsignedTx, contractAddress } = response.data;

        // ✅ Step 2: Request MetaMask to Sign the Transaction
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const signedTx = await signer.signTransaction(unsignedTx);

        setStatus("🚀 Sending signed transaction to the blockchain...");

        // ✅ Step 3: Send the Signed Transaction to Backend for Broadcasting
        const txResponse = await axios.post(
            `${config.API_BASE_URL}/blockchain/send-signed-tx`,
            { signed_tx: signedTx },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const { transaction_hash } = txResponse.data;

        setTransactionHash(transaction_hash);
        setStatus(`✅ Token successfully deployed! TX Hash: ${transaction_hash}`);

        // ✅ Step 4: Save Token Details in Database
        saveTokenDetails(transaction_hash, contractAddress);

    } catch (error) {
        console.error("❌ Error during deployment:", error);
        setStatus("❌ Deployment failed.");
    }
};



  // Step 3: Store Token Details in Database
  const saveTokenDetails = async (txHash) => {
    try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("user_id");

        if (!token || !userId) {
            setStatus("Authorization token or user ID missing. Please log in.");
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
      {/* <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div> */}
      
<div class="loader">
  <div class="box box0">
    <div></div>
  </div>
  <div class="box box1">
    <div></div>
  </div>
  <div class="box box2">
    <div></div>
  </div>
  <div class="box box3">
    <div></div>
  </div>
  <div class="box box4">
    <div></div>
  </div>
  <div class="box box5">
    <div></div>
  </div>
  <div class="box box6">
    <div></div>
  </div>
  <div class="box box7">
    <div></div>
  </div>
  <div class="ground">
    <div></div>
  </div>
</div>
    </div>
  )}
   
      
      <Navbar />
      <div className="mt-40 max-w-3xl mx-auto p-6 bg-white shadow-2xl rounded-lg">
        <h2 className="text-2xl font-bold text-center text-blue-600">Create Your Token</h2>
        
        {/* Token Input Fields */}
        <div className="mt-8 space-y-4">
  <input
    type="text"
    placeholder="Token Name"
    value={tokenName}
    onChange={(e) => setTokenName(e.target.value)}
    className="w-full p-3 border rounded-md shadow-lg transform transition-all duration-300 hover:scale-10 hover:shadow-2xl"
    required
  />
  <input
    type="text"
    placeholder="Token Symbol"
    value={tokenSymbol}
    onChange={(e) => setTokenSymbol(e.target.value)}
    className="w-full p-3 border rounded-md shadow-lg transform transition-all duration-300 hover:scale-10 hover:shadow-2xl"
    required
  />
  <input
    type="number"
    placeholder="Total Supply"
    value={totalSupply}
    onChange={(e) => setTotalSupply(e.target.value)}
    className="w-full p-3 border rounded-md shadow-lg transform transition-all duration-300 hover:scale-10 hover:shadow-2xl"
    required
  />
  <input
    type="number"
    placeholder="Decimals"
    value={decimals}
    onChange={(e) => setDecimals(e.target.value)}
    className="w-full p-3 border rounded-md shadow-lg transform transition-all duration-300 hover:scale-10 hover:shadow-2xl"
    required
  />

  {/* Blockchain Network Selection */}
  <select
    value={network}
    onChange={(e) => setNetwork(e.target.value)}
    className="w-full p-3 border rounded-md shadow-lg transform transition-all duration-300 hover:scale-10 hover:shadow-2xl"
  >
    <option value="Ethereum">Ethereum (ERC-20)</option>
    <option value="BEP-20">Binance Smart Chain (BEP-20)</option>
    <option value="Solana">Solana (SPL)</option>
  </select>

  {/* Additional Features */}
  <div className="flex items-center space-x-4">
    <input
      type="number"
      placeholder="Burn Rate (%)"
      value={burnRate}
      onChange={(e) => setBurnRate(e.target.value)}
      className="p-3 border rounded-md w-1/2 shadow-lg transform transition-all duration-300 hover:scale-10 hover:shadow-2xl"
    />
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={staking}
        onChange={(e) => setStaking(e.target.checked)}
        className="transform transition-all duration-300 hover:scale-110"
      />
      <span>Enable Staking</span>
    </label>
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={mintable}
        onChange={(e) => setMintable(e.target.checked)}
        className="transform transition-all duration-300 hover:scale-110"
      />
      <span>Mintable</span>
    </label>
  </div>

  {/* Buttons */}
  <div className="flex justify-between">
    <button
      onClick={generateSmartContract}
      className="bg-green-500 text-white p-3 text-white rounded-md text-lg transition-all duration-500 transform hover:bg-gradient-to-r hover:from-green-500 hover:to-blue-700 hover:scale-105 shadow-lg hover:shadow-xl"
    >
      Generate Contract
    </button>
    <button
      onClick={deploySmartContract}
      className="bg-blue-500 text-white p-3 text-white rounded-md text-lg transition-all duration-500 transform hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-700 hover:scale-105 shadow-lg hover:shadow-xl"
    >
      Deploy Token
    </button>
  </div>

  {/* Display Solidity Code */}
  {solidityCode && (
    <div className="mt-4 p-3 border rounded-md bg-gray-100 text-gray-700 overflow-auto max-w-full break-words shadow-lg transform transition-all duration-300 hover:scale-10 hover:shadow-2xl">
      <strong>Generated Solidity Code:</strong>
      <pre className="whitespace-pre-wrap break-words text-sm bg-white p-2 rounded-md">
        {solidityCode || "No contract generated yet."}
      </pre>
    </div>
  )}

  
  {status && <p className="text-center text-green-500 mt-4">{status}</p>}

  
  {transactionHash && (
    <div className="mt-4 p-2 bg-gray-100 border rounded-md shadow-lg transform transition-all duration-300 hover:scale-10 hover:shadow-2xl">
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

// import React, { useState } from "react";
// import Navbar from "../components/navbar";
// import config from "../config";
// import axios from "axios";
// import { useToken } from "../context/TokenContext"; // Import Token Context

// function CreateToken() {
//   const { tokenData, setTokenData } = useToken(); // Use global state from context
//   const [status, setStatus] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   // Helper function to update token data
//   const updateTokenData = (key, value) => {
//     setTokenData((prev) => ({ ...prev, [key]: value }));
//   };

//   // Step 1: Generate Smart Contract
//   const generateSmartContract = async () => {
//     try {
//       setIsLoading(true);
//       updateTokenData("solidityCode", "");
//       const payload = {
//         token_name: tokenData.tokenName,
//         token_symbol: tokenData.tokenSymbol,
//         total_supply: tokenData.totalSupply,
//         decimals: tokenData.decimals,
//         network: tokenData.network,
//         burn_rate: parseFloat(tokenData.burnRate),
//         staking: tokenData.staking,
//         mintable: tokenData.mintable,
//       };

//       const response = await axios.post(
//         `${config.API_BASE_URL}/gpt/generate-smart-contract`,
//         payload
//       );

//       updateTokenData("solidityCode", response.data.smart_contract_code);
//       setStatus("✅ Smart contract generated successfully!");
//     } catch (error) {
//       console.error("❌ Error generating contract:", error);
//       setStatus("❌ Error generating contract.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Step 2: Deploy Smart Contract
//   const deploySmartContract = async () => {
//     if (!tokenData.solidityCode) {
//       setStatus("⚠️ No Solidity code available. Generate a contract first.");
//       return;
//     }

//     try {
//       setStatus("🚀 Deploying token...");

//       const response = await axios.post(
//         `${config.API_BASE_URL}/blockchain/deploy`,
//         { contract_code: tokenData.solidityCode },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       updateTokenData("transactionHash", response.data.transaction_hash);
//       setStatus("🎉 Token successfully deployed!");
//     } catch (error) {
//       console.error(error);
//       setStatus("❌ Error deploying contract.");
//     }
//   };

//   // Step 3: Refresh Data (Resets Form)
//   const refreshData = () => {
//     setTokenData({
//       tokenName: "",
//       tokenSymbol: "",
//       totalSupply: "",
//       decimals: 0,
//       network: "Ethereum",
//       burnRate: 0,
//       staking: false,
//       mintable: false,
//       solidityCode: "",
//       transactionHash: "",
//     });
//     setStatus("✅ Form reset successfully!");
//   };

//   return (
//     <div>
//       <Navbar />
//       <div className="mt-40 max-w-3xl mx-auto p-6 bg-white shadow-2xl rounded-lg">
//         <h2 className="text-2xl font-bold text-center text-blue-600">
//           Create Your Token
//         </h2>

//         {/* Refresh Button */}
//         <div className="flex justify-end mb-3">
//           <button
//             onClick={refreshData}
//             className="bg-red-500 text-white p-2 rounded-md text-sm transition-all duration-300 transform hover:scale-105 hover:bg-red-700"
//           >
//             Refresh Data
//           </button>
//         </div>

//         {/* Token Input Fields */}
//         <div className="mt-8 space-y-4">
//           <input
//             type="text"
//             placeholder="Token Name"
//             value={tokenData.tokenName}
//             onChange={(e) => updateTokenData("tokenName", e.target.value)}
//             className="w-full p-3 border rounded-md shadow-lg"
//             required
//           />
//           <input
//             type="text"
//             placeholder="Token Symbol"
//             value={tokenData.tokenSymbol}
//             onChange={(e) => updateTokenData("tokenSymbol", e.target.value)}
//             className="w-full p-3 border rounded-md shadow-lg"
//             required
//           />
//           <input
//             type="number"
//             placeholder="Total Supply"
//             value={tokenData.totalSupply}
//             onChange={(e) => updateTokenData("totalSupply", e.target.value)}
//             className="w-full p-3 border rounded-md shadow-lg"
//             required
//           />
//           <input
//             type="number"
//             placeholder="Decimals"
//             value={tokenData.decimals}
//             onChange={(e) => updateTokenData("decimals", e.target.value)}
//             className="w-full p-3 border rounded-md shadow-lg"
//             required
//           />

//           {/* Blockchain Network Selection */}
//           <select
//             value={tokenData.network}
//             onChange={(e) => updateTokenData("network", e.target.value)}
//             className="w-full p-3 border rounded-md shadow-lg"
//           >
//             <option value="Ethereum">Ethereum (ERC-20)</option>
//             <option value="BEP-20">Binance Smart Chain (BEP-20)</option>
//             <option value="Solana">Solana (SPL)</option>
//           </select>

//           {/* Additional Features */}
//           <div className="flex items-center space-x-4">
//             <input
//               type="number"
//               placeholder="Burn Rate (%)"
//               value={tokenData.burnRate}
//               onChange={(e) => updateTokenData("burnRate", e.target.value)}
//               className="p-3 border rounded-md w-1/2 shadow-lg"
//             />
//             <label className="flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 checked={tokenData.staking}
//                 onChange={(e) => updateTokenData("staking", e.target.checked)}
//               />
//               <span>Enable Staking</span>
//             </label>
//             <label className="flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 checked={tokenData.mintable}
//                 onChange={(e) => updateTokenData("mintable", e.target.checked)}
//               />
//               <span>Mintable</span>
//             </label>
//           </div>

//           {/* Buttons */}
//           <div className="flex justify-between">
//             <button onClick={generateSmartContract} className="bg-green-500 text-white p-3 rounded-md">
//               Generate Contract
//             </button>
//             <button onClick={deploySmartContract} className="bg-blue-500 text-white p-3 rounded-md">
//               Deploy Token
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CreateToken;
