'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [cardNumber, setCardNumber] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    setError('');

    const res = await fetch('/api/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardNumber }),
    });

    const data: { valid: boolean } = await res.json();

    if (data.valid) {
      router.push(`/account?card=${cardNumber}`);
    } else {
      setError('Invalid card number. Please try again.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // prevent default form refresh
    handleLogin();
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-white px-4">
      <h1 className="text-3xl font-bold mb-2">Library Website <span className="text-purple-600">Team Orchid</span></h1>
      <p className="text-gray-600 mb-6">We did a library database</p>

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Enter library card number"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)} 
          className="border border-gray-400 px-4 py-2 rounded w-72"
        />
        <button
          type="submit"
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          Log In
        </button>
      </form>

      {error && <p className="mt-4 text-red-600">{error}</p>}
    </main>
  );
}
