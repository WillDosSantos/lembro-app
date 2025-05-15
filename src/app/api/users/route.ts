import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const USERS_PATH = path.join(process.cwd(), 'data', 'users.json');

export async function POST(req: Request) {
  const user = await req.json();
  const existingRaw = await fs.readFile(USERS_PATH).catch(() => '[]');
  const users = JSON.parse(existingRaw);
  users.push(user);
  await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2));
  return NextResponse.json({ success: true });
}
