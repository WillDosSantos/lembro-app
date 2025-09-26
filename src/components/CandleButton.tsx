'use client';

import { useState } from "react";

export default function CandleButton({ slug, initialCount }: { slug: string; initialCount: number }) {
  const [lit, setLit] = useState(false);
  const [count, setCount] = useState(initialCount);

  const handleClick = async () => {
    if (lit) return;
    setLit(true);

    // Trigger the golden glow animation
    console.log('Dispatching candleLit event');
    const glowEvent = new CustomEvent('candleLit', { 
      detail: { slug } 
    });
    window.dispatchEvent(glowEvent);

    const res = await fetch(`/api/profiles/${slug}/candle`, {
      method: "POST",
    });

    const data = await res.json();
    if (data.success) {
      setCount(data.candles);
    }
  };

  return (
    <div className="text-center">
      <button
        onClick={handleClick}
        disabled={lit}
        className={`w-full lg:w-auto px-4 py-3 rounded-lg text-white font-medium ${
          lit ? "bg-gray-700" : "bg-gray-700 hover:bg-gray-800"
        }`}
      >
        {lit ? "Your candle is lit 🕯️" : "Light a Candle"}
      </button>
      <p className="text-sm text-gray-500 mt-2">{count} candle{count !== 1 ? "s" : ""} lit</p>
    </div>
  );
}
