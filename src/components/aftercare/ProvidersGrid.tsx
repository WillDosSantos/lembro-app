"use client";
import { useEffect, useState } from "react";
import ProviderCard from "./ProviderCard";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function ProvidersGrid({
  loc,
  category,
  profileSlug,
  useGeo,
  searchStamp,
}: {
  loc: string;
  category: string | null;
  profileSlug: string;
  useGeo: boolean;
  searchStamp: number; // bumps when user clicks Search / Use my location
}) {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Try geolocation once
  useEffect(() => {
    let cancelled = false;
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!cancelled) setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {}
    );
    return () => { cancelled = true; };
  }, []);

   // Fetch whenever searchStamp, category, or the relevant location source changes
   useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setErr(null);

    const load = async () => {
      try {
        const qs = new URLSearchParams();
        if (useGeo && coords) {
          qs.set("lat", String(coords.lat));
          qs.set("lng", String(coords.lng));
        } else if (loc) {
          qs.set("loc", loc);
        }
        if (category) qs.set("category", category);

        // unified endpoint (handles lat/lng or loc)
        const r = await fetch(`/api/providers/search?${qs.toString()}`, { cache: "no-store" });
        if (!r.ok) throw new Error("Failed to load providers");
        const json = await r.json();
        if (!cancelled) setData(json);
      } catch (e: any) {
        if (!cancelled) setErr(e.message || "Failed to load providers");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
  }, [searchStamp, category, useGeo, coords?.lat, coords?.lng, loc]);

  if (loading) return <div className="mt-6">Loading providers…</div>;
  if (err) return <div className="mt-6 text-error">{err}</div>;
  if (!data?.length) return <div className="mt-6">No providers match your filters.</div>;


  return (
    <>
      <div className="text-xs opacity-60 mb-2">
        {useGeo && coords ? "Results near your location." : `Results near "${loc}".`} Powered by Google.
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
        {data.map((p: any) => (
          <ProviderCard key={p.id} provider={p} profileSlug={profileSlug} />
        ))}
      </div>
    </>
  );
}
