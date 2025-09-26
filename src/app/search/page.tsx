'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Profile {
  slug: string;
  name: string;
  birth: string;
  death: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Profile[]>([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      const res = await fetch('/api/profiles'); // or wherever your profile data lives
      const data: Profile[] = await res.json();

      // Basic case-insensitive search on name
      const filtered = data.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );

      setResults(filtered);
    };

    fetchProfiles();
  }, [query]);

  return (
    <div className="min-h-screen pt-24 px-8 pb-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>

      {results.length === 0 ? (
        <p className="text-gray-500">No results found.</p>
      ) : (
        <ul className="space-y-4">
          {results.map((profile) => (
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
