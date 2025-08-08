// app/page.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="max-w-4xl mx-auto text-center py-20 px-4">
        <h1 className="text-4xl font-bold mb-4">Preserve the Stories of Those Who Matter Most</h1>
        <p className="text-lg text-gray-600 mb-8">
          Create a beautiful online memorial to honor the life and legacy of your loved one.
        </p>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search memorials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded w-full sm:w-96"
          />
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Search
          </button>
        </form>

        {/* Create CTA */}
        <Link href="/create" className="inline-block mt-4 text-blue-600 hover:underline font-medium">
          Or create a new memorial →
        </Link>
      </div>
    </div>
  );
}
