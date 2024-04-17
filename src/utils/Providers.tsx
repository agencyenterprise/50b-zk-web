"use client";

import { ChainProvider } from "@/contexts/Chain";
import { ThirdwebProvider } from "thirdweb/react";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThirdwebProvider>
      <ChainProvider>{children}</ChainProvider>
    </ThirdwebProvider>
  );
};

export default Providers;
