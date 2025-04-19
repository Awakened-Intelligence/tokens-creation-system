import React from 'react';
import SignUp from '../components/Auth/Signup';
import coinImage from '../assets/coin.png';

const SignUpPage = () => {
  return (
    // <div className="bg-cover bg-center" style={{ backgroundImage: `url(${coinImage})` }}>
    <div className="min-h-screen flex items-center justify-center">
      <SignUp />
    {/* </div> */}
    </div>
  );
};

export default SignUpPage;
