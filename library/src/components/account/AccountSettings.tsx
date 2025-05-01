"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Account } from "@/types/account";
import { Dispatch, SetStateAction } from "react";

type AccountSettingsProps = {
  user: Account;
  setUser: Dispatch<SetStateAction<Account | null>>;
};

export default function AccountSettings({ user, setUser }: AccountSettingsProps) {
  const [address, setAddress] = useState(user.address ?? "");
  const [phone, setPhone] = useState(user.phone_number ?? "");
  const [name, setName] = useState(`${user.first_name} ${user.last_name}`);
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  const handleUpdate = async () => {
    const [first_name, last_name] = name.trim().split(" ");
    const res = await fetch("/api/user/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        account_id: user.account_id,
        address,
        phone_number: phone,
        first_name: first_name ?? user.first_name,
        last_name: last_name ?? user.last_name,
      }),
    });

    if (res.ok) {
      const updatedUser: Account = {
        ...user,
        address,
        phone_number: phone,
        first_name: first_name ?? user.first_name,
        last_name: last_name ?? user.last_name,
      };
      setUser(updatedUser);
      console.log("User updated successfully");
    } else {
      console.error("Failed to update user");
    }
  };

  const handleDelete = async () => {
    const res = await fetch("/api/user/update", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ account_id: user.account_id }),
    });

    if (res.ok) {
      // Clear local storage
      localStorage.clear();
      setUser(null);
      router.push("/");
    } else {
      console.error("Failed to delete account");
    }

    setShowPopup(false);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
      <p><strong>Library Card Number:</strong> {user.card_number}</p>

      <div className="mt-4">
        <p className="font-semibold mb-2">Update Contact Info:</p>
        <div className="space-y-2">
          <div>
            <label className="font-bold">Address: </label>
            <input
              type="text"
              className="border p-1 w-full"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div>
            <label className="font-bold">Phone number: </label>
            <input
              type="text"
              className="border p-1 w-full"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <label className="font-bold">Name: </label>
            <input
              type="text"
              className="border p-1 w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 font-bold" onClick={handleUpdate}>Save Changes</button>
        </div>
      </div>

      <div className="mt-6">
        <button className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-600 mt-8 font-bold" onClick={() => setShowPopup(true)}>
          Delete Account
        </button>

        {showPopup && (
          <div className="mt-4 p-4 border rounded bg-white shadow-md">
            <p className="mb-2">Are you sure you want to delete your account?</p>
            <div className="space-x-2">
              <button className="bg-red-600 text-white px-4 py-1 rounded" onClick={handleDelete}>Yes</button>
              <button className="bg-gray-700 text-white px-4 py-1 rounded" onClick={() => setShowPopup(false)}>No</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
