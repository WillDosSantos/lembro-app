"use client";
import { useEffect, useState } from "react";
import type { ServiceCategory } from "@/types/aftercare";

export default function SearchProviders({ lat, lng }: { lat: number; lng: number }) {
  const [category, setCategory] = useState<ServiceCategory>("mortuary"); // ✅ default to Mortuary
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!lat || !lng) return;
    setLoading(true);
    fetch(`/api/providers?lat=${lat}&lng=${lng}&category=${category}`)
      .then((r) => r.json())
      .then((d) => setResults(d.results ?? []))
      .finally(() => setLoading(false));
  }, [lat, lng, category]);

  return (
    <div className="space-y-4">
      <select
        className="border p-2 rounded"
        value={category}
        onChange={(e) => setCategory(e.target.value as ServiceCategory)}
      >
        <option value="mortuary">Mortuary</option>
        <option value="floral">Floral</option>
        <option value="celebration_design">Celebration Design</option>
        <option value="venue">Venue</option>
        <option value="printing">Printing</option>
        <option value="officiant">Officiant</option>
        <option value="obituary_help">Obituary Help</option>
      </select>

      {loading ? (
        <div>Loading…</div>
      ) : (
        <ul className="divide-y">
          {results.map((r) => (
            <li key={r.place_id} className="py-3">
              <div className="font-medium">{r.name}</div>
              <div className="text-sm text-gray-600">{r.vicinity || r.formatted_address}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
