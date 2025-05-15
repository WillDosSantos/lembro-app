import Link from 'next/link';

export default function ProfileCard({ profile }) {
  const { slug, name, bio, photo } = profile;

  return (
    <div className="border rounded-lg shadow-md p-4 hover:shadow-lg transition">
      <img
        src={`/uploads/${photo}`}
        alt={name}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h2 className="text-xl font-semibold">{name}</h2>
      <p className="text-gray-600 text-sm mt-2 line-clamp-3">{bio}</p>
      <Link href={`/profiles/${slug}`}>
        <button className="mt-4 text-blue-600 hover:underline">
          View Profile →
        </button>
      </Link>
    </div>
  );
}
