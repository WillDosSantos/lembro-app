'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Profile {
  slug: string;
  name: string;
  birth: string;
  death: string;
}

export default function ExplorePage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      const res = await fetch('/api/profiles'); // or your data source
      const data = await res.json();
      setProfiles(data);
    };

    fetchProfiles();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">The ones we remember</h1>

      {profiles.length === 0 ? (
        <p className="text-gray-500">No memorials yet.</p>
      ) : (
        <ul className="space-y-4">
          {profiles.map((profile) => (
            <li key={profile.slug} className="bg-white shadow p-4 rounded">
              <Link href={`/profiles/${profile.slug}`} className="text-xl font-semibold text-blue-600 hover:underline">
                {profile.name}
              </Link>
              <p className="text-gray-500 text-sm">
                {profile.birth} – {profile.death}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
