// app/page.tsx
"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div 
      className="max-h-[1000px] bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        backgroundImage: "url('/hero-img.png')"
      }}
    >
      {/* Hero */}
      <div className="max-w-5xl mx-auto text-left py-40">
        <div className="max-w-2xl">
          <h1 className="text-4xl mb-4">
            <strong>Honor and preserve</strong> the stories of the ones we miss.
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Use the power of AI and blockchain to create a beautiful online
            memorial to honor the life and legacy of your loved ones.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/create" className="inline-block">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors">
                Create a free memorial
              </button>
            </Link>

            <Link href="/explore" className="inline-block">
              <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 font-medium transition-colors">
                View Memorials
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
