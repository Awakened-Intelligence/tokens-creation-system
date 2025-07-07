import React from "react";
import './App.css';
import './index.css';
import './App.css';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/homepage"; // Import Home Page
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
import bgImage from './assets/coin1.jpg';



function App() {
  return (
    <div
    className="min-h-screen bg-cover bg-center"
    style={{ backgroundImage: `url(${bgImage})` }}
  >
    <Router>
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
    </Router>
    </div>
  );
}

export default App;
