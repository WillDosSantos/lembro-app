"use client";

import { useState } from "react";

interface StoryTestHelperProps {
  profileSlug: string;
  profileName: string;
  onStoriesAdded?: () => void;
}

const sampleStories = [
  "I remember when we were kids and {name} would always share their lunch with me. They had the biggest heart and never wanted anyone to go hungry. That kindness stayed with me my whole life.",
  
  "One of my favorite memories is when {name} taught me how to ride a bike. They were so patient and encouraging, even when I fell down multiple times. They never gave up on me.",
  
  "I'll never forget the time {name} surprised everyone at the family reunion with their famous chocolate cake. The whole room lit up when they walked in with it - they had such a gift for bringing joy to others.",
  
  "When I was going through a difficult time, {name} was always there to listen. They never judged, never offered unsolicited advice, just sat with me and let me know I wasn't alone. That meant everything to me.",
  
  "I remember {name}'s laugh - it was infectious! You could hear it from across the room and it would make everyone else start laughing too. They had a way of making even the most ordinary moments feel special.",
  
  "One of the things I admired most about {name} was their work ethic. They never complained, always showed up on time, and treated everyone with respect. They were a true professional and an even better person.",
  
  "I'll never forget the stories {name} used to tell about their childhood. They had such vivid memories and a way of making you feel like you were right there with them. Those stories are treasures I'll carry forever.",
  
  "When {name} became a parent, I watched them pour their whole heart into raising their children. They were patient, loving, and always put their family first. They were an amazing example of what it means to be a good parent."
];

export default function StoryTestHelper({ profileSlug, profileName, onStoriesAdded }: StoryTestHelperProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState("");

  const addSampleStories = async () => {
    setIsAdding(true);
    setMessage("");

    try {
      let successCount = 0;
      let errorCount = 0;

      for (const storyTemplate of sampleStories) {
        const story = storyTemplate.replace(/{name}/g, profileName);
        
        try {
          const response = await fetch(`/api/profiles/${profileSlug}/stories`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: story }),
          });

          if (response.ok) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
        }

        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setMessage(`Added ${successCount} sample stories successfully! ${errorCount > 0 ? `${errorCount} failed.` : ''}`);
      onStoriesAdded?.();
    } catch (error) {
      console.error("Error adding sample stories:", error);
      setMessage("Failed to add sample stories. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h4 className="text-sm font-semibold text-yellow-800 mb-2">Testing Helper</h4>
      <p className="text-sm text-yellow-700 mb-3">
        Add sample stories to test the storybook generation feature.
      </p>
      <button
        onClick={addSampleStories}
        disabled={isAdding}
        className="px-4 py-2 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAdding ? "Adding Stories..." : "Add 8 Sample Stories"}
      </button>
      {message && (
        <p className="text-sm text-yellow-700 mt-2">{message}</p>
      )}
    </div>
  );
}
