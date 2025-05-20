'use client';

import { useState } from "react";

export default function CandleButton({ slug, initialCount }: { slug: string; initialCount: number }) {
  const [lit, setLit] = useState(false);
  const [count, setCount] = useState(initialCount);

  const handleClick = async () => {
    if (lit) return;
    setLit(true);

    const res = await fetch(`/api/profiles/${slug}/candle`, {
      method: "POST",
    });

    const data = await res.json();
    if (data.success) {
      setCount(data.candles);
    }
  };

  return (
    <div className="mt-6 text-center">
      <button
        onClick={handleClick}
        disabled={lit}
        className={`px-4 py-2 rounded text-white font-semibold ${
          lit ? "bg-yellow-600" : "bg-orange-500 hover:bg-orange-600"
        }`}
      >
        {lit ? "Your candle is lit 🕯️" : "Light a Candle"}
      </button>
      <p className="text-sm text-gray-500 mt-2">{count} candle{count !== 1 ? "s" : ""} lit</p>
    </div>
  );
}
