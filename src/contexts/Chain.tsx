import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";
import { createThirdwebClient, defineChain, getContract, readContract } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { BigNumber } from "ethers";

// Create the context
const ChainContext = createContext({
  client: {} as ReturnType<typeof createThirdwebClient>,
  escrowContract: {} as ReturnType<typeof getContract> | undefined,
  tokenContract: {} as ReturnType<typeof getContract> | undefined,
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

  const [escrowContract, setEscrowContract] = useState<ReturnType<typeof getContract>>();
  const [tokenContract, setTokenContract] = useState<ReturnType<typeof getContract>>();
  const [escrowBalance, setEscrowBalance] = useState<BigNumber>();

  const activeAccount = useActiveAccount();

  const register = async (address: string) => {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: address,
        password: address,
        paymentPublicKey: address,
      }),
    };

    await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/auth/register`, options);
  };

  const login = async (address: string) => {
    const options = {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: address,
        password: address,
      }),
    } as RequestInit;

    const response = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/auth/login`, options);
    
    if (response.status === 200) {
      const data = await response.json();

      localStorage.setItem("clientId", data._id);

      if (data.authentication.apiKey) {
        localStorage.setItem("apiKey", data.authentication.apiKey);
      } else {
        const apiKey = await generateApiKey(data.authentication.sessionToken);
        localStorage.setItem("apiKey", apiKey); 
      }

      return true;
    }

    return false;
  };

  const generateApiKey = async (sessionToken: string) => {
    const options = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    } as RequestInit;

    const response = await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/auth/generateApiKey`, options);
    
    if (response.status === 200) {
      const data = await response.json();

      return data.apiKey;
    }
  }

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
    if (activeAccount) {
      const loginProcess = async () => {
        try {
          const loggedIn = await login(activeAccount.address);

          if (!loggedIn) {
            await register(activeAccount.address);
            await login(activeAccount.address);
          }
        } catch (e) {
          console.error(e);
        }
      }

      loginProcess();
    }
  }, [activeAccount]);

  useEffect(() => {
    fetchEscrowBalance();
  }, [activeAccount, escrowContract]);

  // Memoize the context value to optimize performance
  const value = useMemo(
    () => ({ client, escrowContract, tokenContract, escrowBalance, fetchEscrowBalance}),
    [client, escrowContract, tokenContract, escrowBalance, fetchEscrowBalance],
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
