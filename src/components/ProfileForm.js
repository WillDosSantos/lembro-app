'use client';

import { useState } from 'react';

export default function ProfileForm() {
  const [form, setForm] = useState({ name: '', bio: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('bio', form.bio);
    if (photoFile) formData.append('photo', photoFile);

    const res = await fetch('/api/profiles', {
      method: 'POST',
      body: formData,
    });

    const result = await res.json();
    console.log('Saved profile:', result);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        required
        className="border p-2 w-full"
      />
      <textarea
        name="bio"
        placeholder="Life Story"
        value={form.bio}
        onChange={handleChange}
        className="border p-2 w-full"
        rows="4"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setPhotoFile(e.target.files[0])}
        className="border p-2 w-full"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Create Profile'}
      </button>
    </form>
  );
}
