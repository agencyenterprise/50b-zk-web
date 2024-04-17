"use client";

import { ethers } from "ethers";
import { defineChain } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import { createWallet, Wallet } from "thirdweb/wallets";

import { useChain } from "@/contexts/Chain";

export default function MetaMaskConnect() {
  const { client, setWallet, escrowBalance } = useChain();

  const wallets = [
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    createWallet("me.rainbow"),
  ];

  const handleConnect = async (wallet: Wallet) => {
    setWallet(wallet);
    const account = wallet?.getAccount();

    try {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: account?.address,
          password: account?.address,
        }),
      };

      const logged = await fetch(
        `${process.env.NEXT_PUBLIC_HUB_URL}/auth/login`,
        options,
      );
      console.log("logged", logged);
    } catch (e) {
      console.log("error", e);

      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: account?.address,
          password: account?.address,
          paymentPublicKey: account?.address,
        }),
      };

      const registered = await fetch(
        `${process.env.NEXT_PUBLIC_HUB_URL}/auth/register`,
        options,
      );

      console.log("registered", registered);
    }
  };

  return (
    <div className="flex items-center justify-center text-white gap-2">
      {escrowBalance != undefined && <div>
        Credits: {ethers.utils.formatEther(escrowBalance)}
      </div>}

      {client && (
        <ConnectButton
          autoConnect={true}
          client={client}
          chain={defineChain(2710)}
          wallets={wallets}
          theme={"dark"}
          connectModal={{ size: "wide" }}
          onConnect={handleConnect}
        />
      )}

    </div>
  );
}
