import { createContext, useContext, useState } from "react";

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [tokenData, setTokenData] = useState({
    tokenName: "",
    tokenSymbol: "",
    totalSupply: "",
    decimals: 0,
    network: "Ethereum",
    burnRate: 0,
    staking: false,
    mintable: false,
    solidityCode: "",
    transactionHash: "",
  });

  return (
    <TokenContext.Provider value={{ tokenData, setTokenData }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => useContext(TokenContext);
