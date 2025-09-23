import { getContract } from 'wagmi/actions'
import { config } from './wagmi'

export const CANDLE_CONTRACT = {
  address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
  abi: [
    // event CandleLit(address indexed by, uint256 memorialId, uint256 year);
    {
      type: 'event',
      name: 'CandleLit',
      inputs: [
        { name: 'by', type: 'address', indexed: true },
        { name: 'memorialId', type: 'uint256', indexed: false },
        { name: 'year', type: 'uint256', indexed: false },
      ],
      anonymous: false,
    },
    // function lightCandle(uint256 memorialId, uint256 year) external;
    {
      type: 'function',
      name: 'lightCandle',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'memorialId', type: 'uint256' },
        { name: 'year', type: 'uint256' },
      ],
      outputs: [],
    },
  ] as const,
} as const

export function candleContract() {
  return getContract({
    address: CANDLE_CONTRACT.address,
    abi: CANDLE_CONTRACT.abi,
    client: { config },
  })
}
