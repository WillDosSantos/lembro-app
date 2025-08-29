"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { avalancheFuji } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected } from "wagmi/connectors";

const config = createConfig({
  chains: [avalancheFuji],
  connectors: [injected()], // MetaMask etc.
  transports: {
    [avalancheFuji.id]: http(process.env.NEXT_PUBLIC_RPC_URL),
  },
});

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}