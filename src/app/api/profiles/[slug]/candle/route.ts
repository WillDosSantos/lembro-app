import { readFile, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const profilesPath = path.join(process.cwd(), "data", "profiles.json");

export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  const data = await readFile(profilesPath, "utf8").catch(() => "[]");
  const profiles = JSON.parse(data);

  const profile = profiles.find((p: any) => p.slug === slug);
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  profile.candles = (profile.candles || 0) + 1;

  await writeFile(profilesPath, JSON.stringify(profiles, null, 2));
  return NextResponse.json({ success: true, candles: profile.candles });
}
