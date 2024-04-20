"use client";

import Button from "@/components/Button";
import { useActiveAccount } from "thirdweb/react";
import { toast } from "react-toastify";

export default function FaucetPage() {
  const activeAccount = useActiveAccount();

  const handleGetTokens = async () => {
    if (!activeAccount) {
      toast.error("Please connect your wallet.");
      return;
    }

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ walletAddress: activeAccount.address })
    } as RequestInit;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_HUB_URL}/faucet`,
      options
    );

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 400) {
        return {
          success: false,
          error: data.error,
        };
      }

      toast.error("Failed to get tokens. Please try again later.");
    }

    toast.success(`Tokens send txHash: ${data.txHash}`);
  };

  return (
    <div className="bg-gray-900 py-12 sm:py-24 h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Faucet
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-300">
          Get tokens so you can buy credits and test the application.
        </p>
        <div className="w-full flex justify-center items-center">
          <Button
            id="btn"
            type="button"
            label="Get Tokens"
            className="w-32 mt-4"
            onClick={handleGetTokens}
          />
        </div>
      </div>
    </div>
  );
}
