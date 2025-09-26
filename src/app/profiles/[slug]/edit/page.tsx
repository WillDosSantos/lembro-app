"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ContributorManager from "@/components/ContributorManager";

interface Params {
  slug: string;
}

interface FamilyMember {
  first: string;
  last: string;
  photo?: string;
  relationship?: string;
  description?: string;
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

export default function EditProfile() {
  const { slug } = useParams() as Params;
  const { data: session } = useSession();
  const router = useRouter();
  const [deleted, setDeleted] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
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
    if (!session || deleted) return;
  
    async function fetchData() {
      const res = await fetch(`/api/profiles/${slug}?t=${Date.now()}`);
      if (!res.ok) return; // stops 404 crash
  
      const data = await res.json();
  
      const ownerStatus = data.createdBy === session?.user?.email;
      const isContributor = data.contributors?.some(
        (c: any) => c.email === session?.user?.email && c.acceptedAt && c.role === 'editor'
      );
      const canEdit = ownerStatus || isContributor;

      setIsOwner(ownerStatus);

      if (!canEdit) {
        router.push(`/profiles/${slug}`);
      } else {
        console.log("Setting form data from API:", data);
        console.log("Birth date from API:", data.birth);
        console.log("Death date from API:", data.death);
        
        setForm({
          name: data.name || "",
          birth: data.birth || "",
          death: data.death || "",
          eulogy: data.eulogy || "",
          story: data.story || "",
          cause: data.cause || "",
          photo: data.photo || "",
          family: data.family || [{ first: "", last: "" }],
          lifePhotos:
            data.lifePhotos?.map((p: LifePhoto) => ({
              ...p,
              previewUrl: p.filename ? `/uploads/${p.filename}` : "",
            })) || [{ filename: "", description: "", previewUrl: "" }],
        });
      }
    }
  
    fetchData();
  }, [slug, session, deleted]);

  const handleChange = (field: string, value: string) => {
    console.log(`Updating field ${field} to:`, value);
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      console.log("Form state after update:", updated);
      return updated;
    });
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
    
    // Don't submit if profile has been deleted
    if (deleted) {
      console.log("Profile has been deleted, skipping update");
      return;
    }
    
    console.log("Form data being submitted:", form);
    console.log("Birth date in form:", form.birth);
    console.log("Death date in form:", form.death);
    
    const res = await fetch(`/api/profiles/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    
    if (res.ok) {
      console.log("Update successful, redirecting...");
      // Force a hard refresh to ensure the updated data is loaded
      window.location.href = `/profiles/${slug}`;
    } else {
      console.error("Update failed:", res.status, res.statusText);
      alert("Failed to update profile. Please try again.");
    }
  };

  

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this profile? This action cannot be undone."
    );
    if (!confirmed) return;
  
    const res = await fetch(`/api/profiles/${slug}`, {
      method: "DELETE",
    });
  
    if (res.ok) {
      setDeleted(true);
      router.push("/deleted");
    } else {
      alert("Failed to delete profile.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-4 mt-40">
      {deleted && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 font-medium">This profile has been deleted.</p>
          <p className="text-red-700 text-sm">You will be redirected shortly.</p>
        </div>
      )}
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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Eulogy</label>
        <textarea
          value={form.eulogy}
          onChange={(e) => handleChange("eulogy", e.target.value)}
          placeholder="Share a heartfelt tribute or eulogy..."
          className="w-full border p-2 rounded h-32"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Life Story</label>
        <textarea
          value={form.story}
          onChange={(e) => handleChange("story", e.target.value)}
          placeholder="Tell their life story, memories, and experiences..."
          className="w-full border p-2 rounded h-32"
        />
      </div>
      <input
        type="text"
        value={form.cause}
        onChange={(e) => handleChange("cause", e.target.value)}
        placeholder="Cause of Death"
        className="w-full border p-2 rounded"
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Family Members</h2>
          <button
            type="button"
            onClick={() => {
              setForm({
                ...form,
                family: [...form.family, { first: "", last: "", relationship: "", description: "" }],
              });
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Family Member
          </button>
        </div>
        
        {form.family.map((member, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Family Member {index + 1}</h3>
              <button
                type="button"
                onClick={() => {
                  const updatedFamily = form.family.filter((_, i) => i !== index);
                  setForm({ ...form, family: updatedFamily });
                }}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={member.first}
                  onChange={(e) => handleFamilyChange(index, "first", e.target.value)}
                  placeholder="First Name"
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={member.last}
                  onChange={(e) => handleFamilyChange(index, "last", e.target.value)}
                  placeholder="Last Name"
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
              <select
                value={member.relationship || ""}
                onChange={(e) => handleFamilyChange(index, "relationship", e.target.value)}
                className="w-full border p-2 rounded bg-white"
              >
                <option value="">Select relationship...</option>
                <option value="Spouse">Spouse</option>
                <option value="Wife">Wife</option>
                <option value="Husband">Husband</option>
                <option value="Mother">Mother</option>
                <option value="Father">Father</option>
                <option value="Sister">Sister</option>
                <option value="Brother">Brother</option>
                <option value="Daughter">Daughter</option>
                <option value="Son">Son</option>
                <option value="Grandmother">Grandmother</option>
                <option value="Grandfather">Grandfather</option>
                <option value="Aunt">Aunt</option>
                <option value="Uncle">Uncle</option>
                <option value="Cousin">Cousin</option>
                <option value="Friend">Friend</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo (Optional)</label>
              {member.photo && (
                <div className="mb-2">
                  <img
                    src={`/uploads/${member.photo}`}
                    alt={`${member.first} ${member.last}`}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const formData = new FormData();
                  formData.append("file", file);

                  const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                  });

                  if (uploadRes.ok) {
                    const { filename } = await uploadRes.json();
                    handleFamilyChange(index, "photo", filename);
                  } else {
                    alert("Upload failed");
                  }
                }}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <textarea
                value={member.description || ""}
                onChange={(e) => handleFamilyChange(index, "description", e.target.value)}
                placeholder="Share a memory or note about this family member..."
                className="w-full border p-2 rounded h-20"
              />
            </div>
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

      {/* Contributor Management */}
      <div className="mt-8">
        <ContributorManager 
          profileSlug={slug} 
          isOwner={isOwner} 
        />
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Save Changes
      </button>
      <button
        onClick={handleDelete}
        className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Delete This Profile
      </button>
    </form>
  );
}
