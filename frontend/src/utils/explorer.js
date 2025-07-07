// src/utils/explorer.js

const EXPLORERS = {
  Ethereum: {
    base:   "https://etherscan.io",
    path:   "address",
  },
  Polygon: {
    base:   "https://polygonscan.com",
    path:   "token",
  },
  // → Add more networks here as needed
};

/**
 * Returns the URL to view a contract or token on the right explorer.
 * @param {"address"|"token"} type  –  which page type (contracts use "address", tokens use "token")
 * @param {string} address
 * @param {string} network
 */
export function getExplorerUrl(type, address, network) {
  const cfg = EXPLORERS[network] || EXPLORERS.Ethereum;
  // if you want to guard against bad `type`, you could do:
  // const page = cfg[type] ? type : cfg.path
  return `${cfg.base}/${type}/${address}#code`;
}
