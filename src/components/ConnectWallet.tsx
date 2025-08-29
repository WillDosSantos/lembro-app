"use client";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm">Connected: {address?.slice(0,6)}…{address?.slice(-4)}</span>
        <button className="border rounded px-3 py-1 text-sm" onClick={() => disconnect()}>Disconnect</button>
      </div>
    );
  }

  return (
    <button
      className="border rounded px-3 py-1 text-sm"
      onClick={() => connect({ connector: injected() })}
      disabled={isPending}
    >
      {isPending ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
