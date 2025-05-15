import { writeFile, readFile, mkdir } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

const profilesPath = path.join(process.cwd(), 'data', 'profiles.json');
const uploadDir = path.join(process.cwd(), 'public', 'uploads');

export async function POST(req: Request) {
  const formData = await req.formData();

  const name = formData.get('name')?.toString() || '';
  const birth = formData.get('birth')?.toString() || '';
  const death = formData.get('death')?.toString() || '';
  const eulogy = formData.get('eulogy')?.toString() || '';
  const story = formData.get('story')?.toString() || '';
  const cause = formData.get('cause')?.toString() || '';
  const familyRaw = formData.get('family')?.toString() || '[]';
  const photo = formData.get('photo') as File | null;

  let filename = '';
  if (photo && photo.size > 0) {
    await mkdir(uploadDir, { recursive: true });
    const buffer = Buffer.from(await photo.arrayBuffer());
    filename = `${Date.now()}-${photo.name}`;
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);
  }

  const slug = formData.get('slug')?.toString().trim().toLowerCase().replace(/\s+/g, '-') || '';

  const createdBy = formData.get("createdBy")?.toString() || "";

  const newProfile = {
    id: Date.now().toString(),
    name,
    slug,
    birth,
    death,
    eulogy,
    story,
    cause,
    family: JSON.parse(familyRaw),
    photo: filename,
    createdBy,            // ✅ NEW
    comments: [],         // ✅ Initialize comments array
  };

  const existing = await readFile(profilesPath, 'utf8').catch(() => '[]');
  const profiles = JSON.parse(existing);
  profiles.push(newProfile);
  await writeFile(profilesPath, JSON.stringify(profiles, null, 2));

  return NextResponse.json({ success: true, profile: newProfile });
}

export async function GET() {
  const data = await readFile(profilesPath, 'utf8').catch(() => '[]');
  const profiles = JSON.parse(data);
  return NextResponse.json(profiles);
}
