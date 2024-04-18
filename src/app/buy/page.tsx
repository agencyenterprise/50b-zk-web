"use client";

import { CheckIcon } from "@heroicons/react/20/solid";
import Button from "@/components/Button";
import { useChain } from "@/contexts/Chain";
import { toWei, prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";

type Tier = {
  name: string;
  id: string;
  price: number;
  description: string;
  features: string[];
};

const tiers: Tier[] = [
  {
    name: "Basic",
    id: "tier-basic",
    price: 5,
    description: "The essentials to validate some proofs",
    features: ["Cheapest plan", "Up to 1,000 inputs aprox"],
  },
  {
    name: "Advanced",
    id: "tier-advanced",
    price: 15,
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
    price: 30,
    description: "A pack for heavy users.",
    features: [
      "Up to 6,000 inputs aprox",
      "Priority on worker queue",
      "Can handle super complex proofs",
    ],
  },
];

export default function BuyCreditsPage() {
  const { client, escrowContract, tokenContract, fetchEscrowBalance } = useChain();
  const activeAccount = useActiveAccount();

  const handleBuy = async (tier: Tier) => {
    if (!client || !escrowContract || !tokenContract) {
      return;
    }

    try {
      if (!activeAccount) return;

      const approveTx = prepareContractCall({
        contract: tokenContract,
        // Pass the method signature that you want to call
        method: "function approve(address spender, uint256 amount)",
        // and the params for that method
        // Their types are automatically inferred based on the method signature
        params: [escrowContract?.address, toWei((tier?.price || 5).toString())],
      });

      await sendAndConfirmTransaction({
        transaction: approveTx,
        account: activeAccount,
      });

      const depositTx = prepareContractCall({
        contract: escrowContract,
        // Pass the method signature that you want to call
        method: "function deposit(uint256 amount)",
        // and the params for that method
        // Their types are automatically inferred based on the method signature
        params: [toWei((tier?.price || 5).toString())],
      });

      await sendAndConfirmTransaction({
        transaction: depositTx,
        account: activeAccount,
      });
      
      fetchEscrowBalance();
    } catch (e) {
      console.log("error", e);
    }
  };

  return (
    <div className="bg-gray-900 py-12 sm:py-24">
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

        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`ring-1 ring-white/10 rounded-3xl p-8 xl:p-10`}
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
                <span className="text-4xl font-bold tracking-tight text-white">
                  {tier?.price}$
                </span>
              </p>

              <Button
                id={`button-${tier.id}`}
                type="button"
                label="Buy plan"
                className="w-full mt-4"
                onClick={() => {
                  handleBuy(tier);
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
