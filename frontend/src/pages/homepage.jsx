import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar";

function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
    
      <div className="relative z-10">
        {/* Fixed Navbar (already styled in Navbar.jsx) */}
        <Navbar />

        {/* Main Content */}
        <div className="pt-20 flex flex-col items-center text-white px-4">
          {/* Hero Section */}
          <h2 className="text-4xl sm:text-1xl md:text-4xl font-bold text-black mt-8 text-center typewriter-effect max-w-full w-auto">
            Effortlessly Create & Deploy Your Token
          </h2>
          <p className="text-lg text-gray-700 mt-8 text-center">
            AI-powered token generator for Ethereum, Binance Smart Chain, and Solana.
          </p>
          <Link to="/create-token">
            <button className="btn mt-6">
              Create Token
            </button>
          </Link>

          {/* Features Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
            <div className="p-6 backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl rounded-xl text-center transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-3xl text-white">
              <h3 className="text-xl font-semibold">AI Smart Contract Generation</h3>
              <p className="mt-2">Generate error-free contracts instantly.</p>
            </div>

            <div className="p-6 backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl rounded-xl text-center transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-3xl text-white">
              <h3 className="text-xl font-semibold">Deploy on Multiple Blockchains</h3>
              <p className="mt-2">Supports Ethereum, BSC, and Solana.</p>
            </div>

            <div className="p-6 backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl rounded-xl text-center transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-3xl text-white">
              <h3 className="text-xl font-semibold">No Coding Required</h3>
              <p className="mt-2">Easily create tokens without any programming.</p>
            </div>

            <div className="p-6 backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl rounded-xl text-center transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-3xl text-white">
              <h3 className="text-xl font-semibold">Secure & Audited Contracts</h3>
              <p className="mt-2">Ensuring security and best practices.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-40 bg-gray-800 bg-opacity-90 text-white p-4 text-center w-full">
          <p>&copy; 2025 AI Token Generator. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default Home;
