
import React, { useState } from 'react';
import axios from 'axios';
import config from "../../config";
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.API_BASE_URL}/auth/reset-password/${token}`, {
        new_password: newPassword,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to reset password.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-blue-500 flex justify-center items-center">
      <div className="max-w-md w-full mx-auto bg-white/20 backdrop-blur-md p-6 shadow-2xl rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-4 text-white">
          Reset Password
        </h2>
  
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-3 mb-3 border rounded pr-10 bg-white/10 backdrop-blur-sm text-white placeholder-white/70"
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
  
          <button
            type="submit"
            className="w-full bg-blue-500/80 text-white p-3 rounded-md text-lg transition-all duration-500 transform hover:bg-blue-600/80 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Reset Password
          </button>
        </form>
  
        {message && <p className="text-center mt-3 text-white">{message}</p>}
  
        {message && message.includes("successfully") && (
          <p className="text-center mt-3 text-white/80">
            <Link to="/signin" className="text-white hover:underline">
              Go to Sign In
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
