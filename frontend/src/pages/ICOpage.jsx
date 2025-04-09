import React from "react";
import Navbar from "../components/navbar";

const ICOPage = () => {
  return (
    <div >
        <Navbar />
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
    
      <h1 className="text-3xl font-bold mb-4">Participate in Our Token Sale</h1>
      <p className="text-lg mb-6">Buy tokens directly from our ICO/IDO launch.</p>
      
      {/* Embedded iFrame */}
      <div className="w-full max-w-5xl h-[600px] border border-gray-700 rounded-lg overflow-hidden">
        <iframe
          src="https://www.pinksale.finance/launchpad/create/presale"  // Replace with your actual sale link
          title="ICO/IDO Sale"
          width="100%"
          height="100%"
          style={{ border: "none" }}
        />
      </div>
      
      <p className="text-sm text-gray-400 mt-4">
        Powered by <a href="https://www.pinksale.finance/" className="text-blue-400" target="_blank" rel="noopener noreferrer">Pinksale</a>.
      </p>
    </div>
    </div>
  );
};

export default ICOPage;
