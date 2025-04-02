# Token Generation & Deployment Frontend

This React application allows users to generate, deploy, verify, and store ERC-20 token contracts. It interacts with a Flask backend that compiles and flattens Solidity contracts, prepares unsigned deployment transactions, verifies deployed contracts via a third-party API (e.g., LineaScan), and saves token details in a database. MetaMask (via Ethers.js) is used on the client side to sign and broadcast transactions.

## Features

- **Smart Contract Generation:**  
  Generate Solidity smart contract code using a GPT-4-powered backend based on user inputs.

- **Token Deployment:**  
  Retrieve an unsigned deployment transaction and other necessary details from the backend, then use MetaMask to sign and send the transaction.

- **Automatic Contract Verification:**  
  Once the transaction is confirmed, the application automatically sends the contract address (from the transaction receipt) along with stored deployment details to the backend for contract verification.

- **Token Detail Storage:**  
  After deployment and verification, token details (transaction hash, contract address, token parameters) are saved via the backend API.

- **Real-Time Notifications:**  
  Provides status updates using toast notifications.

## Project Structure

/frontend ├── package.json # Node dependencies and scripts ├── public/ ├── src/ │ ├── components/ │ │ └── Navbar.jsx # Navigation component │ ├── pages/ │ │ └── CreateToken.jsx # Main page for creating and deploying tokens │ └── config.js # Configuration file with API_BASE_URL, etc. └── README.md # This file

## Prerequisites

- **Node.js** (v14+ recommended)
- **npm** or **yarn** for dependency management

## Installation

1. **Clone the Repository or Navigate to the Frontend Directory:**
   ```bash
   cd frontend
"Instructions on how to install and run the frontend locally." 
