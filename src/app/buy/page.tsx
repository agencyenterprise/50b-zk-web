"use client";

import { CheckIcon } from "@heroicons/react/20/solid";
import Button from "@/components/Button";
import { useChain } from "@/contexts/Chain";
import {
  toWei,
  prepareContractCall,
  sendAndConfirmTransaction,
} from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { toast } from "react-toastify";
import { useState } from "react";

type Tier = {
  name: string;
  id: string;
  price?: string;
  description: string;
  features: string[];
};

const tiers: Tier[] = [
  {
    name: "Basic",
    id: "tier-basic",
    price: "5",
    description: "The essentials to validate some proofs",
    features: ["Cheapest plan", "Up to 1,000 inputs aprox"],
  },
  {
    name: "Advanced",
    id: "tier-advanced",
    price: "15",
    description: "A pack that can get you a long way.",
    features: [
      "Most popular",
      "Up to 3,000 inputs aprox",
      "Can handle complex proofs",
    ],
  },
  {
    name: "Professional",
    id: "tier-professional",
    price: "30",
    description: "A pack for heavy users.",
    features: [
      "Up to 6,000 inputs aprox",
      "Priority on worker queue",
      "Can handle super complex proofs",
    ],
  },
  {
    name: "Custom",
    id: "tier-custom",
    description: "Get what you want.",
    features: [
      "Any ammount of inputs and runs",
      "Exactly what you need",
      "Can handle super complex proofs",
    ],
  },
];

export default function BuyCreditsPage() {
  const [customPrice, setCustomPrice] = useState<string>("100");
  const { client, escrowContract, tokenContract, fetchEscrowBalance } =
    useChain();
  const activeAccount = useActiveAccount();

  const handleBuy = async (tier: Tier) => {
    if (!client || !escrowContract || !tokenContract || !activeAccount) {
      return;
    }

    try {
      toast.info("Approving token ammount...");
      const approveTx = prepareContractCall({
        contract: tokenContract,
        // Pass the method signature that you want to call
        method: "function approve(address spender, uint256 amount)",
        // and the params for that method
        // Their types are automatically inferred based on the method signature
        params: [escrowContract?.address, toWei(tier?.price || "5")],
      });

      await sendAndConfirmTransaction({
        transaction: approveTx,
        account: activeAccount,
      });

      toast.success("Token ammount approved!");
    } catch (e) {
      console.log("error", e);
      toast.error("Error on token ammount approval, " + e);
    }

    try {
      toast.info("Depositing credits...");
      const depositTx = prepareContractCall({
        contract: escrowContract,
        // Pass the method signature that you want to call
        method: "function deposit(uint256 amount)",
        // and the params for that method
        // Their types are automatically inferred based on the method signature
        params: [toWei(tier?.price || "5")],
      });

      await sendAndConfirmTransaction({
        transaction: depositTx,
        account: activeAccount,
      });

      toast.success("Credit deposit successfull!");
      fetchEscrowBalance();
    } catch (e) {
      console.log("error", e);
      toast.error("Error on credits deposit, " + e);
    }
  };

  return (
    <div className="bg-gray-900 py-12 sm:py-24 h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Packs for all needs
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-300">
          Choose an affordable pack that will give you credits to compute proofs
          and give you some kind of advantage.
        </p>

        <div className="mx-auto py-10 flex w-full flex-wrap gap-8 items-center justify-center">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`ring-1 ring-white/10 rounded-3xl p-8 xl:p-10 w-full md:w-1/2 lg:w-1/3 h-[400px]`}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3
                  id={tier.id}
                  className="text-lg font-semibold leading-8 text-white"
                >
                  {tier.name}
                </h3>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-300">
                {tier.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                {tier?.price ? (
                  <span className="text-4xl font-bold tracking-tight text-white">
                    $ {tier?.price}
                  </span>
                ) : (
                  <>
                    <span className="text-4xl font-bold tracking-tight text-white ml-2">
                      $
                    </span>
                    <input
                      type="number"
                      id="custom-price"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(e.target.value)}
                      className="w-full -ml-8 pl-8 pr-2 pb-1 pt-1.5 h-12 text-[34px] text-white bg-transparent text-xl text-bold border-white border-2 rounded-lg focus-visible:outline-none"
                    />
                  </>
                )}
              </p>

              <Button
                id={`button-${tier.id}`}
                type="button"
                label="Buy credits"
                className="w-full mt-4"
                onClick={() => {
                  handleBuy({ ...tier, price: tier?.price || customPrice });
                }}
              />
              <ul
                role="list"
                className="mt-8 space-y-3 text-sm leading-6 text-gray-300 xl:mt-10"
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon
                      className="h-6 w-5 flex-none text-white"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
