'use client';

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function CommentForm({ slug }: { slug: string }) {
  const { data: session } = useSession();
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    const res = await fetch(`/api/profiles/${slug}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        author: session?.user?.email || "Anonymous"
      })
    });

    if (res.ok) {
      setStatus("success");
      setMessage("");
    } else {
      setStatus("idle");
      alert("Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mt-6">
      <textarea
        placeholder="Share a memory or kind words..."
        className="w-full border p-2"
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? 'Posting...' : 'Post Comment'}
      </button>
      {status === 'success' && (
        <p className="text-green-600">Thank you. Your comment is awaiting approval.</p>
      )}
    </form>
  );
}
