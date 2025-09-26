import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import fs from 'fs';
import path from 'path';

const profilesPath = path.join(process.cwd(), 'data', 'profiles.json');

interface Contributor {
  email: string;
  role: 'editor' | 'viewer';
  invitedAt: string;
  acceptedAt?: string;
  invitedBy: string;
}

interface Profile {
  id: string;
  slug: string;
  createdBy: string;
  contributors?: Contributor[];
  // ... other profile fields
}

// POST - Accept an invitation
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { profileSlug } = await request.json();

    if (!profileSlug) {
      return NextResponse.json({ error: 'Profile slug is required' }, { status: 400 });
    }

    const profiles = JSON.parse(fs.readFileSync(profilesPath, 'utf8'));
    const profileIndex = profiles.findIndex((p: Profile) => p.slug === profileSlug);

    if (profileIndex === -1) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const profile = profiles[profileIndex];

    // Find the contributor invitation
    const contributorIndex = profile.contributors?.findIndex(
      (c: Contributor) => c.email === session.user.email && !c.acceptedAt
    );

    if (contributorIndex === -1 || contributorIndex === undefined) {
      return NextResponse.json({ error: 'No pending invitation found' }, { status: 404 });
    }

    // Accept the invitation
    profile.contributors[contributorIndex].acceptedAt = new Date().toISOString();

    // Save updated profile
    fs.writeFileSync(profilesPath, JSON.stringify(profiles, null, 2));

    return NextResponse.json({ 
      success: true, 
      message: 'Invitation accepted successfully' 
    });
  } catch (error) {
    console.error('Error accepting invitation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
