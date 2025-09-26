'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const newUser = { id: Date.now().toString(), email, password, name: email };
    const res = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(newUser),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      router.push('/login');
    } else {
      setError('Failed to sign up');
    }
  };

  return (
    <div className="pt-24">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-8 space-y-4">
        <h1 className="text-2xl font-bold">Sign Up</h1>
      
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <input
        className="w-full border p-2"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        className="w-full border p-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <input
        className="w-full border p-2"
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Sign Up
      </button>
      </form>
    </div>
  );
}
