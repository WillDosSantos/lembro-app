'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProfileCard from '@/components/ProfileCard';

interface Profile {
  id: string;
  name: string;
  slug: string;
  photo?: string;
  // include other fields if you like
}

export default function HomePage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  // Fetch profiles from API
  useEffect(() => {
    fetch('/api/profiles')
      .then((res) => res.json())
      .then((data) => setProfiles(data));
  }, []);

  return (
    <div className="p-8">
      
      <Link href="/create">
        <button className="mb-8 bg-green-600 text-white px-6 py-2 rounded">
          Create a Memorial
        </button>
      </Link>

      <h2 className="text-2xl font-semibold mt-10 mb-4">All Profiles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <ProfileCard key={profile.slug} profile={profile} />
        ))}
      </div>
    </div>
  );
}
