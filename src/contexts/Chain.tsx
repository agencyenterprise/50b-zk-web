import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";
import { createThirdwebClient, defineChain, getContract, readContract } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { Wallet } from "thirdweb/wallets";
import { BigNumber } from "ethers";

// Create the context

const ChainContext = createContext({
  client: {} as ReturnType<typeof createThirdwebClient>,
  escrowContract: {} as ReturnType<typeof getContract> | undefined,
  tokenContract: {} as ReturnType<typeof getContract> | undefined,
  setWallet: (wallet: Wallet) => {},
  wallet: {} as Wallet | undefined,
  escrowBalance: {} as BigNumber | undefined,
  fetchEscrowBalance: () => {},
});

// Provider component
export function ChainProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(() =>
    createThirdwebClient({
      clientId: process.env.NEXT_PUBLIC_THIRDWEB_KEY || "",
    }),
  );

  const [wallet, setWallet] = useState<Wallet>();
  const [escrowContract, setEscrowContract] = useState<ReturnType<typeof getContract>>();
  const [tokenContract, setTokenContract] = useState<ReturnType<typeof getContract>>();
  const [escrowBalance, setEscrowBalance] = useState<BigNumber>();

  const activeAccount = useActiveAccount();

  const fetchEscrowBalance = () => {
    if (activeAccount && escrowContract) {
      const fetchBalance = async () => {
        const balance = await readContract({
          contract: escrowContract,
          method: "function balanceOf(address) view returns (uint256)",
          params: [activeAccount.address],
        });

        setEscrowBalance(BigNumber.from(balance));
      };

      fetchBalance();
    }
  }

  useEffect(() => {
    if (client) {
      const newEscrowContract = getContract({
        client,
        chain: defineChain(2710),
        address: process.env.NEXT_PUBLIC_ESCROW_ADDRESS || "",
      });
      setEscrowContract(newEscrowContract);

      const newTokenContract = getContract({
        client,
        chain: defineChain(2710),
        address: process.env.NEXT_PUBLIC_TOKEN_ADDRESS || "",
      });
      setTokenContract(newTokenContract);
    }
  }, [client]);

  useEffect(() => {
    fetchEscrowBalance();
  }, [activeAccount, escrowContract]);

  // Memoize the context value to optimize performance
  const value = useMemo(
    () => ({ client, escrowContract, tokenContract, wallet, setWallet, escrowBalance, fetchEscrowBalance}),
    [client, escrowContract, tokenContract, wallet, setWallet, escrowBalance, fetchEscrowBalance],
  );

  return (
    <ChainContext.Provider value={value}>{children}</ChainContext.Provider>
  );
}

// Custom hook for accessing the context
export function useChain() {
  const context = useContext(ChainContext);
  if (!context) {
    throw new Error("useChain must be used within a ChainProvider");
  }
  return context;
}
