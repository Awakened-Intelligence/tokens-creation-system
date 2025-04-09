import React from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/navbar";

function Home() {
  return (
    <div className="page-container"> {/* Added background gradient */}
      <Navbar />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"> {/* Updated container */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-white text-center mb-8">
          AI Token Generator
        </h1>
        <p className="text-2xl text-gray-100 text-center max-w-2xl mx-auto mb-12">
          Create and deploy your custom tokens effortlessly with the power of AI.
        </p>
        <Link to="/create-token">
          <button className="bg-white text-black py-3 px-6 rounded-lg font-bold hover:bg-gray-100 transition duration-300">
            Create Token
          </button>
        </Link>
      </div>


      {/* Features */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
        <div className="p-6 bg-white shadow-xl rounded-lg text-center hover:shadow-2xl transition duration-300"> {/* Updated styling */}
          <h3 className="text-xl font-semibold mb-2">AI Smart Contract Generation</h3>
          <p className="text-gray-600">Generate error-free contracts instantly.</p>
        </div>
        <div className="p-6 bg-white shadow-xl rounded-lg text-center hover:shadow-2xl transition duration-300">
          <h3 className="text-xl font-semibold mb-2">Deploy on Multiple Blockchains</h3>
          <p className="text-gray-600">Supports Ethereum, BSC, and Solana.</p>
        </div>
        <div className="p-6 bg-white shadow-xl rounded-lg text-center hover:shadow-2xl transition duration-300">
          <h3 className="text-xl font-semibold mb-2">No Coding Required</h3>
          <p className="text-gray-600">Easily create tokens without any programming.</p>
        </div>
        <div className="p-6 bg-white shadow-xl rounded-lg text-center hover:shadow-2xl transition duration-300">
          <h3 className="text-xl font-semibold mb-2">Secure & Audited Contracts</h3>
          <p className="text-gray-600">Ensuring security and best practices.</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 bg-gray-800 text-white p-4 text-center"> {/* Updated styling */}
        <p>&copy; 2025 AI Token Generator. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;