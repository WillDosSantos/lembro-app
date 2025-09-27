'use client';

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [profiles, setProfiles] = useState([]);
  const [pendingComments, setPendingComments] = useState([]);

  useEffect(() => {
    if (session?.user?.email) {
      fetch("/api/profiles")
        .then(res => res.json())
        .then(data => {
          // Check if the response is an array (success) or an error object
          const allProfiles = Array.isArray(data) ? data : [];
          
          // Get only the ones created by this user
          const userProfiles = allProfiles.filter((p: any) => p.createdBy === session.user.email);
          setProfiles(userProfiles);

          // Gather pending comments from all of them
          const allPending = userProfiles.flatMap((profile: any) =>
            (profile.comments || []).filter((c: any) => !c.approved).map((c: any) => ({
              ...c,
              profileSlug: profile.slug,
              profileName: profile.name
            }))
          );
          setPendingComments(allPending);
        })
        .catch(error => {
          console.error("Error fetching profiles:", error);
          setProfiles([]);
          setPendingComments([]);
        });
    }
  }, [session]);

  if (status === "loading") {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="p-8 text-center">
        <p>Please <Link href="/login" className="text-blue-600 underline">log in</Link> to view your dashboard.</p>
      </div>
    );
  }

  const handleDeleteProfile = async () => {
    const confirmed = confirm("Are you sure you want to delete your account?");
    if (!confirmed) return;

    const res = await fetch("/api/delete-user", { method: "DELETE" });
    if (res.ok) {
      signOut();
    } else {
      alert("Failed to delete account.");
    }
  };

  return (
    <div className="pt-24 px-8 pb-8 max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Welcome, {session.user.name || session.user.email}</h1>

      <section>
        <h2 className="text-lg font-semibold mb-2">Your Memorials</h2>
        {profiles.length === 0 ? (
          <p className="text-sm text-gray-500">You haven’t created any memorials yet.</p>
        ) : (
          <ul className="space-y-2">
            {profiles.map((profile) => (
              <li key={profile.slug}>
                <Link href={`/profiles/${profile.slug}`} className="text-blue-600 hover:underline">
                  {profile.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Comments Awaiting Approval</h2>
        {pendingComments.length === 0 ? (
          <p className="text-sm text-gray-500">No comments waiting for approval.</p>
        ) : (
          <ul className="space-y-4">
            {pendingComments.map((comment) => (
              <li key={comment.id} className="border p-4 rounded">
                <p className="text-sm text-gray-700 whitespace-pre-line">{comment.message}</p>
                <p className="text-xs text-gray-400 mt-1">On <strong>{comment.profileName}</strong> by {comment.author}</p>
                <div className="mt-2 space-x-2">
                  <button
                    onClick={async () => {
                      await fetch(`/api/profiles/${comment.profileSlug}/comments/${comment.id}/approve`, {
                        method: "POST",
                      });
                      location.reload();
                    }}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Approve
                  </button>
                  <button
                    onClick={async () => {
                      await fetch(`/api/profiles/${comment.profileSlug}/comments/${comment.id}/delete`, {
                        method: "DELETE",
                      });
                      location.reload();
                    }}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="border-t pt-4">
        <button
          onClick={handleDeleteProfile}
          className="text-sm text-red-600 hover:underline"
        >
          Delete My Account
        </button>
        <br />
        <button
          onClick={() => signOut()}
          className="text-sm text-gray-600 hover:underline mt-2"
        >
          Log Out
        </button>
      </section>
    </div>
  );
}
