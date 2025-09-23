'use client'

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { SessionProvider } from 'next-auth/react'
import { config } from '@/lib/wagmi'
import '@rainbow-me/rainbowkit/styles.css'

const qc = new QueryClient()

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={qc}>
        <SessionProvider>
          <RainbowKitProvider>
            {children}
          </RainbowKitProvider>
        </SessionProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
