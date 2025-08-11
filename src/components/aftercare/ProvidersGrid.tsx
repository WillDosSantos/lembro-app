"use client";
import useSWR from "swr";
import ProviderCard from "./ProviderCard";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function ProvidersGrid({
  loc,
  category,
  profileSlug,
}: {
  loc: string;
  category: string | null;
  profileSlug: string;
}) {
  const qs = new URLSearchParams();
  if (loc) qs.set("loc", loc);
  if (category) qs.set("category", category);

  const { data, error, isLoading } = useSWR(`/api/providers?${qs.toString()}`, fetcher);

  if (isLoading) return <div className="mt-6">Loading providers…</div>;
  if (error) return <div className="mt-6 text-error">Failed to load providers.</div>;
  if (!data?.length) return <div className="mt-6">No providers match your filters.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {data.map((p: any) => (
        <ProviderCard key={p.id} provider={p} profileSlug={profileSlug} />
      ))}
    </div>
  );
}
