'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function NavBar() {
  const { data: session } = useSession()

  return (
    <nav className="w-full bg-gray-100 px-6 py-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-lg font-semibold text-gray-800">Lembra</Link>
        <Link href="/explore" className="text-gray-600 hover:text-black">Explore</Link>
      </div>

      <div className="flex items-center gap-4">
        <ConnectButton />
        {session ? (
          <>
            <Link href="/dashboard" className="text-sm text-gray-700 hover:underline">My Dashboard</Link>
            <button onClick={() => signOut()} className="text-sm text-red-600 hover:underline">Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm text-gray-700 hover:underline">Login</Link>
            <Link href="/signup" className="text-sm text-blue-600 hover:underline">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  )
}
