import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import path from "path";
import fs from "fs/promises";

const USERS_PATH = path.join(process.cwd(), "data", "users.json");
const PROFILES_PATH = path.join(process.cwd(), "data", "profiles.json");

export async function DELETE() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const email = session.user.email;

  // Delete user from users.json
  const usersRaw = await fs.readFile(USERS_PATH, "utf-8");
  const users = JSON.parse(usersRaw);
  const updatedUsers = users.filter((u: any) => u.email !== email);
  await fs.writeFile(USERS_PATH, JSON.stringify(updatedUsers, null, 2));

  // Delete memorials created by this user
  const profilesRaw = await fs.readFile(PROFILES_PATH, "utf-8");
  const profiles = JSON.parse(profilesRaw);
  const updatedProfiles = profiles.filter((p: any) => p.createdBy !== email);
  await fs.writeFile(PROFILES_PATH, JSON.stringify(updatedProfiles, null, 2));

  return NextResponse.json({ success: true });
}
