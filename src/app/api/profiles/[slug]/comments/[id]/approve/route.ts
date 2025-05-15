import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

const FILE_PATH = path.join(process.cwd(), "data", "profiles.json");

export async function POST(_: Request, { params }: { params: { slug: string; id: string } }) {
  const data = await fs.readFile(FILE_PATH, "utf-8");
  const profiles = JSON.parse(data);
  const profile = profiles.find((p: any) => p.slug === params.slug);

  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const comment = profile.comments?.find((c: any) => c.id === params.id);
  if (comment) comment.approved = true;

  await fs.writeFile(FILE_PATH, JSON.stringify(profiles, null, 2));
  return NextResponse.json({ success: true });
}
