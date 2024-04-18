"use client";

import { ethers } from "ethers";
import { defineChain } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";

import { useChain } from "@/contexts/Chain";

export default function MetaMaskConnect() {
  const { client, escrowBalance } = useChain();

  const wallets = [
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    createWallet("me.rainbow"),
  ];

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
        />
      )}

    </div>
  );
}
