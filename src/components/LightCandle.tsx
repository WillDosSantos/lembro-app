'use client'

import { useAccount } from 'wagmi'
import { useLightCandle } from '@/hooks/useLightCandle'

export default function LightCandle({ memorialId }: { memorialId: number }) {
  const { isConnected } = useAccount()
  const { light, status, error, isLoading, lastTxHash } = useLightCandle()

  return (
    <div className="space-y-3">
      <button
        onClick={() => light({ memorialId })}
        disabled={!isConnected || isLoading}
        className="px-4 py-2 rounded-xl bg-black text-white disabled:opacity-50"
      >
        {isLoading ? 'Lighting…' : 'Light Candle'}
      </button>

      {!isConnected && (
        <p className="text-sm text-amber-600">
          Connect your wallet to light a candle.
        </p>
      )}

      {status && <p className="text-sm text-green-700">{status}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {lastTxHash && (
        <a
          className="text-xs underline text-blue-700"
          href={`https://testnet.snowtrace.io/tx/${lastTxHash}`}
          target="_blank"
          rel="noreferrer"
        >
          View on Snowtrace
        </a>
      )}
    </div>
  )
}
