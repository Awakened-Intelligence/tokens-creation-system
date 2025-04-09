import React from "react";
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
import bgImage from './assets/coin.png';


function App() {
  return (
    <div
    className="min-h-screen relative overflow-hidden"
    style={{ 
      background: 'radial-gradient(circle at 50% -20%, #2C3E50, #000428)',
      backgroundAttachment: 'fixed'
    }}
  >
    <div className="absolute inset-0" style={{
      background: 'linear-gradient(45deg, rgba(76, 0, 255, 0.15) 0%, rgba(0, 255, 255, 0.15) 100%)',
      filter: 'blur(150px)',
      transform: 'translate3d(0, 0, 0)',
      pointerEvents: 'none'
    }}></div>
    <div className="absolute inset-0" style={{
      background: 'radial-gradient(circle at 30% 50%, rgba(255, 59, 0, 0.1), transparent 25%), radial-gradient(circle at 70% 50%, rgba(0, 255, 255, 0.1), transparent 25%)',
      pointerEvents: 'none'
    }}></div>
    <div className="relative z-10">
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
    </div>
  );
}

export default App;
