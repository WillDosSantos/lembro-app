import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "profiles.json");

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const data = await fs.readFile(filePath, "utf-8").catch(() => "[]");
  const profiles = JSON.parse(data);
  const profile = profiles.find((p: any) => p.slug === params.slug);

  if (!profile) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(profile);
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const data = await fs.readFile(filePath, "utf-8").catch(() => "[]");
  const profiles = JSON.parse(data);
  const index = profiles.findIndex((p: any) => p.slug === params.slug);

  if (index === -1) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const existing = profiles[index];
  if (existing.createdBy !== session.user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  profiles[index] = {
    ...existing,
    ...body,
    family: body.family || [],
    lifePhotos: body.lifePhotos || [],
  };

  await fs.writeFile(filePath, JSON.stringify(profiles, null, 2));
  return NextResponse.json(profiles[index]);
}
