"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navigator from "@/components/Navigator";

export default function HomePage() {
  const [user, setUser] = useState<{
    first_name: string;
    last_name: string;
    card_number: string;
  } | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  const handleLogin = async () => {
    setError("");

    const res = await fetch("/api/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardNumber }),
    });

    const data: {
      valid: boolean;
      user?: { first_name: string; last_name: string };
    } = await res.json();

    if (data.valid && data.user) {
      // Save first name, last name, and card number
      localStorage.setItem(
        "user",
        JSON.stringify({
          first_name: data.user.first_name,
          last_name: data.user.last_name,
          card_number: cardNumber,
        })
      );
      router.push(`/account?card=${cardNumber}`);
    } else {
      setError("Invalid card number. Please try again.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // prevent default form refresh
    handleLogin();
  };

  return (
    <main className="text-black">
      <Navigator user={user} setUser={setUser} />
      <div className="flex flex-col items-center justify-center h-[150vh] bg-white px-4 -mt-72">
        <h1 className="text-6xl font-bold text-violet-800">
          Orchid Library
        </h1>
        <p className="text-lg text-gray-600 mb-6 mt-0">Welcome to the library!</p>

        {user ? (
          <div className="flex flex-col items-center gap-4 mt-4">
            <h2 className="text-4xl font-semibold">
              Hello, <span className="text-violet-700">{user.first_name} {user.last_name}!</span>
            </h2>
            <div className="flex gap-4">
              <button
                onClick={() => router.push(`/account?card=${user.card_number}`)}
                className="bg-violet-800 text-white px-4 py-2 rounded hover:bg-purple-500 transition"
              >
                Go to My Account
              </button>
            </div>
          </div>
        ) : (
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
        )}

        {error && <p className="mt-4 text-red-600">{error}</p>}
      </div>
    </main>
  );
}
