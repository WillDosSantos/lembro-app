import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface Story {
  id: string;
  content: string;
  author: string;
  authorEmail: string;
  createdAt: string;
  approved: boolean;
}

interface Profile {
  id: string;
  slug: string;
  name: string;
  photo: string;
  birth?: string;
  death?: string;
  eulogy?: string;
  story?: string;
  cause?: string;
  family?: {
    first: string;
    last: string;
    photo?: string;
    relationship?: string;
    description?: string;
  }[];
  comments?: any[];
  createdBy?: string;
  candles?: number;
  lifePhotos?: any[];
  stories?: Story[];
  generatedStorybook?: any;
  contributors?: {
    email: string;
    role: string;
    invitedAt: string;
    acceptedAt?: string;
  }[];
}

async function getProfileBySlug(slug: string): Promise<Profile | null> {
  const filePath = path.join(process.cwd(), "data", "profiles.json");
  const data = await fs.readFile(filePath, "utf8").catch(() => "[]");
  const profiles: Profile[] = JSON.parse(data);
  return profiles.find((p) => p.slug === slug) || null;
}

async function saveProfile(profile: Profile): Promise<void> {
  const filePath = path.join(process.cwd(), "data", "profiles.json");
  const data = await fs.readFile(filePath, "utf8").catch(() => "[]");
  const profiles: Profile[] = JSON.parse(data);
  const index = profiles.findIndex((p) => p.slug === profile.slug);
  
  if (index !== -1) {
    profiles[index] = profile;
  } else {
    profiles.push(profile);
  }
  
  await fs.writeFile(filePath, JSON.stringify(profiles, null, 2));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const profile = await getProfileBySlug(slug);
    
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ stories: profile.stories || [] });
  } catch (error) {
    console.error("Error fetching stories:", error);
    return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const profile = await getProfileBySlug(slug);
    
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Check if user is owner or contributor
    const isOwner = session.user.email === profile.createdBy;
    const isContributor = profile.contributors?.some(
      (c) => c.email === session.user.email && c.acceptedAt && c.role === "editor"
    );

    if (!isOwner && !isContributor) {
      return NextResponse.json({ error: "Not authorized to add stories" }, { status: 403 });
    }

    const { content } = await request.json();
    
    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: "Story content is required" }, { status: 400 });
    }

    const newStory: Story = {
      id: Date.now().toString(),
      content: content.trim(),
      author: session.user.name || "Anonymous",
      authorEmail: session.user.email,
      createdAt: new Date().toISOString(),
      approved: isOwner // Auto-approve if owner, otherwise needs approval
    };

    // Initialize stories array if it doesn't exist
    if (!profile.stories) {
      profile.stories = [];
    }

    profile.stories.push(newStory);
    await saveProfile(profile);

    return NextResponse.json({ story: newStory });
  } catch (error) {
    console.error("Error adding story:", error);
    return NextResponse.json({ error: "Failed to add story" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const profile = await getProfileBySlug(slug);
    
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Check if user is owner
    const isOwner = session.user.email === profile.createdBy;
    if (!isOwner) {
      return NextResponse.json({ error: "Only the profile owner can approve stories" }, { status: 403 });
    }

    const { storyId, approved } = await request.json();
    
    if (!profile.stories) {
      return NextResponse.json({ error: "No stories found" }, { status: 404 });
    }

    const storyIndex = profile.stories.findIndex((s) => s.id === storyId);
    if (storyIndex === -1) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    profile.stories[storyIndex].approved = approved;
    await saveProfile(profile);

    return NextResponse.json({ story: profile.stories[storyIndex] });
  } catch (error) {
    console.error("Error updating story:", error);
    return NextResponse.json({ error: "Failed to update story" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const profile = await getProfileBySlug(slug);
    
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Check if user is owner
    const isOwner = session.user.email === profile.createdBy;
    if (!isOwner) {
      return NextResponse.json({ error: "Only the profile owner can delete stories" }, { status: 403 });
    }

    const { storyId } = await request.json();
    
    if (!profile.stories) {
      return NextResponse.json({ error: "No stories found" }, { status: 404 });
    }

    profile.stories = profile.stories.filter((s) => s.id !== storyId);
    await saveProfile(profile);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting story:", error);
    return NextResponse.json({ error: "Failed to delete story" }, { status: 500 });
  }
}
