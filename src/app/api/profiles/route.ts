import { writeFile, readFile, mkdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

// Types
interface LifePhotoMeta {
  description: string;
}

interface LifePhoto {
  filename: string;
  description: string;
}

interface FamilyMember {
  name: string;
  relationship: string;
}

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
  approved: boolean;
}

interface Profile {
  id: string;
  name: string;
  slug: string;
  birth: string;
  death: string;
  eulogy: string;
  story: string;
  cause: string;
  family: FamilyMember[];
  photo: string;
  createdBy: string;
  comments: Comment[];
  lifePhotos: LifePhoto[];
  candles: number;
}

// Constants
const PROFILES_PATH = path.join(process.cwd(), "data", "profiles.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// Helper functions
async function ensureUploadDirectory(): Promise<void> {
  await mkdir(UPLOAD_DIR, { recursive: true });
}

async function savePhoto(file: File, prefix: string = ""): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const filename = prefix ? `${timestamp}-${prefix}-${safeName}` : `${timestamp}-${safeName}`;
  const filePath = path.join(UPLOAD_DIR, filename);
  
  await writeFile(filePath, buffer);
  return filename;
}

async function processLifePhotos(formData: FormData, lifePhotosMeta: LifePhotoMeta[]): Promise<LifePhoto[]> {
  const uploadedLifePhotos: LifePhoto[] = [];

  for (let i = 0; i < lifePhotosMeta.length; i++) {
    const file = formData.get(`lifePhoto_${i}`) as File;
    
    if (file && file.size > 0) {
      try {
        const filename = await savePhoto(file, `life_${i}`);
        uploadedLifePhotos.push({
          filename,
          description: lifePhotosMeta[i]?.description || "",
        });
        console.log(`Life photo ${i} saved successfully: ${filename}`);
      } catch (error) {
        console.error(`Error saving life photo ${i}:`, error);
        throw new Error(`Failed to save life photo ${i}: ${error}`);
      }
    }
  }

  return uploadedLifePhotos;
}

function createSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export async function POST(req: Request) {
  try {
    console.log("Starting profile creation...");

    await ensureUploadDirectory();
    const formData = await req.formData();

    // Extract form data
    const name = formData.get("name")?.toString() || "";
    const birth = formData.get("birth")?.toString() || "";
    const death = formData.get("death")?.toString() || "";
    const eulogy = formData.get("eulogy")?.toString() || "";
    const story = formData.get("story")?.toString() || "";
    const cause = formData.get("cause")?.toString() || "";
    const familyRaw = formData.get("family")?.toString() || "[]";
    const photo = formData.get("photo") as File | null;
    const lifePhotosRaw = formData.get("lifePhotos")?.toString() || "[]";
    const createdBy = formData.get("createdBy")?.toString() || "";

    // Validate required fields
    if (!name.trim()) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    // Process main photo
    let mainPhotoFilename = "";
    if (photo && photo.size > 0) {
      try {
        mainPhotoFilename = await savePhoto(photo, "main");
        console.log("Main photo saved successfully:", mainPhotoFilename);
      } catch (error) {
        console.error("Error saving main photo:", error);
        throw new Error(`Failed to save main photo: ${error}`);
      }
    }

    // Process life photos
    const lifePhotosMeta: LifePhotoMeta[] = JSON.parse(lifePhotosRaw);
    const uploadedLifePhotos = await processLifePhotos(formData, lifePhotosMeta);

    // Create profile
    const slug = createSlug(name);
    const newProfile: Profile = {
      id: Date.now().toString(),
      name: name.trim(),
      slug,
      birth: birth.trim(),
      death: death.trim(),
      eulogy: eulogy.trim(),
      story: story.trim(),
      cause: cause.trim(),
      family: JSON.parse(familyRaw),
      photo: mainPhotoFilename,
      createdBy: createdBy.trim(),
      comments: [],
      lifePhotos: uploadedLifePhotos,
      candles: 0,
    };

    console.log("Saving profile with photos:", {
      mainPhoto: mainPhotoFilename,
      lifePhotos: uploadedLifePhotos.map(p => p.filename)
    });

    // Save to file
    const existing = await readFile(PROFILES_PATH, "utf8").catch(() => "[]");
    const profiles = JSON.parse(existing);
    profiles.push(newProfile);
    await writeFile(PROFILES_PATH, JSON.stringify(profiles, null, 2));

    console.log("Profile created successfully");
    return NextResponse.json({ 
      success: true, 
      profile: newProfile,
      slug: newProfile.slug 
    });

  } catch (error) {
    console.error("Error creating profile:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create profile";
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const data = await readFile(PROFILES_PATH, "utf8").catch(() => "[]");
    const profiles = JSON.parse(data);
    return NextResponse.json(profiles);
  } catch (error) {
    console.error("Error fetching profiles:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch profiles";
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

