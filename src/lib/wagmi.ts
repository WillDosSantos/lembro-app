// src/lib/wagmi.ts
import { http, createConfig } from 'wagmi'
import { avalancheFuji } from 'wagmi/chains'
import { cookieStorage, createStorage } from 'wagmi'

export const config = createConfig({
  chains: [avalancheFuji], // swap to avalanche for mainnet
  transports: {
    [avalancheFuji.id]: http(process.env.NEXT_PUBLIC_RPC_URL),
  },
  storage: createStorage({
    storage: cookieStorage,
  }),
})