"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FamilyMember {
  first: string;
  last: string;
}

interface FormData {
  name: string;
  slug: string;
  birth: string;
  death: string;
  eulogy: string;
  story: string;
  cause: string;
}

export default function CreateProfilePage() {
  const { status, data: session } = useSession();
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    name: "",
    slug: "",
    birth: "",
    death: "",
    eulogy: "",
    story: "",
    cause: "",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [family, setFamily] = useState<FamilyMember[]>([
    { first: "", last: "" },
  ]);
  const [formStatus, setFormStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [lifePhotos, setLifePhotos] = useState<
    { file: File | null; description: string }[]
  >([{ file: null, description: "" }]);

  const addLifePhoto = () => {
    if (lifePhotos.length >= 10) return;
    setLifePhotos([...lifePhotos, { file: null, description: "" }]);
  };

  const handleLifePhotoChange = (index: number, file: File | null) => {
    const updated = [...lifePhotos];
    updated[index].file = file;
    setLifePhotos(updated);
  };

  const handleLifeDescriptionChange = (index: number, desc: string) => {
    const updated = [...lifePhotos];
    updated[index].description = desc;
    setLifePhotos(updated);
  };

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-gray-600 animate-pulse">
          Checking authentication…
        </p>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear error message when user starts typing
    if (errorMessage) setErrorMessage("");
  };

  const handleFamilyChange = (
    index: number,
    field: keyof FamilyMember,
    value: string
  ) => {
    const updated = [...family];
    updated[index] = { ...updated[index], [field]: value };
    setFamily(updated);
  };

  const addFamilyMember = () => {
    setFamily([...family, { first: "", last: "" }]);
  };

  const removeFamilyMember = (index: number) => {
    setFamily(family.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    if (!form.name.trim()) {
      setErrorMessage("Name is required");
      return false;
    }
    if (!form.slug.trim()) {
      setErrorMessage("URL slug is required");
      return false;
    }
    if (!/^[a-z0-9-]+$/.test(form.slug)) {
      setErrorMessage(
        "URL slug can only contain lowercase letters, numbers, and hyphens"
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    setFormStatus("loading");
    setErrorMessage("");
  
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (photoFile) formData.append("photo", photoFile);
    formData.append("family", JSON.stringify(family));
  
    // 👇 Add life photo metadata and files BEFORE fetch
    formData.append(
      "lifePhotos",
      JSON.stringify(lifePhotos.map((photo, i) => ({
        filename: photo.file.name,
        description: photo.description,
      })))
    );
  
    lifePhotos.forEach((photo, i) => {
      formData.append(`lifePhoto_${i}`, photo.file);
    });
  
    // Add createdBy if user is logged in
    if (session?.user?.email) {
      formData.append("createdBy", session.user.email);
    }
  
    try {
      const res = await fetch("/api/profiles", {
        method: "POST",
        body: formData,
      });
  
      if (!res.ok) {
        const error = await res
          .json()
          .catch(() => ({ message: "Something went wrong" }));
        throw new Error(error.message || "Failed to create memorial");
      }
  
      const data = await res.json();
      setFormStatus("success");
  
      setTimeout(() => {
        router.push(`/profiles/${data.slug}`);
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong"
      );
      setFormStatus("error");
    }
  };

  // Success Screen
  if (formStatus === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-gray-800">
        <div className="backdrop-blur-lg p-10 rounded-lg shadow-xl max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-4">Memorial Created</h1>
          <p className="text-md text-gray-700 mb-6">
            Thank you for honoring the life of your loved one. Their memory
            lives on.
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Redirecting to the memorial page...
          </p>
          <Link
            href="/"
            className="inline-block px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  // Loading State
  if (formStatus === "loading") {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-gray-600 animate-pulse">
          Creating Memorial...
        </p>
      </div>
    );
  }

  // Form View
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create a Memorial</h1>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Custom URL
          </label>
          <input
            id="slug"
            name="slug"
            placeholder="e.g. john-smith"
            className="w-full border p-2 rounded"
            onChange={handleChange}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Use only lowercase letters, numbers, and hyphens
          </p>
        </div>

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name
          </label>
          <input
            id="name"
            name="name"
            placeholder="Full Name"
            className="w-full border p-2 rounded"
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="birth"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Birth Date
            </label>
            <input
              id="birth"
              name="birth"
              type="date"
              className="w-full border p-2 rounded"
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor="death"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Death Date
            </label>
            <input
              id="death"
              name="death"
              type="date"
              className="w-full border p-2 rounded"
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="eulogy"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Eulogy
          </label>
          <textarea
            id="eulogy"
            name="eulogy"
            placeholder="Share your heartfelt words..."
            rows={3}
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="story"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Life Story
          </label>
          <textarea
            id="story"
            name="story"
            placeholder="Share their life story..."
            rows={5}
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />
          <div>
            <h2 className="font-semibold mt-4">Life Story Photos</h2>
            {lifePhotos.map((item, index) => (
              <div key={index} className="space-y-2 mt-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleLifePhotoChange(index, e.target.files?.[0] || null)
                  }
                />
                <textarea
                  placeholder="Photo description"
                  className="w-full border p-2"
                  value={item.description}
                  onChange={(e) =>
                    handleLifeDescriptionChange(index, e.target.value)
                  }
                />
              </div>
            ))}
            {lifePhotos.length < 10 && (
              <button
                type="button"
                onClick={addLifePhoto}
                className="text-sm text-blue-600 mt-2"
              >
                + Add Another Photo
              </button>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="cause"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Cause of Death
          </label>
          <input
            id="cause"
            name="cause"
            placeholder="Cause of Death"
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="photo"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Photo
          </label>
          <input
            id="photo"
            type="file"
            accept="image/*"
            className="w-full border p-2 rounded"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                if (file.size > 5 * 1024 * 1024) {
                  // 5MB limit
                  setErrorMessage("Photo must be less than 5MB");
                  return;
                }
                setPhotoFile(file);
              }
            }}
          />
          <p className="text-xs text-gray-500 mt-1">
            Maximum file size: 5MB. Supported formats: JPG, PNG, GIF
          </p>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Family Members
            </label>
            <button
              type="button"
              onClick={addFamilyMember}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              + Add Family Member
            </button>
          </div>

          {family.map((member, index) => (
            <div key={index} className="flex gap-2 mt-2">
              <input
                placeholder="First Name"
                className="flex-1 border p-2 rounded"
                value={member.first}
                onChange={(e) =>
                  handleFamilyChange(index, "first", e.target.value)
                }
              />
              <div className="flex gap-2 flex-1">
                <input
                  placeholder="Last Name"
                  className="flex-1 border p-2 rounded"
                  value={member.last}
                  onChange={(e) =>
                    handleFamilyChange(index, "last", e.target.value)
                  }
                />
                {family.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFamilyMember(index)}
                    className="text-red-600 hover:text-red-800 px-2"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={formStatus === "loading"}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formStatus === "loading" ? "Creating..." : "Create Memorial"}
          </button>
        </div>
      </form>
    </div>
  );
}
