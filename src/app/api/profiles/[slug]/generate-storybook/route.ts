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

interface StorybookPage {
  id: string;
  title: string;
  content: string;
  photo?: string;
  author?: string;
  order: number;
}

interface GeneratedStorybook {
  id: string;
  title: string;
  pages: StorybookPage[];
  createdAt: string;
  generatedBy: string;
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
  generatedStorybook?: GeneratedStorybook;
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

// Mock AI function - in production, this would call OpenAI, Claude, or another AI service
function generateStorybookContent(profile: Profile, stories: Story[]): StorybookPage[] {
  const pages: StorybookPage[] = [];
  
  // Introduction page
  pages.push({
    id: "intro",
    title: `Remembering ${profile.name}`,
    content: `This is a collection of stories and memories about ${profile.name}, lovingly shared by family and friends. Each story captures a unique moment, a special memory, or a glimpse into the beautiful life they lived.`,
    photo: profile.photo,
    order: 0
  });

  // Group stories by themes and create pages
  const storyGroups = groupStoriesByTheme(stories);
  
  storyGroups.forEach((group, index) => {
    pages.push({
      id: `page-${index + 1}`,
      title: group.theme,
      content: group.content,
      photo: group.photo,
      author: group.authors.join(", "),
      order: index + 1
    });
  });

  // Conclusion page
  pages.push({
    id: "conclusion",
    title: "A Life Well Lived",
    content: `Though ${profile.name} may no longer be with us in person, their memory lives on through these stories and the love they shared with everyone around them. Their legacy continues to inspire and comfort those who knew them.`,
    photo: profile.lifePhotos?.[Math.floor(Math.random() * (profile.lifePhotos?.length || 1))]?.filename,
    order: pages.length
  });

  return pages;
}

function groupStoriesByTheme(stories: Story[]): Array<{ theme: string; content: string; photo?: string; authors: string[] }> {
  const themes = [
    "Childhood Memories",
    "Family Moments", 
    "Friendship & Laughter",
    "Life Achievements",
    "Special Occasions",
    "Words of Wisdom"
  ];

  const groups = themes.map(theme => ({
    theme,
    content: "",
    photo: undefined as string | undefined,
    authors: [] as string[]
  }));

  // Distribute stories across themes
  stories.forEach((story, index) => {
    const themeIndex = index % themes.length;
    const group = groups[themeIndex];
    
    if (group.content) {
      group.content += "\n\n";
    }
    
    // Clean and improve the story content
    const cleanedContent = cleanAndImproveStory(story.content);
    group.content += cleanedContent;
    group.authors.push(story.author);
  });

  // Filter out empty groups
  return groups.filter(group => group.content.trim().length > 0);
}

function cleanAndImproveStory(content: string): string {
  // Remove email addresses
  let cleaned = content.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '');
  
  // Remove author signatures at the end
  cleaned = cleaned.replace(/\s*-\s*[A-Za-z\s]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\s*$/g, '');
  cleaned = cleaned.replace(/\s*-\s*[A-Za-z\s]+\s*$/g, '');
  
  // Fix common grammar issues
  cleaned = cleaned.replace(/\bi\b/g, 'I'); // Capitalize "i" to "I"
  cleaned = cleaned.replace(/\bthey\b/g, 'They'); // Capitalize "they" at start of sentences
  cleaned = cleaned.replace(/\bwe\b/g, 'We'); // Capitalize "we" at start of sentences
  
  // Fix spacing issues
  cleaned = cleaned.replace(/\s+/g, ' '); // Multiple spaces to single space
  cleaned = cleaned.replace(/\s+([.!?])/g, '$1'); // Remove space before punctuation
  cleaned = cleaned.replace(/([.!?])\s*([a-z])/g, '$1 $2'); // Add space after punctuation
  
  // Capitalize first letter of sentences
  cleaned = cleaned.replace(/([.!?]\s*)([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase());
  
  // Ensure first letter is capitalized
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  
  // Fix common typos and improve readability
  cleaned = cleaned.replace(/\bte\b/g, 'tell');
  cleaned = cleaned.replace(/\bmy\b/g, 'my');
  cleaned = cleaned.replace(/\bnever\s+anyone\b/g, 'never let anyone');
  cleaned = cleaned.replace(/\bwilldossantosdesigns@gmail\.com\b/g, '');
  
  // Clean up any remaining artifacts
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  return cleaned;
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
      return NextResponse.json({ error: "Not authorized to generate storybook" }, { status: 403 });
    }

    // Get approved stories
    const approvedStories = (profile.stories || []).filter(story => story.approved);
    
    if (approvedStories.length < 2) {
      return NextResponse.json({ 
        error: "At least 2 approved stories are required to generate a storybook" 
      }, { status: 400 });
    }

    // Generate storybook content
    const pages = generateStorybookContent(profile, approvedStories);
    
    const storybook: GeneratedStorybook = {
      id: Date.now().toString(),
      title: `${profile.name}'s Storybook`,
      pages,
      createdAt: new Date().toISOString(),
      generatedBy: session.user.email
    };

    // Save the generated storybook to the profile
    profile.generatedStorybook = storybook;
    await saveProfile(profile);

    return NextResponse.json({ storybook });
  } catch (error) {
    console.error("Error generating storybook:", error);
    return NextResponse.json({ error: "Failed to generate storybook" }, { status: 500 });
  }
}
