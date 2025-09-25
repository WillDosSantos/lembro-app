import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import Link from "next/link";
import CommentSection from "@/components/CommentsSection";
import CommentForm from "@/components/CommentForm";
import CandleButton from "@/components/CandleButton";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AftercarePrompt from "@/components/aftercare/AftercarePrompt";
import PhotoCarousel from "@/components/PhotoCarousel";

interface Comment {
  id: string;
  message: string;
  author: string;
  approved: boolean;
  createdAt: string;
}

interface LifePhoto {
  filename: string;
  description?: string;
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
  candles?: number;
  lifePhotos?: LifePhoto[];
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

const causeDonationMap: Record<string, { label: string; url: string }> = {
  parkinsons: {
    label: "Donate to Parkinson's Foundation",
    url: "https://www.parkinson.org/ways-to-give",
  },
  "traffic accident due to drunk driving": {
    label: "Support MADD",
    url: "https://madd.org/donate",
  },
  cancer: {
    label: "Donate to American Cancer Society",
    url: "https://www.cancer.org/donate.html",
  },
  "heart disease": {
    label: "Donate to American Heart Association",
    url: "https://www.heart.org/en/get-involved/ways-to-give",
  },
  alzheimers: {
    label: "Donate to Alzheimer's Association",
    url: "https://www.alz.org/get-involved-now/donate",
  },
};

type Params = { slug: string };

export default async function ProfilePage({
  params,
}: {
  params: Promise<Params> | Params; // handle both shapes
}) {
  const resolved = params instanceof Promise ? await params : params;
  const { slug } = resolved;

  const profile = await getProfileBySlug(slug);
  if (!profile) return notFound();

  const session = await getServerSession(authOptions);
  const isOwner = session?.user?.email === profile.createdBy;

  return (
    <div className="relative">
      {/* Full Screen Hero Container */}
      <div className="hero-container relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Blurred Background Overlay */}
        {profile.photo && (
          <div
            className="absolute inset-0 w-full h-full profile-blur-bg"
            style={{
              backgroundImage: `url('/uploads/${profile.photo}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              zIndex: 1,
              opacity: 0.7,
            }}
          />
        )}
        
        {/* White Gradient Overlay for Navigation Visibility */}
        <div 
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 20%, transparent 50%)',
            zIndex: 2,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex items-center gap-24 p-8">
            {profile.photo && (
              <div className="w-[400px] h-[400px] rounded-3xl shadow-lg overflow-hidden" data-aos="fade-right" data-aos-delay="500">
                <img
                  src={`/uploads/${profile.photo}`}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          <div className="text-left" data-aos="fade-up" data-aos-delay="1000">
            <div className="mb-4">
              {(() => {
                const nameParts = profile.name.split(' ');
                const firstName = nameParts[0] || '';
                const lastName = nameParts.slice(1).join(' ') || '';
                return (
                  <>
                    <h1 className="text-6xl font-bold text-black uppercase leading-tight" style={{ letterSpacing: '0.28em' }} data-aos="fade-up" data-aos-delay="1500">
                      {firstName}
                    </h1>
                    {lastName && (
                      <h1 className="text-2xl font-bold text-black uppercase leading-tight" style={{ letterSpacing: '0.28em' }} data-aos="fade-up" data-aos-delay="2000">
                        {lastName}
                      </h1>
                    )}
                  </>
                );
              })()}
            </div>
            {(profile.birth || profile.death) && (
              <p className="text-black text-lg mt-2" data-aos="fade-up" data-aos-delay="2500">
                {profile.birth && (
                  <>
                    <strong>Born:</strong> {formatDate(profile.birth)}
                  </>
                )}
                {profile.death && (
                  <>
                    &nbsp;|&nbsp;<strong>Died:</strong>{" "}
                    {formatDate(profile.death)}
                  </>
                )}
              </p>
            )}
            
            {/* Action Buttons */}
            <div className="flex flex-col items-center sm:flex-row gap-4 mt-6" data-aos="fade-up" data-aos-delay="3000">
              <CandleButton slug={profile.slug} initialCount={profile.candles || 0} />
              {isOwner && (
                <Link
                  href={`/profiles/${profile.slug}/edit`}
                  className="text-black transition font-medium text-center"
                >
                  Edit Profile
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation and Content Below Hero */}
      <div className="p-8 max-w-5xl mx-auto space-y-6">
        <AftercarePrompt slug={slug} />
    
      {profile.eulogy && (
        <div className="max-w-2xl mx-auto my-20">
          <h2 className="text-xl font-semibold text-center mb-4 uppercase" style={{ letterSpacing: '0.28em' }}>Eulogy</h2>
          <p className="whitespace-pre-line">{profile.eulogy}</p>
        </div>
      )}
      {profile.lifePhotos && profile.lifePhotos.length > 0 && (
        <PhotoCarousel photos={profile.lifePhotos} />
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
    </div>
  );
}
