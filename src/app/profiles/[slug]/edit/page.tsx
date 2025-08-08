"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface FamilyMember {
  first: string;
  last: string;
}

interface LifePhoto {
  filename: string;
  description: string;
  previewUrl?: string;
}

interface FormData {
  name: string;
  birth: string;
  death: string;
  eulogy: string;
  story: string;
  cause: string;
  family: FamilyMember[];
  lifePhotos: LifePhoto[];
  photo: string;
}

export default function EditProfile({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { data: session } = useSession();
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    name: "",
    birth: "",
    death: "",
    eulogy: "",
    story: "",
    cause: "",
    photo: "",
    family: [{ first: "", last: "" }],
    lifePhotos: [{ filename: "", description: "" }],
  });

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/profiles/${slug}`);
      const data = await res.json();
      if (data.createdBy !== session?.user?.email) {
        router.push(`/profiles/${slug}`);
      } else {
        setForm({
          name: data.name || "",
          birth: data.birth || "",
          death: data.death || "",
          eulogy: data.eulogy || "",
          story: data.story || "",
          cause: data.cause || "",
          photo: data.photo || "", // ✅ include photo from the profile
          family: data.family || [{ first: "", last: "" }],
          lifePhotos: data.lifePhotos?.map((p: LifePhoto) => ({
            ...p,
            previewUrl: p.filename ? `/uploads/${p.filename}` : "",
          })) || [{ filename: "", description: "", previewUrl: "" }],
        });
      }
    }

    if (session) {
      fetchData();
    }
  }, [slug, session]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFamilyChange = (
    index: number,
    field: keyof FamilyMember,
    value: string
  ) => {
    setForm((prev) => {
      const newFamily = [...prev.family];
      newFamily[index] = { ...newFamily[index], [field]: value };
      return { ...prev, family: newFamily };
    });
  };

  const handlePhotoChange = (
    index: number,
    field: keyof LifePhoto,
    value: string
  ) => {
    setForm((prev) => {
      const newPhotos = [...prev.lifePhotos];
      newPhotos[index] = { ...newPhotos[index], [field]: value };
      return { ...prev, lifePhotos: newPhotos };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/profiles/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push(`/profiles/${slug}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4 mt-10">
      {/* Profile Photo Preview */}
      {form.photo && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Profile Photo</h2>
          <img
            src={`/uploads/${form.photo}`}
            alt="Profile"
            className="w-48 rounded border"
          />
        </div>
      )}

      {/* Replace Profile Photo */}
      <input
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          // upload to server
          const formData = new FormData();
          formData.append("file", file);

          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (uploadRes.ok) {
            const { filename } = await uploadRes.json();
            setForm((prev) => ({ ...prev, photo: filename }));
          } else {
            alert("Upload failed");
          }
        }}
        className="mb-6"
      />

      <h1 className="text-2xl font-bold">Edit Profile</h1>
      <input
        type="text"
        value={form.name}
        onChange={(e) => handleChange("name", e.target.value)}
        placeholder="Name"
        className="w-full border p-2 rounded"
      />
      <input
        type="date"
        value={form.birth}
        onChange={(e) => handleChange("birth", e.target.value)}
        placeholder="Birth Date"
        className="w-full border p-2 rounded"
      />
      <input
        type="date"
        value={form.death}
        onChange={(e) => handleChange("death", e.target.value)}
        placeholder="Death Date"
        className="w-full border p-2 rounded"
      />
      <textarea
        value={form.eulogy}
        onChange={(e) => handleChange("eulogy", e.target.value)}
        placeholder="Eulogy"
        className="w-full border p-2 rounded"
      />
      <textarea
        value={form.story}
        onChange={(e) => handleChange("story", e.target.value)}
        placeholder="Life Story"
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        value={form.cause}
        onChange={(e) => handleChange("cause", e.target.value)}
        placeholder="Cause of Death"
        className="w-full border p-2 rounded"
      />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Family Members</h2>
        {form.family.map((member, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={member.first}
              onChange={(e) =>
                handleFamilyChange(index, "first", e.target.value)
              }
              placeholder="First Name"
              className="flex-1 border p-2 rounded"
            />
            <input
              type="text"
              value={member.last}
              onChange={(e) =>
                handleFamilyChange(index, "last", e.target.value)
              }
              placeholder="Last Name"
              className="flex-1 border p-2 rounded"
            />
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold mt-8">Life Photos</h2>
      {form.lifePhotos.map((photo, index) => (
        <div key={index} className="mb-6">
          {/* Photo Preview */}
          {photo.previewUrl && (
            <img
              src={photo.previewUrl}
              alt={`Photo ${index + 1}`}
              className="w-full max-w-md rounded shadow"
            />
          )}

          {/* Description input */}
          <input
            type="text"
            placeholder="Description"
            value={photo.description}
            onChange={(e) => {
              const updated = [...form.lifePhotos];
              updated[index].description = e.target.value;
              setForm({ ...form, lifePhotos: updated });
            }}
            className="w-full mt-2 p-2 border rounded"
          />

          {/* Replace Photo Button */}
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const previewUrl = URL.createObjectURL(file);

              const formData = new FormData();
              formData.append("file", file);

              const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: formData,
              });

              if (uploadRes.ok) {
                const { filename } = await uploadRes.json();
                const updated = [...form.lifePhotos];
                updated[index] = {
                  ...updated[index],
                  filename,
                  previewUrl, // ✅ show the preview immediately
                };
                setForm({ ...form, lifePhotos: updated });
              } else {
                alert("Failed to upload image.");
              }
            }}
            className="mt-2"
          />

          {/* Remove Photo Button */}
          <button
            type="button"
            onClick={() => {
              const updated = form.lifePhotos.filter((_, i) => i !== index);
              setForm({ ...form, lifePhotos: updated });
            }}
            className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
          >
            Remove Photo
          </button>
        </div>
      ))}

      {/* Add New Photo Slot */}
      <button
        type="button"
        onClick={() =>
          setForm({
            ...form,
            lifePhotos: [...form.lifePhotos, { filename: "", description: "" }],
          })
        }
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        + Add Photo
      </button>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Save Changes
      </button>
    </form>
  );
}
