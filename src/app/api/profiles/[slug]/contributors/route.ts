import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import fs from 'fs';
import path from 'path';
import { sendTestInvitationEmail } from '@/lib/emailService';

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

// GET - Get contributors for a profile
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profiles = JSON.parse(fs.readFileSync(profilesPath, 'utf8'));
    const profile = profiles.find((p: Profile) => p.slug === params.slug);

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Check if user is owner or contributor
    const isOwner = profile.createdBy === session.user.email;
    const isContributor = profile.contributors?.some(
      (c: Contributor) => c.email === session.user.email && c.acceptedAt
    );

    if (!isOwner && !isContributor) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ contributors: profile.contributors || [] });
  } catch (error) {
    console.error('Error fetching contributors:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Add a new contributor
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, role = 'editor' } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const profiles = JSON.parse(fs.readFileSync(profilesPath, 'utf8'));
    const profileIndex = profiles.findIndex((p: Profile) => p.slug === params.slug);

    if (profileIndex === -1) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const profile = profiles[profileIndex];

    // Check if user is the owner
    if (profile.createdBy !== session.user.email) {
      return NextResponse.json({ error: 'Only the profile owner can add contributors' }, { status: 403 });
    }

    // Check if email is already a contributor
    if (profile.contributors?.some((c: Contributor) => c.email === email)) {
      return NextResponse.json({ error: 'User is already a contributor' }, { status: 400 });
    }

    // Check if email is the owner
    if (profile.createdBy === email) {
      return NextResponse.json({ error: 'Cannot add the profile owner as a contributor' }, { status: 400 });
    }

    // Add contributor
    const newContributor: Contributor = {
      email,
      role,
      invitedAt: new Date().toISOString(),
      invitedBy: session.user.email,
    };

    if (!profile.contributors) {
      profile.contributors = [];
    }
    profile.contributors.push(newContributor);

    // Save updated profile
    fs.writeFileSync(profilesPath, JSON.stringify(profiles, null, 2));

    // Send invitation email
    try {
      const emailResult = await sendTestInvitationEmail(
        email,
        session.user.name || session.user.email,
        profile.name,
        params.slug,
        role
      );

      if (emailResult.success) {
        console.log(`Invitation email sent to ${email} for profile ${params.slug}`);
      } else {
        console.error(`Failed to send invitation email to ${email}:`, emailResult.error);
      }
    } catch (error) {
      console.error('Error sending invitation email:', error);
    }

    return NextResponse.json({ 
      success: true, 
      contributor: newContributor,
      message: 'Invitation sent successfully' 
    });
  } catch (error) {
    console.error('Error adding contributor:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Remove a contributor
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const profiles = JSON.parse(fs.readFileSync(profilesPath, 'utf8'));
    const profileIndex = profiles.findIndex((p: Profile) => p.slug === params.slug);

    if (profileIndex === -1) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const profile = profiles[profileIndex];

    // Check if user is the owner
    if (profile.createdBy !== session.user.email) {
      return NextResponse.json({ error: 'Only the profile owner can remove contributors' }, { status: 403 });
    }

    // Remove contributor
    if (profile.contributors) {
      profile.contributors = profile.contributors.filter(
        (c: Contributor) => c.email !== email
      );
    }

    // Save updated profile
    fs.writeFileSync(profilesPath, JSON.stringify(profiles, null, 2));

    return NextResponse.json({ success: true, message: 'Contributor removed successfully' });
  } catch (error) {
    console.error('Error removing contributor:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
