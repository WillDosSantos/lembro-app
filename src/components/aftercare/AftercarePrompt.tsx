
"use client";
import Link from "next/link";
import { useState } from "react";

export default function AftercarePrompt({ slug }: { slug: string }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="mt-8 rounded-2xl border p-6 bg-base-100/60">
      <h3 className="text-xl font-semibold">Need any help planning?</h3>
      <p className="text-sm mt-1 text-base-content/70">
        We can guide you through DIY steps or connect you with trusted local providers.
      </p>
      <div className="mt-4 flex gap-3">
        <Link
          href={`/profiles/${slug}/aftercare?tab=diy`}
          className="btn btn-primary rounded-xl"
        >
          I’ll do it myself
        </Link>
        <Link
          href={`/profiles/${slug}/aftercare?tab=browse`}
          className="btn btn-outline rounded-xl"
        >
          Browse providers
        </Link>
        <button
          className="btn btn-ghost ml-auto"
          onClick={() => {
            // Optional: call API to persist 'aftercarePromptDismissed = true'
            setDismissed(true);
          }}
        >
          No thanks
        </button>
      </div>
      <p className="text-xs mt-2 text-base-content/60">
        Some listings are sponsored. We never sell your data.
      </p>
    </div>
  );
}
