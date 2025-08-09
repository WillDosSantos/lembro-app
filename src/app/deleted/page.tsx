import Link from "next/link";

export default function DeletedPage() {
  return (
    <div className="max-w-xl mx-auto mt-20 text-center px-4">
      <Link
        href="/"
        className="inline-block mt-6 bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900"
      >
        Return to Home
      </Link>
      <h1 className="text-3xl font-bold mb-4 text-red-700">Memorial Removed</h1>
      <p className="text-lg text-gray-700">
        This memorial has been removed and the contents have been deleted.
      </p>
    </div>
  );
}
