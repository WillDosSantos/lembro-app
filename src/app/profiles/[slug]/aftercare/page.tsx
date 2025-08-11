"use client";
import { useEffect, useMemo, useState, use } from "react";
import { useSearchParams } from "next/navigation";
import ProvidersGrid from "@/components/aftercare/ProvidersGrid";
import DIYPlanner from "@/components/aftercare/DIYPlanner";

type Params = { slug: string };

const CATEGORIES = [
  { key: "mortuary", label: "Mortuary" },
  { key: "floral", label: "Floral" },
  { key: "celebration_design", label: "Celebration Design" },
  { key: "venue", label: "Venue" },
  { key: "printing", label: "Printing" },
  { key: "officiant", label: "Officiant" },
  { key: "obituary_help", label: "Obituary Help" },
  { key: "grief_support", label: "Grief Support" },
  { key: "fundraising", label: "Fundraising" },
];

export default function AftercarePage({ params }: { params: Promise<Params> | Params }) {
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const { slug } = resolvedParams;
  
  const sp = useSearchParams();
  const [tab, setTab] = useState(sp.get("tab") === "browse" ? "browse" : "diy");
  const [loc, setLoc] = useState("Meridian, ID");
  const [category, setCategory] = useState<string | null>(null);

  const selectedLabel = useMemo(
    () => CATEGORIES.find(c => c.key === category)?.label ?? "All services",
    [category]
  );

  useEffect(() => {
    // Try prefill from browser
    // navigator.geolocation.getCurrentPosition(...) -> reverse geocode (optional)
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Support & Services</h1>
      <div className="mt-4 join">
        <button
          className={`join-item btn ${tab === "diy" ? "btn-primary" : ""}`}
          onClick={() => setTab("diy")}
        >
          DIY Planner
        </button>
        <button
          className={`join-item btn ${tab === "browse" ? "btn-primary" : ""}`}
          onClick={() => setTab("browse")}
        >
          Browse Providers
        </button>
      </div>

      {tab === "browse" ? (
        <>
          <div className="mt-6 flex flex-wrap gap-3 items-center">
            <input
              className="input input-bordered"
              placeholder="City, ZIP, or State"
              value={loc}
              onChange={e => setLoc(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(c => (
                <button
                  key={c.key}
                  className={`badge p-3 cursor-pointer ${category === c.key ? "badge-primary" : "badge-ghost"}`}
                  onClick={() => setCategory(category === c.key ? null : c.key)}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <div className="text-sm opacity-70">Showing: {selectedLabel}</div>
          </div>
          <ProvidersGrid loc={loc} category={category} profileSlug={slug} />
        </>
      ) : (
        <DIYPlanner slug={slug} />
      )}
    </div>
  );
}
