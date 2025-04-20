'use client';

import { useState } from 'react';

export default function HomePage() {
  const [cardNumber, setCardNumber] = useState('');

  const handleLogin = () => {
    // for now, just log it — later you can hit an API
    console.log('Library Card Number:', cardNumber);
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-white px-4">
      <h1 className="text-3xl font-bold mb-2">Library Website <span className="text-purple-600">Team Orchid</span></h1>
      <p className="text-gray-600 mb-6">We did a library database</p>

      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Enter library card number"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          className="border border-gray-400 px-4 py-2 rounded w-72"
        />
        <button
          onClick={handleLogin}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          Log In
        </button>
      </div>
    </main>
  );
}
