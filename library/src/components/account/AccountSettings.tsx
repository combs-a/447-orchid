"use client";

import { useState } from "react";

import type { Account } from "@/types/account";



export default function AccountSettings({ user }: Account) {
  const [address, setAddress] = useState(user.address ?? "");
  const [phone, setPhone] = useState(user.phone_number ?? "");
  const [name, setName] = useState(`${user.first_name} ${user.last_name}`);
  const [showPopup, setShowPopup] = useState(false);

  const handleUpdate = () => {
    // TODO: Add logic to update user info (API call or form submission)
    console.log("Updated Info:", { address, phone, name });
  };

  const handleDelete = () => {
    // TODO: Add logic to delete account
    console.log("Account Deleted");
    setShowPopup(false);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
      <p><strong>Account ID:</strong> {user.account_id}</p>
      <p><strong>Library Card Number:</strong> {user.card_number}</p>

      <div className="mt-4">
        <p className="font-semibold mb-2">Update Contact Info:</p>
        <div className="space-y-2">
          <div>
            <label>Address: </label>
            <input
              type="text"
              className="border p-1"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div>
            <label>Phone number: </label>
            <input
              type="text"
              className="border p-1"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <label>Name: </label>
            <input
              type="text"
              className="border p-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <button onClick={handleUpdate}>Save Changes</button>
        </div>
      </div>

      <div className="mt-6">
        <button className="bg-red-600" onClick={() => setShowPopup(true)}>
          Delete Account
        </button>

        {showPopup && (
          <div className="mt-4 p-4 border rounded bg-white shadow-md">
            <p className="mb-2">Are you sure you want to delete your account?</p>
            <div className="space-x-2">
              <button className="bg-red-600" onClick={handleDelete}>Yes</button>
              <button className="bg-gray-700" onClick={() => setShowPopup(false)}>No</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
