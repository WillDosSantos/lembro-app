import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import Link from "next/link";
import CommentSection from "@/components/CommentsSection";
import CommentForm from "@/components/CommentForm";

interface Comment {
  id: string;
  message: string;
  author: string;
  approved: boolean;
  createdAt: string;
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
  family?: { first: string; last: string }[];
  comments?: Comment[];
  createdBy?: string;
}

function formatDate(dateStr: string | undefined) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(date);
}

async function getProfileBySlug(slug: string): Promise<Profile | null> {
  const filePath = path.join(process.cwd(), "data", "profiles.json");
  const data = await fs.readFile(filePath, "utf8").catch(() => "[]");
  const profiles: Profile[] = JSON.parse(data);
  return profiles.find((p) => p.slug === slug) || null;
}


interface PageProps {
  params: { slug: string };
}

export default async function ProfilePage({ params }: { params: { slug: string } }) {
  const profile = await getProfileBySlug(params.slug);
  if (!profile) return notFound();


  if (!profile) return notFound();

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← Back to Home
      </Link>
      <h1 className="text-3xl font-bold">{profile.name}</h1>
      {profile.photo && (
        <img
          src={`/uploads/${profile.photo}`}
          alt={profile.name}
          className="w-full max-w-md object-cover rounded"
        />
      )}
      {(profile.birth || profile.death) && (
        <p className="text-gray-600">
          {profile.birth && (
            <>
              <strong>Born:</strong> {formatDate(profile.birth)}
            </>
          )}
          {profile.death && (
            <>
              &nbsp;|&nbsp;<strong>Died:</strong> {formatDate(profile.death)}
            </>
          )}
        </p>
      )}
      {profile.cause && (
        <p>
          <strong>Cause of Death:</strong> {profile.cause}
        </p>
      )}
      {profile.eulogy && (
        <div>
          <h2 className="text-xl font-semibold">Eulogy</h2>
          <p className="whitespace-pre-line">{profile.eulogy}</p>
        </div>
      )}
      {profile.story && (
        <div>
          <h2 className="text-xl font-semibold">Life Story</h2>
          <p className="whitespace-pre-line">{profile.story}</p>
        </div>
      )}
      {profile.lifePhotos?.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Life in Photos</h2>

          <div className="space-y-6 border-l-2 border-gray-300 pl-4">
            {profile.lifePhotos.map((photo: any, index: number) => (
              <div key={index} className="relative pl-4">
                <div className="absolute -left-[9px] top-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                <img
                  src={`/uploads/${photo.filename}`}
                  alt={`Life photo ${index + 1}`}
                  className="w-full max-w-xl rounded shadow-md"
                />
                {photo.description && (
                  <p className="mt-2 text-gray-700 text-sm">
                    {photo.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {profile.family && profile.family.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold">Family Members</h2>
          <ul className="list-disc list-inside">
            {profile.family.map((member, i) => (
              <li key={i}>
                {member.first} {member.last}
              </li>
            ))}
          </ul>
        </div>
      )}
      <CommentForm slug={profile.slug} />
      <CommentSection
        comments={profile.comments || []}
        profileSlug={profile.slug}
        createdBy={profile.createdBy || ""}
      />
    </div>
  );
}
