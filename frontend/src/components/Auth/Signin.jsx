


import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FiHome } from "react-icons/fi";  
import { ToastContainer } from 'react-toastify'; 

import { Link, useNavigate } from 'react-router-dom'; 
import config from "../../config";
import axios from 'axios';
import { toast } from 'react-toastify'; // Import React Toastify

const SignIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const clearWallet = () => {
    localStorage.removeItem("walletAddress");
    window.dispatchEvent(new Event("walletDisconnectedEvent")); // 🟢 Trigger wallet disconnection event
    console.log("Wallet address cleared on sign-in.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.API_BASE_URL}/auth/signin`, formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem("user_id", response.data.user_id);
      clearWallet();
      toast.success('Login successful!');  // Show success toast
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Sign-in failed.');  // Show error toast
    }
  };

  return (
    <>
    <ToastContainer />
    <div className="mt-30 max-w-3xl mx-auto py-10 px-14 bg-black shadow-2xl rounded-3xl relative">
      
      {/* Home Icon to Redirect */}
      <Link to="/" className="absolute top-5 left-5 text-white text-2xl hover:text-blue-400 transition-all">
        <FiHome size={28} />
      </Link>
  
      <h2 className="text-2xl font-bold text-center mb-4 text-white">Sign In</h2>
      
      <form onSubmit={handleSubmit}>
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
            type={showPassword ? 'text' : 'password'} // Toggle type
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
            {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Icon changes */}
          </span>
        </div>
  
        {/* Forgot Password Link */}
        <div className="text-right mb-3">
          <Link to="/forgot-password" className="text-white hover:underline text-sm">
            Forgot Password?
          </Link>
        </div>
  
        {/* Sign-Up Link */}
        <p className="text-center mt-3 text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-white hover:underline">
            Sign Up
          </Link>
        </p>
  
        <button 
  type="submit" 
  className="btn"  
  style={{
    backgroundColor: "#4169e1", 
    display: "flex",           // Use flexbox for centering
    alignItems: "center",      // Vertically center the content
    justifyContent: "center",  // Horizontally center the content
    padding: "1rem 2rem"       // Optional: Add some padding to make the button look better
  }}
>
  Sign In
</button>

      </form>
  
      {message && <p className="text-center mt-3 text-red-500">{message}</p>}
    </div>
    </>
  );
};

export default SignIn;



// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { FiHome } from "react-icons/fi";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// const SignInPage = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [message, setMessage] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // handle submit logic
//   };

//   const handleChange = (e) => {
//     // handle form input change
//   };

//   return (
//     <div className="mt-30 max-w-3xl mx-auto py-10 px-14 bg-black shadow-2xl rounded-lg relative">
      
//       {/* Home Icon to Redirect */}
//       <Link to="/" className="absolute top-5 left-5 text-white text-2xl hover:text-gray-400 transition-all">
//         <FiHome size={28} />
//       </Link>

//       <h2 className="text-2xl font-bold text-center mb-4 text-white">Sign In</h2>
      
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           className="w-full p-3 mb-3 border rounded pr-10 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gray-800 text-white border-gray-600 focus:border-blue-500"
//           onChange={handleChange}
//           required
//         />
        
//         <div className="relative">
//           <input
//             type={showPassword ? 'text' : 'password'} // Toggle type
//             name="password"
//             placeholder="Password"
//             className="w-full p-3 mb-3 border rounded pr-10 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gray-800 text-white border-gray-600 focus:border-blue-500"
//             onChange={handleChange}
//             required
//           />
//           <span
//             className="absolute right-3 top-3 cursor-pointer text-white"
//             onClick={() => setShowPassword(!showPassword)} // Toggle visibility
//           >
//             {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Icon changes */}
//           </span>
//         </div>

//         {/* Forgot Password Link */}
//         <div className="text-right mb-3">
//           <Link to="/forgot-password" className="text-white hover:underline text-sm">
//             Forgot Password?
//           </Link>
//         </div>

//         {/* Sign-Up Link */}
//         <p className="text-center mt-3 text-gray-600">
//           Don't have an account?{" "}
//           <Link to="/signup" className="text-white hover:underline">
//             Sign Up
//           </Link>
//         </p>

//         <button 
//           type="submit" 
//           className="w-full bg-gradient-to-r from-blue-500 to-green-700 text-white p-3 rounded-md text-lg transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-xl"
//         >
//           Sign In
//         </button>
//       </form>

//       {message && <p className="text-center mt-3 text-red-500">{message}</p>}
//     </div>
//   );
// };

// export default SignInPage;




