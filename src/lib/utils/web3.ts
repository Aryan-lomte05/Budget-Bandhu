import { ethers } from 'ethers';

/**
 * Prompts MetaMask to connect and returns the wallet address.
 */
export const connectWallet = async (): Promise<string | null> => {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      return accounts[0];
    } catch (error) {
      console.error("User denied account access", error);
      return null;
    }
  } else {
    console.warn("MetaMask not detected");
    return null;
  }
};

/**
 * Returns the ETH balance for a given address using ethers.
 */
export const getETHBalance = async (address: string): Promise<string> => {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const balance = await provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error("Error fetching ETH balance", error);
      return "0";
    }
  }
  return "0";
};

/**
 * Formats a crypto balance to 4 decimal places.
 */
export const formatCryptoBalance = (balance: string | number): string => {
  const num = typeof balance === 'string' ? parseFloat(balance) : balance;
  return num.toFixed(4);
};
