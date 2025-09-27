"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

interface StoryFormProps {
  profileSlug: string;
  profileName: string;
  onStoryAdded?: () => void;
  isOwner?: boolean;
}

export default function StoryForm({ profileSlug, profileName, onStoryAdded, isOwner = false }: StoryFormProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.email) {
      setMessage("You must be logged in to add a story.");
      return;
    }

    if (!content.trim()) {
      setMessage("Please enter a story.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(`/api/profiles/${profileSlug}/stories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: content.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setContent("");
        setMessage(isOwner 
          ? "Story added successfully! It's been automatically approved and will appear in the storybook."
          : "Story added successfully! It will be reviewed before appearing in the storybook."
        );
        onStoryAdded?.();
      } else {
        setMessage(data.error || "Failed to add story.");
      }
    } catch (error) {
      console.error("Error adding story:", error);
      setMessage("Failed to add story. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session?.user?.email) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-600">Please sign in to share a story about {profileName}.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">
        Tell us a story about {profileName}
      </h3>
      <p className="text-gray-600 text-sm mb-4">
        Share a memory, moment, or story that captures who {profileName} was. 
        {isOwner 
          ? " Your story will be automatically approved and included in the digital storybook."
          : " Your story will be reviewed before being included in the digital storybook."
        }
      </p>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="story-content" className="block text-sm font-medium text-gray-700 mb-2">
            Your Story
          </label>
          <textarea
            id="story-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={`Share a memory or story about ${profileName}...`}
          />
        </div>
        
        {message && (
          <div className={`text-sm p-3 rounded-md ${
            message.includes("successfully") 
              ? "bg-green-50 text-green-700 border border-green-200" 
              : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {message}
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !content.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Adding Story..." : "Add Story"}
          </button>
        </div>
      </div>
    </div>
  );
}
