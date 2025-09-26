import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data", "profiles.json");

async function readProfiles() {
  const raw = await readFile(filePath, "utf8").catch(() => "[]");
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeProfiles(list: any[]) {
  await writeFile(filePath, JSON.stringify(list, null, 2), "utf8");
}

// GET /api/profiles/[slug]
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const profiles = await readProfiles();
  const profile = profiles.find((p: any) => p.slug === slug);
  if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(profile);
}

// PUT /api/profiles/[slug]
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await req.json();
  
  console.log("API received data:", body);
  console.log("Birth date received:", body.birth);
  console.log("Death date received:", body.death);

  const profiles = await readProfiles();
  const index = profiles.findIndex((p: any) => p.slug === slug);
  if (index === -1) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  console.log("Profile before update:", profiles[index]);
  profiles[index] = { ...profiles[index], ...body };
  console.log("Profile after update:", profiles[index]);
  
  await writeProfiles(profiles);
  console.log("Profiles file written successfully");
  return NextResponse.json({ ok: true });
}

// DELETE /api/profiles/[slug]
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const profiles = await readProfiles();
  const next = profiles.filter((p: any) => p.slug !== slug);
  if (next.length === profiles.length)
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  await writeProfiles(next);
  return NextResponse.json({ message: "Deleted" });
}
