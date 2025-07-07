import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";

const WalletContext = createContext({
  address: "",
  network: "",
  connect: async () => {},
  disconnect: () => {}
});

export const useWallet = () => useContext(WalletContext);

export function WalletProvider({ children }) {
  const [address, setAddress]   = useState("");
  const [network, setNetwork]   = useState("");
  const [provider, setProvider] = useState(null);

  // on mount, hook up ethers provider + listeners
  useEffect(() => {
    if (!window.ethereum) return;

    const ethProvider = new ethers.BrowserProvider(window.ethereum);
    setProvider(ethProvider);

    // initial state
    ethProvider.send("eth_accounts", []).then(accounts => {
      if (accounts.length) setAddress(accounts[0]);
    });
    ethProvider.getNetwork().then(net => setNetwork(net.name));

    // listen for changes
    window.ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length) {
        setAddress(accounts[0]);
      } else {
        // disconnected
        setAddress("");
        setNetwork("");
      }
    });

    window.ethereum.on("chainChanged", async () => {
      const net = await ethProvider.getNetwork();
      setNetwork(net.name);
    });

    return () => {
      window.ethereum.removeAllListeners("accountsChanged");
      window.ethereum.removeAllListeners("chainChanged");
    };
  }, []);

  const connect = async () => {
    if (!provider) throw new Error("No Ethereum provider");
    const accounts = await provider.send("eth_requestAccounts", []);
    if (accounts.length) setAddress(accounts[0]);
    const net = await provider.getNetwork();
    setNetwork(net.name);
  };

  const disconnect = () => {
    setAddress("");
    setNetwork("");
  };

  return (
    <WalletContext.Provider
      value={{ address, network, connect, disconnect }}
    >
      {children}
    </WalletContext.Provider>
  );
}
