"use client";

import { useEffect, useMemo, useState } from "react";
import { useAccount, useReadContract, useWatchContractEvent } from "wagmi";
import { BADGES_ABI, BADGES_ADDR } from "@/lib/contracts";

type Props = { memorialId: number };

export default function LightCandle({ memorialId }: Props) {
  const { address } = useAccount();
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const year = useMemo(() => new Date().getFullYear(), []);

  // 1. Read current candle count
  const { data: uniqueCount, refetch: refetchCount } = useReadContract({
    address: BADGES_ADDR,
    abi: BADGES_ABI,
    functionName: "candlesForMemorial",
    args: [BigInt(memorialId)],
  });

  // 2. Watch CandleLit event
  useWatchContractEvent({
    address: BADGES_ADDR,
    abi: BADGES_ABI,
    eventName: "CandleLit",
    args: {
      memorialId: BigInt(memorialId),
      year: BigInt(year),
    },
    onLogs(logs) {
      refetchCount();
      if (
        logs.some(
          (l) =>
            (l.args?.account as `0x${string}` | undefined)?.toLowerCase() ===
            address?.toLowerCase()
        )
      ) {
        setStatus("Candle lit ✨—Badge minted to your wallet.");
      }
    },
  });

  // 3. Call backend API
  async function light() {
    setLoading(true);
    setError(null);
    setStatus(null);
    try {
      const res = await fetch("/api/blockchain/light-candle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memorialId, year, walletAddress: address ?? null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setStatus(
        data.onChain
          ? "Submitting mint… waiting for confirmation."
          : "Candle lit ✨—Thank you for remembering."
      );
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <button
          onClick={light}
          disabled={loading}
          className="border rounded px-4 py-2 disabled:opacity-60"
        >
          {loading ? "Lighting…" : "🕯️ Light a Candle"}
        </button>
        <span className="text-sm text-gray-600">
          {typeof uniqueCount === "bigint"
            ? `${uniqueCount} candles this year`
            : "—"}
        </span>
      </div>
      {status && <p className="text-sm text-green-700">{status}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
