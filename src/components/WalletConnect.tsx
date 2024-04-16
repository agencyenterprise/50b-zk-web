"use client";

import { ConnectButton } from "thirdweb/react";
import { createWallet, Wallet } from "thirdweb/wallets";
import { createThirdwebClient } from "thirdweb";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_KEY || "",
});

const wallets = [createWallet("io.metamask")];

export default function MetaMaskConnect() {
  const handleConnect = async (wallet: Wallet) => {
    console.log(wallet);
    const account = await wallet?.getAccount();
    console.log(account);
    console.log(account?.address);

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
    <div>
      {
        <ConnectButton
          autoConnect={false}
          client={client}
          wallets={wallets}
          theme={"dark"}
          connectModal={{ size: "wide" }}
          onConnect={handleConnect}
        />
      }
    </div>
  );
}
