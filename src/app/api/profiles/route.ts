import { writeFile, readFile, mkdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";


const profilesPath = path.join(process.cwd(), "data", "profiles.json");
const uploadDir = path.join(process.cwd(), "public", "uploads");


export async function POST(req: Request) {
  try {
    console.log("Starting profile creation...");

    // Ensure upload directory exists
    await mkdir(uploadDir, { recursive: true });

    const formData = await req.formData();

    const name = formData.get("name")?.toString() || "";
    const birth = formData.get("birth")?.toString() || "";
    const death = formData.get("death")?.toString() || "";
    const eulogy = formData.get("eulogy")?.toString() || "";
    const story = formData.get("story")?.toString() || "";
    const cause = formData.get("cause")?.toString() || "";
    const familyRaw = formData.get("family")?.toString() || "[]";
    const photo = formData.get("photo") as File | null;

    console.log("Main photo received:", photo ? `Size: ${photo.size} bytes` : "No photo");

    let filename = "";
    if (photo && photo.size > 0) {
      try {
        const buffer = Buffer.from(await photo.arrayBuffer());
        filename = `${Date.now()}-${photo.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const filePath = path.join(uploadDir, filename);
        console.log("Saving main photo to:", filePath);
        await writeFile(filePath, buffer);
        console.log("Main photo saved successfully");
      } catch (error) {
        console.error("Error saving main photo:", error);
        throw error;
      }
    }

    const lifePhotosRaw = formData.get("lifePhotos")?.toString() || "[]";
    const lifePhotosMeta = JSON.parse(lifePhotosRaw);
    console.log("Life photos metadata:", lifePhotosMeta);

    const uploadedLifePhotos = [];

    for (let i = 0; i < lifePhotosMeta.length; i++) {
      const file = formData.get(`lifePhoto_${i}`) as File;
      console.log(`Processing life photo ${i}:`, file ? `Size: ${file.size} bytes` : "No file");

      if (file && file.size > 0) {
        try {
          const buffer = Buffer.from(await file.arrayBuffer());
          const safeFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
          const filePath = path.join(uploadDir, safeFilename);
          console.log(`Saving life photo ${i} to:`, filePath);
          await writeFile(filePath, buffer);
          console.log(`Life photo ${i} saved successfully`);

          uploadedLifePhotos.push({
            filename: safeFilename,
            description: lifePhotosMeta[i]?.description || "",
          });
        } catch (error) {
          console.error(`Error saving life photo ${i}:`, error);
          throw error;
        }
      }
    }

    const slug =
      formData
        .get("slug")
        ?.toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-") || "";

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
      createdBy,
      comments: [],
      lifePhotos: uploadedLifePhotos,
      candles: 0,
    };

    console.log("Saving profile with photos:", {
      mainPhoto: filename,
      lifePhotos: uploadedLifePhotos.map(p => p.filename)
    });

    const existing = await readFile(profilesPath, "utf8").catch(() => "[]");
    const profiles = JSON.parse(existing);
    profiles.push(newProfile);
    await writeFile(profilesPath, JSON.stringify(profiles, null, 2));

    console.log("Profile created successfully");
    return NextResponse.json({ success: true, profile: newProfile });
  } catch (error) {
    console.error("Error creating profile:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create profile" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const data = await readFile(profilesPath, "utf8").catch(() => "[]");
    const profiles = JSON.parse(data);
    return NextResponse.json(profiles);
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch profiles" },
      { status: 500 }
    );
  }
}

