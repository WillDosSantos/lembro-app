"use client";

import { useState } from "react";
import Link from "next/link";
import CommentSection from "@/components/CommentsSection";
import CommentForm from "@/components/CommentForm";
import CandleButton from "@/components/CandleButton";
import AftercarePrompt from "@/components/aftercare/AftercarePrompt";
import PhotoCarousel from "@/components/PhotoCarousel";
import CandleGlowEffect from "@/components/CandleGlowEffect";
import StorybookDisplay from "@/components/StorybookDisplay";

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

interface FamilyMember {
  first: string;
  last: string;
  photo?: string;
  relationship?: string;
  description?: string;
}

interface ProfilePreviewProps {
  profile: {
    id: string;
    slug: string;
    name: string;
    photo: string;
    birth?: string;
    death?: string;
    eulogy?: string;
    story?: string;
    cause?: string;
    family?: FamilyMember[];
    comments?: Comment[];
    createdBy?: string;
    candles?: number;
    lifePhotos?: LifePhoto[];
    stories?: Story[];
    generatedStorybook?: GeneratedStorybook;
  };
  onClose: () => void;
}

function formatDate(dateStr: string | undefined) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return dateStr;
  }
  return new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(date);
}

export default function ProfilePreview({ profile, onClose }: ProfilePreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 ${isFullscreen ? 'p-0' : ''}`}>
      <div className={`bg-white rounded-lg shadow-xl ${isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl max-h-[90vh] overflow-y-auto'}`}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Preview: {profile.name}'s Memorial</h2>
          <div className="flex space-x-2">
            <button
              onClick={toggleFullscreen}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded"
            >
              Close Preview
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="p-6">
          <div className="relative">
            {/* Responsive Hero Container */}
            <div className="hero-container relative min-h-[60vh] sm:min-h-[70vh] lg:min-h-screen flex items-center justify-center overflow-hidden">
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
                  background:
                    "linear-gradient(to bottom, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 20%, transparent 50%)",
                  zIndex: 2,
                }}
              />

              {/* Content */}
              <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-center gap-6 lg:gap-24 p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto">
                {profile.photo && (
                  <div
                    className="w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] lg:w-[400px] lg:h-[400px] rounded-3xl shadow-lg overflow-hidden flex-shrink-0"
                    data-aos="fade-up"
                    data-aos-delay="500"
                  >
                    <img
                      src={`/uploads/${profile.photo}`}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="text-center lg:text-left w-full" data-aos="fade-up" data-aos-delay="200">
                  <div className="mb-4">
                    {(() => {
                      const nameParts = profile.name.split(" ");
                      const firstName = nameParts[0] || "";
                      const lastName = nameParts.slice(1).join(" ") || "";
                      return (
                        <>
                          <CandleGlowEffect>
                            <h1
                              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black uppercase leading-tight"
                              style={{ letterSpacing: "0.28em" }}
                              data-aos="fade-up"
                              data-aos-delay="400"
                            >
                              {firstName}
                            </h1>
                          </CandleGlowEffect>
                          {lastName && (
                            <CandleGlowEffect>
                              <h1
                                className="text-xl sm:text-2xl font-bold text-black uppercase leading-tight"
                                style={{ letterSpacing: "0.28em" }}
                                data-aos="fade-up"
                                data-aos-delay="600"
                              >
                                {lastName}
                              </h1>
                            </CandleGlowEffect>
                          )}
                        </>
                      );
                    })()}
                  </div>
                  {(profile.birth || profile.death) && (
                    <p
                      className="text-black text-base sm:text-lg mt-2"
                      data-aos="fade-up"
                      data-aos-delay="800"
                    >
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
                  <div
                    className="flex flex-col lg:flex-row gap-4 mt-6 w-full max-w-sm mx-auto lg:mx-0 lg:max-w-none lg:items-start"
                    data-aos="fade-up"
                    data-aos-delay="1000"
                  >
                    <CandleButton
                      slug={profile.slug}
                      initialCount={profile.candles || 0}
                    />
                    <Link
                      href={`/profiles/${profile.slug}/edit`}
                      className="w-full lg:w-auto text-black transition font-medium text-center py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50"
                    >
                      Edit Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation and Content Below Hero */}
            <div className="p-8 max-w-5xl mx-auto space-y-6">
              <AftercarePrompt slug={profile.slug} />

              {profile.eulogy && (
                <div className="max-w-2xl mx-auto my-20" data-aos="fade-up">
                  <h2
                    className="text-xl font-semibold text-center mb-4 uppercase"
                    style={{ letterSpacing: "0.28em" }}
                  >
                    Eulogy
                  </h2>
                  <p className="whitespace-pre-line">{profile.eulogy}</p>
                </div>
              )}
            </div>

            {/* Generated Storybook Section */}
            {profile.generatedStorybook && (
              <StorybookDisplay storybook={profile.generatedStorybook} />
            )}

            {/* Photo Carousel - Full Width Section */}
            {profile.lifePhotos && profile.lifePhotos.length > 0 && (
              <div data-aos="fade-up">
                <PhotoCarousel
                  photos={profile.lifePhotos}
                  profilePhoto={profile.photo}
                />
              </div>
            )}

            {/* Family Members - Back to Container */}
            <div className="p-8 max-w-5xl mx-auto space-y-6">
              {profile.family && profile.family.length > 0 && (
                <div className="mt-20" data-aos="fade-up">
                  <div className="text-center mb-12">
                    <h2
                      className="text-xl font-semibold text-center mb-4 uppercase"
                      style={{ letterSpacing: "0.28em" }}
                    >
                      Family Members
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                      The people who shared their life and created lasting memories
                      together
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {profile.family.map((member, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                      >
                        <div className="text-center">
                          {/* Photo or Icon Placeholder */}
                          <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                            {member.photo ? (
                              <img
                                src={`/uploads/${member.photo}`}
                                alt={`${member.first} ${member.last}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <svg
                                className="w-10 h-10 text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>

                          {/* Name */}
                          <h3 className="text-lg font-semibold text-gray-800 mb-1">
                            {member.first} {member.last}
                          </h3>

                          {/* Relationship (if available) */}
                          {member.relationship && (
                            <p className="text-sm text-gray-500 mb-3">
                              {member.relationship}
                            </p>
                          )}

                          {/* Optional description or memory */}
                          {member.description && (
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {member.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="max-w-2xl mx-auto my-20 pb-40">
                <CommentSection
                  comments={profile.comments || []}
                  profileSlug={profile.slug}
                  createdBy={profile.createdBy || ""}
                />
                <CommentForm slug={profile.slug} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
