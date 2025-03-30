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
    <div className="max-w-md mx-auto bg-white p-6 mt-60 shadow-2xl rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4 text-blue-600">
        Reset Password
      </h2>
  
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          className="w-full p-3 mb-3 border rounded pr-10 shadow-lg transform transition-all duration-300 hover:scale-10 hover:shadow-2xl"
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
  
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-md text-lg transition-all duration-500 transform hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-700 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Reset Password
        </button>
      </form>
  
      {message && <p className="text-center mt-3 text-green-500">{message}</p>}
  
      {/* Sign In Link After Successful Reset */}
      {message && message.includes("successfully") && (
        <p className="text-center mt-3 text-gray-600">
          <Link to="/signin" className="text-blue-500 hover:underline">
            Go to Sign In
          </Link>
        </p>
      )}
    </div>
  );
}
export default ResetPassword;
