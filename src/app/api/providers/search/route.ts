import { NextRequest, NextResponse } from "next/server";
// If you don't have the @ alias, change to a relative path: ../../../data/providers
import { PROVIDERS } from "../../../../../data/providers";
import type { Provider, ServiceCategory } from "../../../../../types/aftercare";

type PlacesResult = {
  place_id: string;
  name: string;
  vicinity?: string;
  formatted_address?: string;
  geometry?: { location: { lat: number; lng: number } };
};

const CAT_TO_GOOGLE: Partial<
  Record<ServiceCategory, { type?: string; keyword?: string }>
> = {
  mortuary: { type: "funeral_home" },
  floral: { type: "florist" },
  celebration_design: {
    keyword: "celebration of life design memorial program designer",
  },
  venue: { keyword: "event venue memorial service" },
  printing: { keyword: "memorial program printing" },
  officiant: { keyword: "funeral officiant" },
  obituary_help: { keyword: "obituary writing service" },
  grief_support: { keyword: "grief counseling" },
  fundraising: { keyword: "funeral fundraising help" },
};

function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s1 = Math.sin(dLat / 2);
  const s2 = Math.sin(dLng / 2);
  const c =
    2 *
    Math.asin(
      Math.sqrt(
        s1 * s1 +
          Math.cos((a.lat * Math.PI) / 180) *
            Math.cos((b.lat * Math.PI) / 180) *
            s2 *
            s2
      )
    );
  return R * c;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  let lat = Number(searchParams.get("lat"));
  let lng = Number(searchParams.get("lng"));
  const loc = searchParams.get("loc") || "";
  const category = (searchParams.get("category") || "") as ServiceCategory;
  const radius = Number(searchParams.get("radius") || 25000); // meters

  if (!process.env.GOOGLE_PLACES_KEY)
    return NextResponse.json({ error: "PLACES key missing" }, { status: 500 });

  // helper: try geocoding, then text search
  async function resolveLatLngFromLoc(q: string) {
    // 1) Geocoding API
    try {
      const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        q
      )}&key=${process.env.GOOGLE_PLACES_KEY}`;
      const geo = await fetch(geoUrl, { cache: "no-store" }).then((r) =>
        r.json()
      );
      const first = geo?.results?.[0]?.geometry?.location;
      if (first?.lat && first?.lng) return first;
      console.warn("Geocode no result:", geo?.status, geo?.error_message);
    } catch (e) {
      console.warn("Geocode fetch failed:", (e as Error).message);
    }

    // 2) Places Text Search (often resolves city center)
    try {
      const txtUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        q
      )}&key=${process.env.GOOGLE_PLACES_KEY}`;
      const txt = await fetch(txtUrl, { cache: "no-store" }).then((r) =>
        r.json()
      );
      const first = txt?.results?.[0]?.geometry?.location;
      if (first?.lat && first?.lng) return first;
      console.warn("TextSearch no result:", txt?.status, txt?.error_message);
    } catch (e) {
      console.warn("TextSearch fetch failed:", (e as Error).message);
    }

    return null;
  }

  // If no lat/lng provided but location is, resolve to lat/lng
  if ((!lat || !lng) && loc) {
    const center = await resolveLatLngFromLoc(loc);
    if (center) {
      lat = center.lat;
      lng = center.lng;
    }
  }

  if (!lat || !lng) {
    return NextResponse.json(
      {
        error:
          "lat,lng or loc required (enable Geocoding API / check key restrictions)",
      },
      { status: 400 }
    );
  }

  // 1) Local sponsored list (filter category if provided)
  let local = PROVIDERS.filter((p: Provider) => p.isActive);
  if (category)
    local = local.filter((p: Provider) => p.categories.includes(category));

  // 2) Google Places nearby
  const map = CAT_TO_GOOGLE[category] || {};
  const params = new URLSearchParams({
    key: process.env.GOOGLE_PLACES_KEY!,
    location: `${lat},${lng}`,
    radius: String(radius),
  });
  if (map.type) params.set("type", map.type);
  if (map.keyword) params.set("keyword", map.keyword);

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params.toString()}`;
  const g = await fetch(url, { cache: "no-store" })
    .then((r) => r.json())
    .catch(() => ({ results: [] }));

  const here = { lat, lng };

  // 3) Normalize to our Provider-ish shape with distance & basic address
  type Out = Provider & {
    distanceKm?: number;
    address?: string;
    external?: true;
  };
  const external: Out[] = ((g.results as PlacesResult[]) || []).map((r) => {
    const coords = r.geometry?.location;
    const distanceKm = coords ? haversineKm(here, coords) : undefined;
    return {
      id: `g_${r.place_id}`,
      name: r.name,
      logoUrl: undefined,
      website: undefined, // To get website/phone, use Places Details per place_id (future pass)
      phone: undefined,
      email: undefined,
      categories: category ? [category] : [],
      serviceAreas: ["nearby"],
      tier: "free",
      isActive: true,
      blurb: r.vicinity || r.formatted_address || "",
      distanceKm,
      address: r.vicinity || r.formatted_address,
      external: true,
    };
  });

  // 4) Merge (sponsored first), dedupe by normalized name
  const norm = (s: string) => s.trim().toLowerCase();
  const seen = new Set<string>();
  const merged: Out[] = [];

  const pushUnique = (p: Out) => {
    const key = norm(p.name);
    if (seen.has(key)) return;
    seen.add(key);
    merged.push(p);
  };

  local.forEach((p: Provider) => pushUnique(p as Out));
  external.forEach((p: Out) => pushUnique(p));

  // 5) Sort: premium → featured → free → then by distance for externals
  const tierRank: Record<Provider["tier"], number> = {
    premium: 0,
    featured: 1,
    free: 2,
  };
  merged.sort((a, b) => {
    const t = tierRank[a.tier] - tierRank[b.tier];
    if (t !== 0) return t;
    // push externals after sponsored "free" locals if both free; sort externals by distance
    const aD = a.external ? a.distanceKm ?? Infinity : Infinity;
    const bD = b.external ? b.distanceKm ?? Infinity : Infinity;
    return aD - bD;
  });

  // 6) Return
  return NextResponse.json(merged);
}
