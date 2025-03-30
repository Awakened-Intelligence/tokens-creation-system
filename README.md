# Token Generation & Verification Platform

This project is a full-stack application that enables users to generate, deploy, verify, and store details of ERC-20 token contracts on an Ethereum-compatible network (e.g., Sepolia). The system leverages GPT-4 to generate Solidity smart contract code, uses MetaMask for client-side transaction signing, and verifies deployed contracts via a third-party API (e.g., LineaScan). The project is split into two parts:

- **Backend:** A Flask/Python service that compiles, flattens, and prepares deployment transactions; verifies contracts; and saves token details.
- **Frontend:** A React application that allows users to generate smart contract code, deploy tokens via MetaMask, and automatically verify and save token details.
