"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navigator from "@/components/Navigator";
import LoanHistory from "@/components/account/LoanHistory";
import Reservations from '@/components/account/Reservations';

type View = "details" | "history" | "reservations" | "settings";

type Account = {
  account_id: number;
  first_name: string;
  last_name: string;
  middle_initial: string | null;
  card_number: string;
  account_type_id: number;
  restricted: boolean;
  address: string | null;
  birthdate: string;
  email: string;
  phone_number: string | null;
  parent_id: number | null;
};

export default function AccountPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [view, setView] = useState<View>("details");
  const [user, setUser] = useState<Account | null>(null);

  useEffect(() => {
    const card = searchParams?.get("card") ?? null;
    if (!card) {
      router.push("/");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user?card=${card}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        } else {
          console.error("User not found");
          router.push("/");
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
        router.push("/");
      }
    };

    fetchUser();
  }, [searchParams, router]);

  if (!user) return null;

  return (
    <>
      <Navigator />
      <div className="flex h-screen text-black">
        {/* Sidebar */}
        <aside className="w-1/4 border-r p-4 bg-gray-50 space-y-4">
          <button
            onClick={() => setView("details")}
            className="w-full text-left px-4 py-2 border rounded hover:bg-purple-100"
          >
            Account Details
          </button>
          <button
            onClick={() => setView("history")}
            className="w-full text-left px-4 py-2 border rounded hover:bg-purple-100"
          >
            Loan History
          </button>
          <button
            onClick={() => setView("reservations")}
            className="w-full text-left px-4 py-2 border rounded hover:bg-purple-100"
          >
            Reservations
          </button>
          <button
            onClick={() => setView("settings")}
            className="w-full text-left px-4 py-2 border rounded hover:bg-purple-100"
          >
            Account Settings
          </button>
        </aside>

        {/* Main Content */}
        <main className="w-3/4 p-6 border bg-white text-black">
          {/* Details about account holder. */}
          {view === "details" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Account Details</h2>
              <p>
                <strong>Account ID:</strong> {user.account_id}
              </p>
              <p>
                <strong>Name:</strong> {user.first_name}{" "}
                {user.middle_initial ? user.middle_initial + "." : ""}{" "}
                {user.last_name}
              </p>
              <p>
                <strong>Library Card Number:</strong> {user.card_number}
              </p>
              <p>
                <strong>Birthdate:</strong> {user.birthdate}
              </p>
              <p>
                <strong>Restricted:</strong> {user.restricted ? "Yes" : "No"}
              </p>
              <p>
                <strong>Contact Info:</strong>
              </p>
              <ul className="ml-4 list-disc">
                <li>Email: {user.email}</li>
                {user.phone_number && <li>Phone: {user.phone_number}</li>}
                {user.address && <li>Address: {user.address}</li>}
              </ul>
            </div>
          )}

          {/* History of Loans & Reservations*/}
          {view === 'history' && <LoanHistory accountId={user.account_id} />}

          {view === 'reservations' && <Reservations accountId={user.account_id} />}


          {/* Account Settings */}
          {view === "settings" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
              <p>Update your preferences here.</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
