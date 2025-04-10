
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {  FiMenu } from "react-icons/fi";
import "../styles/style.css"
// import Typed from 'react-typed';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState("");
  const [walletType, setWalletType] = useState("");
  const [network, setNetwork] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getTokenTimeLeft = (token) => {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const expTime = decoded.exp * 1000; // Convert to milliseconds
      const now = Date.now();
      const timeLeft = expTime - now;

      if (timeLeft <= 0) return "⛔ Token has expired";

      const seconds = Math.floor((timeLeft / 1000) % 60);
      const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
      const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);

      return `${hours}h ${minutes}m ${seconds}s left`;
    } catch (error) {
      return "⚠️ Invalid token";
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const timeLeft = getTokenTimeLeft(token);
      console.log("⏳ Token expiry time left:", timeLeft);
    }
  }, []);


  const isTokenExpired = (token) => {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded.exp * 1000 < Date.now();  // Check if expired
    } catch (error) {
      return true; // Treat as expired if decoding fails
    }
  };
  useEffect(() => {
    // Check if token is expired
    const token = localStorage.getItem("token");
    if (token && isTokenExpired(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      disconnectWallet(); // Also disconnect wallet
      setIsAuthenticated(false);
      navigate("/signin");
      console.log("⛔ Token expired. User has been logged out.");
    } else {
      setIsAuthenticated(!!token); // still valid
    }

    loadWallet();

    // Wallet events
    window.addEventListener("walletConnected", loadWallet);
    window.addEventListener("walletDisconnected", clearWallet);

    return () => {
      window.removeEventListener("walletConnected", loadWallet);
      window.removeEventListener("walletDisconnected", clearWallet);
    };
  }, []);


  const loadWallet = () => {
    const savedWallet = localStorage.getItem("walletAddress");
    if (savedWallet) {
      setWalletAddress(savedWallet);
      setWalletType("Ethereum");
    } else {
      clearWallet();
    }
  };

  const clearWallet = () => {
    console.log("Navbar detected wallet disconnection.");
    setWalletAddress("");
    setWalletType("");
    setNetwork("");
  };

  useEffect(() => {
    loadWallet();

    // Listen for wallet connection/disconnection events
    window.addEventListener("walletConnected", loadWallet);
    window.addEventListener("walletDisconnected", clearWallet);

    return () => {
      window.removeEventListener("walletConnected", loadWallet);
      window.removeEventListener("walletDisconnected", clearWallet);
    };
  }, []);

  const disconnectWallet = () => {
    localStorage.removeItem("walletAddress");
    setWalletAddress("");
    setWalletType("");
    setNetwork("");

    // Dispatch event for ConnectWallet page to update
    window.dispatchEvent(new Event("walletDisconnected"));

    console.log("Wallet disconnected from Navbar.");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    setIsAuthenticated(false);
    disconnectWallet();
    navigate("/signin"); // ✅ Redirect to sign-in page after logout
  };

  return (
    <>

     <nav className="w-full p-4  justify-between items-center fixed top-0 left-0 z-50 lg:flex hidden rounded-xl bg-gradient-to-r from-white via-blue-200 to-white">

{/* Logo Section */}
<div className="flex items-center">
  <h1 className="text-2xl font-bold text-black typewriter">
    AI Token Generation
  </h1>
</div>


{/* Centered Navigation Links with border */}
<div className="flex items-center mt-2 px-4 bg-black text-white space-x-10 border-l-2 border-r-2 border-black rounded-2xl  py-4">
  <Link
    to="/"
    className={`text-lg font-semibold text-white hover:text-[#4169e1] transition-all duration-300 ${location.pathname === "/" ? "border-b-2 hover:border-[#4169e1]  border-[#4169e1] text-[#4169e1]" : ""}`}
  >
    Home
  </Link>
  <Link
    to="/create-token"
    className={`text-lg font-semibold text-white hover:text-[#4169e1] transition-all duration-300 ${location.pathname === "/create-token" ? "border-b-2 hover:border-[#4169e1] border-[#4169e1] text-[#4169e1]"  : ""}`}
  >
    Create Token
  </Link>
  <Link
    to="/dashboard"
    className={`text-lg font-semibold text-white hover:text-[#4169e1] transition-all duration-300 ${location.pathname === "/dashboard" ? "border-b-2 hover:border-[#4169e1] border-[#4169e1] text-[#4169e1]" : ""}`}
  >
    Dashboard
  </Link>
  <Link
    to="/ICO-Page"
    className={`text-lg font-semibold text-white hover:text-[#4169e1] transition-all duration-300 ${location.pathname === "/ICO-Page" ? "border-b-2 hover:border-[#4169e1] border-[#4169e1] text-[#4169e1]" : ""}`}
  >
    Join ICO/IDO
  </Link>
</div>

{/* Right-side Buttons */}
<div className="flex items-center space-x-4">
  {walletAddress ? (
    <div className="flex items-center space-x-2">
      <span className="bg-green-500 px-4 py-2 rounded-md transition-all duration-500 transform hover:bg-gradient-to-r hover:from-green-500 hover:to-red-700 hover:scale-105 hover:shadow-xl">
        {walletType === "Ethereum" ? "ETH" : "SOL"} | {network} |{" "}
        {walletAddress.substring(0, 6)}...{walletAddress.slice(-4)}
      </span>
      <button
        onClick={disconnectWallet}
        className="btn"
      >
        Disconnect
      </button>
    </div>
  ) : (
    <Link to="/connect-wallet">
     <button className="btn">

  Connect Wallet
</button>

    </Link>
  )}

  {!isAuthenticated ? (
    <Link
      to="/signin"

    >
<button className="btn" style={{backgroundColor:"#4169e1"}}>
      Sign In
      </button>
    </Link>
  ) : (
    <Link
      to="#"
      onClick={handleLogout}

    >
      <button className="btn" style={{backgroundColor:"#4169e1"}}>
      Logout
      </button>
    </Link>
  )}
</div>
</nav>


      {/* Mobile Navbar */}
      <nav className="w-full bg-blue-600 p-6 flex justify-between items-center text-white fixed top-0 left-0 z-50 lg:hidden">
  <div>
    <h1 className="text-2xl font-bold whitespace-nowrap text-ellipsis ">
      AI Token Generator
    </h1>
  </div>

  <div className="flex items-center">
  <div 
    onClick={() => setIsMenuOpen(!isMenuOpen)} 
    className="text-2xl cursor-pointer"  // Add cursor-pointer to make it look clickable
  >
    <FiMenu />
  </div>
</div>


  {/* Mobile Menu - Only shown when hamburger is clicked */}
  {isMenuOpen && (
    <div className="absolute top-16 left-0 right-0 bg-blue-600 p-6">
      <ul className="space-y-4">
        <li>
          <Link
            to="/"
            className={`block text-xl font-bold hover:text-blue-300 ${
              location.pathname === "/" ? "underline underline-offset-4" : ""
            }`}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/create-token"
            className={`block text-xl font-bold hover:text-blue-300 ${
              location.pathname === "/create-token" ? "underline underline-offset-4" : ""
            }`}
          >
            Create Token
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard"
            className={`block text-xl font-bold hover:text-blue-300 ${
              location.pathname === "/dashboard" ? "underline underline-offset-4" : ""
            }`}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/ICO-Page"
            className="block text-xl font-bold hover:text-blue-300"
          >
            Join ICO/IDO
          </Link>
        </li>

        <div className="mt-4">
          {walletAddress ? (
            <div className="flex items-center space-x-2 mb-4">
              <span className="bg-green-500 px-4 py-2 rounded-md transition-all duration-500 transform hover:bg-gradient-to-r hover:from-green-500 hover:to-red-700 hover:scale-105 hover:shadow-xl">
                {walletType === "Ethereum" ? "ETH" : "SOL"} | {network} |{" "}
                {walletAddress.substring(0, 6)}...{walletAddress.slice(-4)}
              </span>
              <Link
                to="#"
                onClick={disconnectWallet}
                className="bg-red-500 px-4 py-2 rounded-md transition-all duration-500 transform hover:bg-gradient-to-r hover:from-yellow-500 hover:to-red-700 hover:scale-105 hover:shadow-xl"
              >
                Disconnect
              </Link>
            </div>
          ) : (
            <Link
              to="/connect-wallet"
              className="block text-xl font-bold hover:text-blue-300 mb-4"
            >
              Connect Wallet
            </Link>
          )}

          {/* Login and Logout Links */}
          {!isAuthenticated ? (
            <li>
              <Link
                to="/signin"
                className="block text-xl font-bold hover:text-blue-300"
              >
                Login
              </Link>
            </li>
          ) : (
            <li>
              <Link
                to="#"
                onClick={handleLogout}
                className="block text-xl font-bold hover:text-blue-300"
              >
                Logout
              </Link>
            </li>
          )}
        </div>
      </ul>
    </div>
  )}
</nav>

    </>
  );
}

export default Navbar;
