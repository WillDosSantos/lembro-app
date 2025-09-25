'use client';

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BiSearch } from "react-icons/bi";

export default function NavBar() {
  const { data: session } = useSession();
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search)}`);
    }
  };

  return (
        <nav className="w-full px-6 py-4 absolute top-0 left-0 right-0 z-50" style={{ boxShadow: 'none' }}>
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <div className="flex items-start items-center space-x-4">
          <Link href="/" className="text-lg font-semibold text-gray-800">Lembra</Link>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative max-w-md">
            <input
              type="text"
              placeholder="Search memorials..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-sm pl-4 pr-12 py-2 border bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
            <button 
              type="submit" 
              className="absolute right-[7px] top-1/2 transform -translate-y-1/2 bg-black text-white p-1.5 rounded-full hover:bg-blue-700 transition-colors"
            >
              <BiSearch className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="flex items-center space-x-4">
          {session ? (
            <>
              <Link href="/aftercare" className="text-sm text-gray-700 hover:underline">Emotional support & services</Link>
              <Link href="/dashboard" className="text-sm text-gray-700 hover:underline">My Dashboard</Link>
              <button
                onClick={() => signOut()}
                className="text-sm text-red-600 hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-700 hover:underline">Login</Link>
              <Link href="/signup" className="text-sm text-blue-600 hover:underline">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
