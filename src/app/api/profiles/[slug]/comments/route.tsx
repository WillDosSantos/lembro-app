import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import { v4 as uuid } from 'uuid';

const FILE_PATH = path.join(process.cwd(), 'data', 'profiles.json');

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const { message, author } = await req.json();
  const raw = await fs.readFile(FILE_PATH, 'utf-8');
  const profiles = JSON.parse(raw);

  const profile = profiles.find((p: any) => p.slug === params.slug);
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  const comment = {
    id: uuid(),
    message,
    author,
    createdAt: new Date().toISOString(),
    approved: false,
  };

  profile.comments = profile.comments || [];
  profile.comments.push(comment);

  await fs.writeFile(FILE_PATH, JSON.stringify(profiles, null, 2));

  return NextResponse.json({ success: true });
}
