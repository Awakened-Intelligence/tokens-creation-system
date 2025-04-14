import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import "../styles/style.css";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [walletAddress, setWalletAddress] = useState("");
  const [walletType, setWalletType] = useState("");
  const [network, setNetwork] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);

  // ===== Token Expiry Helpers =====
  const getTokenTimeLeft = (token) => {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const expTime = decoded.exp * 1000;
      const now = Date.now();
      const timeLeft = expTime - now;
      if (timeLeft <= 0) return "⛔ Token has expired";
      const seconds = Math.floor((timeLeft / 1000) % 60);
      const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
      const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
      return `${hours}h ${minutes}m ${seconds}s left`;
    } catch {
      return "⚠️ Invalid token";
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("⏳ Token expiry time left:", getTokenTimeLeft(token));
    }
  }, []);

  const isTokenExpired = (token) => {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  // ===== On Mount: Check Auth/Wallet, Listen for Events =====
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && isTokenExpired(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      disconnectWallet();
      setIsAuthenticated(false);
      navigate("/signin");
      console.log("⛔ Token expired. User has been logged out.");
    } else {
      setIsAuthenticated(!!token);
    }
    loadWallet();

    window.addEventListener("walletConnected", loadWallet);
    window.addEventListener("walletDisconnected", clearWallet);

    return () => {
      window.removeEventListener("walletConnected", loadWallet);
      window.removeEventListener("walletDisconnected", clearWallet);
    };
  }, [navigate]);

  // ===== Wallet Handlers =====
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
    setWalletAddress("");
    setWalletType("");
    setNetwork("");
  };

  const disconnectWallet = () => {
    localStorage.removeItem("walletAddress");
    setWalletAddress("");
    setWalletType("");
    setNetwork("");
    window.dispatchEvent(new Event("walletDisconnected"));
    console.log("Wallet disconnected from Navbar.");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    disconnectWallet();
    setIsAuthenticated(false);
    setTimeout(() => {
      navigate("/signin");
    }, 100);
  };

  // ====================== RENDER ======================
  return (
    <>
      {/* 
        === DESKTOP (LG+) === 
        Top bar + sliding sidebar remain the same as before 
      */}
      <div className="hidden lg:block fixed top-0 left-0 w-full z-60">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-black typewriter">
            AI Token Generation
          </h1>
        </div>
      </div>

      {/* DESKTOP SLIDING SIDEBAR (fills entire height) */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-50">
        {isDesktopMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsDesktopMenuOpen(false)}
          />
        )}
        {/* Hamburger Icon */}
        <div 
          onClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
          className={`fixed top-20 left-4 cursor-pointer z-50 hover:scale-110 transition-transform ${isDesktopMenuOpen ? 'hidden' : 'block'}`}
        >
          <FiMenu className="text-3xl" />
        </div>
        <nav
          className={`
            w-64 
            h-full 
            p-6 flex flex-col 
            transform ${isDesktopMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            transition-transform duration-300
            mt-16
            bg-gradient-to-r from-[#6c63ff] to-[#ff9aca]
            z-50
          `}
        >
          {/* Navigation Links */}
          <div className="flex flex-col space-y-6">
            <Link
              to="/"
              className={`text-lg font-semibold text-white transition-all duration-300 hover:text-gray-200 ${
                location.pathname === "/" ? "border-l-4 border-white pl-2" : ""
              }`}
            >
              Home
            </Link>
            <Link
              to="/create-token"
              className={`text-lg font-semibold text-white transition-all duration-300 hover:text-gray-200 ${
                location.pathname === "/create-token" ? "border-l-4 border-white pl-2" : ""
              }`}
            >
              Create Token
            </Link>
            <Link
              to="/dashboard"
              className={`text-lg font-semibold text-white transition-all duration-300 hover:text-gray-200 ${
                location.pathname === "/dashboard" ? "border-l-4 border-white pl-2" : ""
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/ICO-Page"
              className={`text-lg font-semibold text-white transition-all duration-300 hover:text-gray-200 ${
                location.pathname === "/ICO-Page" ? "border-l-4 border-white pl-2" : ""
              }`}
            >
              Join ICO/IDO
            </Link>
          </div>
        </nav>
      </div>




      {/* 
        === TOP-RIGHT MINI-BAR (DESKTOP) ===
        If you want to keep wallet/auth buttons on desktop. 
        Optional or can combine with top brand bar if desired.
      */}
      <div className="hidden lg:flex fixed top-4 right-4 z-50 space-x-4">
        {walletAddress ? (
          <div className="flex items-center space-x-3">
            <span className="bg-opacity-20 backdrop-blur-md bg-green-500 text-green-400 px-4 py-2 rounded-xl border border-green-400/30 font-medium transition-all duration-500 transform hover:scale-105 hover:shadow-xl flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              {walletType === "Ethereum" ? "ETH" : "SOL"} | {network} |{" "}
              {walletAddress.substring(0, 6)}...{walletAddress.slice(-4)}
            </span>
            <button 
              onClick={disconnectWallet} 
              className="bg-red-500/30 hover:bg-red-500/60 text-red-600 px-4 py-2 rounded-xl border border-red-400/30 font-medium transition-all duration-300 disconnect"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <Link to="/connect-wallet">
            <button className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-6 py-2 rounded-xl border border-blue-400/30 font-medium transition-all duration-300 transform hover:scale-105">
              Connect Wallet
            </button>
          </Link>
        )}
        {!isAuthenticated ? (
          <Link to="/signin">
            <button className="btn" style={{ backgroundColor: "#4169e1" }}>
              Sign In
            </button>
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="btn"
            style={{ backgroundColor: "#4169e1" }}
          >
            Logout
          </button>
        )}
      </div>

      {/* 
        === MOBILE NAVIGATION ===
        Shows ONLY the 3-line menu button 
        (the rest is in the expanded menu).
      */}
      <nav className="lg:hidden fixed top-0 left-0 w-full bg-blue-600 p-4 flex items-center justify-end text-white z-50">
        {/* Hamburger Menu (3 lines) */}
        <div
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-3xl cursor-pointer"
        >
          <FiMenu />
        </div>
      </nav>

      {/* 
        === MOBILE SLIDING MENU ===
        When the user clicks the 3 lines, this appears. 
        Includes links, wallet, and auth buttons if desired.
      */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsMobileMenuOpen(false);
            }
          }}
        >
          {/* Slide-Out Panel */}
          <div className="bg-blue-600 w-64 h-full p-6">
            {/* Close button or click outside to close */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white text-2xl mb-4"
            >
              &times;
            </button>

            {/* Navigation Links */}
            <ul className="space-y-4">
              <li>
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
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
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block text-xl font-bold hover:text-blue-300 ${
                    location.pathname === "/create-token"
                      ? "underline underline-offset-4"
                      : ""
                  }`}
                >
                  Create Token
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block text-xl font-bold hover:text-blue-300 ${
                    location.pathname === "/dashboard"
                      ? "underline underline-offset-4"
                      : ""
                  }`}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/ICO-Page"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-xl font-bold hover:text-blue-300"
                >
                  Join ICO/IDO
                </Link>
              </li>
            </ul>

            {/* Wallet/Auth Buttons on Mobile */}
            <div className="mt-6 space-y-4">
              {walletAddress ? (
                <div>
                  <span className="bg-green-500 px-4 py-2 rounded-md block mb-2">
                    {walletType === "Ethereum" ? "ETH" : "SOL"} | {network} |{" "}
                    {walletAddress.substring(0, 6)}...{walletAddress.slice(-4)}
                  </span>
                  <button
                    onClick={disconnectWallet}
                    className="btn w-full disconnect"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <Link to="/connect-wallet" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="btn w-full">Connect Wallet</button>
                </Link>
              )}
              {!isAuthenticated ? (
                <Link to="/signin" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="btn w-full" style={{ backgroundColor: "#4169e1" }}>
                    Sign In
                  </button>
                </Link>
              ) : (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="btn w-full"
                  style={{ backgroundColor: "#4169e1" }}
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;