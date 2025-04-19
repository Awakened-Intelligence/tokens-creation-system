import React, { useState } from 'react';
import config from "../../config";
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.API_BASE_URL}/auth/forgot-password`, { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <>
    <div className='p-6'>
    <div className="max-w-md mx-auto bg-white/20 backdrop-blur-md p-6 mt-60 shadow-2xl rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4 text-blue-600">Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          className="w-full p-3 mb-3 border rounded shadow-lg transform transition-all duration-300 hover:scale-10 hover:shadow-2xl "
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className='btn' style={{backgroundColor:'#4169e1'}}>
          Send Reset Link
        </button>
      </form>
      {message && <p className="text-center mt-3 text-green-500">{message}</p>}
    </div>
    </div>
    </>
  );
};

export default ForgotPassword;
