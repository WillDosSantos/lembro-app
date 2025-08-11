"use client";
import { useEffect, useState } from "react";

const DEFAULT_CHECKLIST = [
  { key: "announce", label: "Announcement & obituary drafted", done: false },
  { key: "venue", label: "Venue booked", done: false },
  { key: "program", label: "Program template selected", done: false },
  { key: "media", label: "Photo slideshow gathered", done: false },
  { key: "officiant", label: "Officiant selected", done: false },
];

export default function DIYPlanner({ slug }: { slug: string }) {
  const [goFundMeUrl, setGoFundMeUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [checklist, setChecklist] = useState(DEFAULT_CHECKLIST);

  async function save() {
    const res = await fetch(`/api/profiles/${slug}/aftercare`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goFundMeUrl, notes, checklist }),
    });
    if (!res.ok) alert("Failed to save.");
  }

  return (
    <div className="mt-6 space-y-6">
      <div>
        <label className="label">GoFundMe (optional)</label>
        <div className="flex gap-2">
          <input
            className="input input-bordered w-full"
            placeholder="https://gofund.me/..."
            value={goFundMeUrl}
            onChange={e => setGoFundMeUrl(e.target.value)}
          />
          <a className="btn" href="https://www.gofundme.com/start/medical-fundraiser" target="_blank">
            Create
          </a>
        </div>
      </div>

      <div>
        <label className="label">Notes</label>
        <textarea
          className="textarea textarea-bordered w-full min-h-28"
          placeholder="Any details you want family to see…"
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
      </div>

      <div>
        <label className="label">Checklist</label>
        <div className="space-y-2">
          {checklist.map((item, i) => (
            <label key={item.key} className="flex items-center gap-3">
              <input
                type="checkbox"
                className="checkbox"
                checked={item.done}
                onChange={() =>
                  setChecklist(cs => cs.map((c, idx) => (idx === i ? { ...c, done: !c.done } : c)))
                }
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button className="btn btn-primary" onClick={save}>Save Planner</button>
    </div>
  );
}
