"use client";
import { useState } from "react";

export default function ProviderCard({ provider, profileSlug }: { provider: any; profileSlug: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border p-4 bg-base-100">
      <div className="flex items-center gap-3">
        {provider.logoUrl ? (
          <img src={provider.logoUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-base-200" />
        )}
        <div className="flex-1">
          <div className="font-semibold">{provider.name}</div>
          <div className="text-xs opacity-70 capitalize">{provider.categories.join(" · ").replaceAll("_", " ")}</div>
        </div>
        {provider.tier !== "free" && (
          <span className="badge badge-warning text-xs">Sponsored</span>
        )}
      </div>

      {provider.blurb && <p className="mt-3 text-sm">{provider.blurb}</p>}

      <div className="mt-4 flex gap-2">
        {provider.website && (
          <a className="btn btn-sm btn-outline" href={provider.website} target="_blank">
            Visit site
          </a>
        )}
        <button className="btn btn-sm btn-primary" onClick={() => setOpen(true)}>
          Contact
        </button>
      </div>

      {open && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-semibold">Contact {provider.name}</h3>
            <LeadForm
              providerId={provider.id}
              profileSlug={profileSlug}
              onClose={() => setOpen(false)}
            />
          </div>
          <form method="dialog" className="modal-backdrop" onClick={() => setOpen(false)}>
            <button>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
}

function LeadForm({
  providerId,
  profileSlug,
  onClose,
}: {
  providerId: string;
  profileSlug: string;
  onClose: () => void;
}) {
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      providerId,
      profileId: profileSlug,
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      message: fd.get("message"),
    };
    const res = await fetch("/api/leads", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) onClose();
    else alert("Failed to send. Please try again.");
  }

  return (
    <form className="space-y-3 mt-3" onSubmit={submit}>
      <input name="name" className="input input-bordered w-full" placeholder="Your name" required />
      <input name="email" type="email" className="input input-bordered w-full" placeholder="Email" required />
      <input name="phone" className="input input-bordered w-full" placeholder="Phone (optional)" />
      <textarea name="message" className="textarea textarea-bordered w-full" placeholder="What do you need?" />
      <button className="btn btn-primary w-full" type="submit">Send</button>
      <p className="text-xs opacity-70">We’ll share this info only with this provider.</p>
    </form>
  );
}
