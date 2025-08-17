import { NextRequest, NextResponse } from "next/server";
// TODO: wire to your profiles.json loader/saver
export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  const data = await req.json(); // { goFundMeUrl, notes, checklist }
  // 1) load profile by slug
  // 2) write profile.aftercarePlan = data
  // 3) persist
  return NextResponse.json({ ok: true });
}
