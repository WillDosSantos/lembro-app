'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Contributor {
  email: string;
  role: 'editor' | 'viewer';
  invitedAt: string;
  acceptedAt?: string;
  invitedBy: string;
}

interface ContributorManagerProps {
  profileSlug: string;
  isOwner: boolean;
}

export default function ContributorManager({ profileSlug, isOwner }: ContributorManagerProps) {
  const { data: session } = useSession();
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContributorEmail, setNewContributorEmail] = useState('');
  const [newContributorRole, setNewContributorRole] = useState<'editor' | 'viewer'>('editor');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch contributors
  const fetchContributors = async () => {
    try {
      const response = await fetch(`/api/profiles/${profileSlug}/contributors`);
      if (response.ok) {
        const data = await response.json();
        setContributors(data.contributors || []);
      }
    } catch (error) {
      console.error('Error fetching contributors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContributors();
  }, [profileSlug]);

  // Add contributor
  const handleAddContributor = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (!newContributorEmail.trim()) return;

    setSubmitting(true);
    setMessage('');

    try {
      const response = await fetch(`/api/profiles/${profileSlug}/contributors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newContributorEmail.trim(),
          role: newContributorRole,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Invitation sent successfully!');
        setNewContributorEmail('');
        setShowAddForm(false);
        fetchContributors(); // Refresh the list
      } else {
        setMessage(data.error || 'Failed to send invitation');
      }
    } catch (error) {
      console.error('Error adding contributor:', error);
      setMessage('Failed to send invitation');
    } finally {
      setSubmitting(false);
    }
  };

  // Remove contributor
  const handleRemoveContributor = async (email: string) => {
    if (!confirm(`Are you sure you want to remove ${email} as a contributor?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/profiles/${profileSlug}/contributors?email=${encodeURIComponent(email)}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Contributor removed successfully');
        fetchContributors(); // Refresh the list
      } else {
        setMessage(data.error || 'Failed to remove contributor');
      }
    } catch (error) {
      console.error('Error removing contributor:', error);
      setMessage('Failed to remove contributor');
    }
  };

  // Accept invitation
  const handleAcceptInvitation = async () => {
    try {
      const response = await fetch('/api/invitations/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileSlug,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Invitation accepted successfully!');
        fetchContributors(); // Refresh the list
      } else {
        setMessage(data.error || 'Failed to accept invitation');
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
      setMessage('Failed to accept invitation');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading contributors...</div>;
  }

  // Check if current user has a pending invitation
  const pendingInvitation = contributors.find(
    (c) => c.email === session?.user?.email && !c.acceptedAt
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Contributors</h3>
        {isOwner && (
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showAddForm ? 'Cancel' : '+ Add Contributor'}
          </button>
        )}
      </div>

      {/* Pending invitation for current user */}
      {pendingInvitation && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-800 font-medium">You have a pending invitation</p>
              <p className="text-yellow-700 text-sm">
                You've been invited as a {pendingInvitation.role} for this memorial.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAcceptInvitation}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Accept Invitation
            </button>
          </div>
        </div>
      )}

      {/* Add contributor form */}
      {showAddForm && isOwner && (
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAddContributor(e);
          }} 
          className="mb-6 p-4 bg-gray-50 rounded-lg"
        >
          <h4 className="font-medium text-gray-900 mb-4">Invite a Contributor</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={newContributorEmail}
                onChange={(e) => setNewContributorEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddContributor(e);
                  }
                }}
                placeholder="Enter email address"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={newContributorRole}
                onChange={(e) => setNewContributorRole(e.target.value as 'editor' | 'viewer')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddContributor(e);
                  }
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="editor">Editor (can edit content)</option>
                <option value="viewer">Viewer (can only view)</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {submitting ? 'Sending...' : 'Send Invitation'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Message */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg ${
          message.includes('success') || message.includes('accepted')
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      {/* Contributors list */}
      <div className="space-y-3">
        {contributors.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No contributors yet</p>
        ) : (
          contributors.map((contributor, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-900">{contributor.email}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    contributor.role === 'editor'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {contributor.role}
                  </span>
                  {contributor.acceptedAt ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Invited by {contributor.invitedBy} on{' '}
                  {new Date(contributor.invitedAt).toLocaleDateString()}
                </p>
              </div>
              {isOwner && (
                <button
                  type="button"
                  onClick={() => handleRemoveContributor(contributor.email)}
                  className="text-red-600 hover:text-red-800 p-1"
                  title="Remove contributor"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
