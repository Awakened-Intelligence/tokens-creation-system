import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FiHome } from "react-icons/fi"; 
import {Link, useNavigate } from 'react-router-dom';
import config from "../../config";
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const SignUp = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.API_BASE_URL}/auth/signup`, formData);
      toast.success(response.data.message || " Sign-up successful!");
      setTimeout(() => navigate('/signin'), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || ' Sign-up failed.');
    }
  };
  

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
    <div className="mt-30 max-w-3xl mx-auto py-10 px-14 bg-black shadow-2xl rounded-3xl relative">

        {/* Home Icon to Redirect */}
        <Link to="/" className="absolute top-5 left-5 text-white text-2xl hover:text-gray-400 transition-all">
        <FiHome size={35} />
      </Link>

      <h2 className="text-2xl font-bold text-center mb-4 text-white">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full p-3 mb-3 border rounded pr-10 shadow-lg transform transition-all duration-300 hover:scale-10 hover:shadow-2xl"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 mb-3 border rounded pr-10 shadow-lg transform transition-all duration-300 hover:scale-10 hover:shadow-2xl"
          onChange={handleChange}
          required
        />
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'} //  Toggle type
            name="password"
            placeholder="Password"
            className="w-full p-3 mb-3 border rounded pr-10 shadow-lg transform transition-all duration-300 hover:scale-10 hover:shadow-2xl"
            onChange={handleChange}
            required
          />
          <span
            className="absolute right-3 top-3 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)} // Toggle visibility
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />} {/*  Icon changes */}
          </span>
        </div>
            <p className="text-center mt-3 text-gray-600">
                     Don't have an account?{" "}
                     <Link to="/signin" className="text-white hover:underline">
                       Sign in
                     </Link>
                   </p>

        <button type="submit" className="btn" style={{backgroundColor:"#4169e1"}}>
          Sign Up
        </button>
      </form>
      {message && <p className="text-center mt-3 text-red-500">{message}</p>}
    </div>
    </>
  );
};

export default SignUp;
