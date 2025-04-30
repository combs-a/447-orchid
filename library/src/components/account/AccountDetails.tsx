"use client";

import { Account } from "@/types/account";

export default function AccountDetails({ user }: { user: Account }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Account Details</h2>
      <p>
        <strong>Name:</strong> {user.first_name}{" "}
        {user.middle_initial ? user.middle_initial + "." : ""}{" "}
        {user.last_name}
      </p>
      <p>
        <strong>Library Card Number:</strong> {user.card_number}
      </p>
      <p>
        <strong>Birthdate:</strong> {user.birthdate.slice(0, 10)}
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
  );
}
