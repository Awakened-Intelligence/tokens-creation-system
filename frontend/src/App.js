
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/homepage";
import { TokenProvider } from "./context/TokenContext"; 
import Createtoken from "./pages/create-token";
import Dashboard from "./pages/dashboard";
import SignInPage from './pages/Signin';
import SignUpPage from './pages/Signup';
import ICOPage from "./pages/ICOpage";
import ForgotPassword from './components/Auth/Forgot-Password';
import ResetPassword from './components/Auth/Reset-Password';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import ConnectWallet from "./pages/ConnectWallet";
import VerificationFailed from "./pages/VerificationFailed";
import bgImage from './assets/coin.png';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: '100% 100%' }}>
        <div className="fixed top-0 left-0 h-full w-64 bg-blue-600 shadow-xl">
          <div className="p-4 mt-8">
            <h1 className="text-2xl font-bold text-white mb-8 typewriter">AI Token Generation</h1>
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-white hover:text-blue-400 font-semibold py-2">Home</Link>
              <Link to="/create-token" className="text-white hover:text-blue-400 font-semibold py-2">Create Token</Link>
              <Link to="/dashboard" className="text-white hover:text-blue-400 font-semibold py-2">Dashboard</Link>
              <Link to="/ICO-Page" className="text-white hover:text-blue-400 font-semibold py-2">Join ICO/IDO</Link>
              <Link to="/connect-wallet" className="text-white hover:text-blue-400 font-semibold py-2">Connect Wallet</Link>
            </nav>
          </div>
        </div>
        <div className="flex-1 ml-64">
          <Routes>
            <Route path="/" element={<Home />} /> 
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/verification-failed" element={<VerificationFailed />} />
            <Route path="/create-token" element={<ProtectedRoute><TokenProvider><Createtoken /></TokenProvider></ProtectedRoute>} /> 
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/ICO-Page" element={<ProtectedRoute><ICOPage /></ProtectedRoute>} /> 
            <Route path="/connect-wallet" element={<ProtectedRoute><ConnectWallet /></ProtectedRoute>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
