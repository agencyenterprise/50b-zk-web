import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";
import { createThirdwebClient, defineChain, getContract } from "thirdweb";
import { Wallet } from "thirdweb/wallets";

// Create the context
const ChainContext = createContext({
  client: {} as ReturnType<typeof createThirdwebClient>,
  escrowContract: {} as ReturnType<typeof getContract> | undefined,
  tokenContract: {} as ReturnType<typeof getContract> | undefined,
  setWallet: (wallet: Wallet) => {},
  wallet: {} as Wallet | undefined,
});

// Provider component
export function ChainProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(() =>
    createThirdwebClient({
      clientId: process.env.NEXT_PUBLIC_THIRDWEB_KEY || "",
    }),
  );

  const [wallet, setWallet] = useState<Wallet>();
  const [escrowContract, setEscrowContract] =
    useState<ReturnType<typeof getContract>>();
  const [tokenContract, setTokenContract] =
    useState<ReturnType<typeof getContract>>();

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

  // Memoize the context value to optimize performance
  const value = useMemo(
    () => ({ client, escrowContract, tokenContract, wallet, setWallet }),
    [client, escrowContract, tokenContract, wallet, setWallet],
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
