import { Link } from "react-router-dom";

const VerificationFailed = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-2xl rounded-lg p-8 max-w-md text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Verification Failed</h2>
        <p className="text-gray-600 mb-4">
          The verification link is invalid or has expired. Please try signing up again.
        </p>
        
        <Link to="/signup">
          <button className="w-full bg-blue-500 text-white p-3 rounded-md text-lg transition-all duration-500 transform hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-700 hover:scale-105 shadow-lg hover:shadow-xl">
            Go to Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
};

export default VerificationFailed;
