'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import { waitForTransactionReceipt, watchContractEvent } from '@wagmi/core'
import { CANDLE_CONTRACT } from '@/lib/candleContract'
import { config } from '@/lib/wagmi'

type LightOpts = { memorialId: number; year?: number }

export function useLightCandle() {
  const { address, isConnected } = useAccount()
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setLoading] = useState(false)
  const [lastTxHash, setLastTxHash] = useState<`0x${string}` | null>(null)

  const { writeContractAsync } = useWriteContract()

  // Event subscription (fires whenever a CandleLit event appears)
  useEffect(() => {
    const unwatch = watchContractEvent(config, {
      ...CANDLE_CONTRACT,
      eventName: 'CandleLit',
      onLogs: (logs) => {
        // pick last log for UX
        const log = logs[logs.length - 1]
        const by = (log.args?.by ?? '') as string
        const memorialId = Number(log.args?.memorialId ?? 0)
        const year = Number(log.args?.year ?? 0)
        setStatus(`Candle lit by ${by.slice(0,6)}… for memorial ${memorialId} (${year})`)
      },
      onError: (e) => console.error('Event watch error:', e),
    })
    return () => unwatch?.()
  }, [])

  const light = useCallback(
    async ({ memorialId, year }: LightOpts) => {
      setLoading(true)
      setError(null)
      setStatus(null)
      try {
        if (!isConnected) throw new Error('Connect wallet first.')
        const y = year ?? new Date().getFullYear()

        const txHash = await writeContractAsync({
          ...CANDLE_CONTRACT,
          functionName: 'lightCandle',
          args: [BigInt(memorialId), BigInt(y)],
        })

        setLastTxHash(txHash)
        setStatus('Transaction sent. Waiting for confirmation…')

        const receipt = await waitForTransactionReceipt(config, { hash: txHash })
        if (receipt.status === 'success') {
          setStatus('Candle transaction confirmed ✅')
        } else {
          setError('Transaction failed.')
        }
      } catch (e: any) {
        console.error(e)
        setError(e?.shortMessage || e?.message || 'Something went wrong.')
      } finally {
        setLoading(false)
      }
    },
    [isConnected, writeContractAsync]
  )

  return useMemo(
    () => ({ light, status, error, isLoading, lastTxHash, address }),
    [light, status, error, isLoading, lastTxHash, address]
  )
}
