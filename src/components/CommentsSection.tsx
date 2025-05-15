'use client';

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function CommentSection({ comments, profileSlug, createdBy }: { comments: any[], profileSlug: string, createdBy: string }) {
  const { data: session } = useSession();
  const [localComments, setLocalComments] = useState(comments || []);
  const isOwner = session?.user?.email === createdBy;

  const handleApprove = async (id: string) => {
    await fetch(`/api/profiles/${profileSlug}/comments/${id}/approve`, { method: "POST" });
    location.reload();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/profiles/${profileSlug}/comments/${id}/delete`, { method: "DELETE" });
    location.reload();
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Comments</h2>
      {localComments.length === 0 && <p className="text-sm text-gray-500">No comments yet.</p>}
      {localComments.map((c) => (
        <div key={c.id} className="border-t pt-4 mt-4 space-y-1">
          <p className="text-sm text-gray-700 whitespace-pre-line">{c.message}</p>
          <p className="text-xs text-gray-400">— {c.author}</p>
          {isOwner && (
            <div className="mt-1 space-x-2">
              {!c.approved && (
                <button
                  onClick={() => handleApprove(c.id)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Approve
                </button>
              )}
              <button
                onClick={() => handleDelete(c.id)}
                className="text-xs text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
