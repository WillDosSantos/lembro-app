import { NextRequest, NextResponse } from "next/server";
import { PROVIDERS } from "../../../../data/providers";
import type { Provider, ServiceCategory } from "../../../../types/aftercare";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const qCat = searchParams.get("category");
  const qLoc = (searchParams.get("loc") || "").toLowerCase();

  let list = PROVIDERS.filter((p: Provider) => p.isActive);

  if (qCat) list = list.filter((p: Provider) => p.categories.includes(qCat as ServiceCategory));
  if (qLoc) {
    list = list.filter((p: Provider) =>
      p.serviceAreas.some((a: string) => a.toLowerCase().includes(qLoc) || a === "nationwide")
    );
  }

  // Sponsored ordering: premium > featured > free
  const tierOrder: Record<Provider["tier"], number> = { premium: 0, featured: 1, free: 2 };
  list.sort((a: Provider, b: Provider) => tierOrder[a.tier] - tierOrder[b.tier]);

  return NextResponse.json(list);
}
