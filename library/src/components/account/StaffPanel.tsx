"use client";

import { useState } from "react";
import { Account } from "@/types/account";

import { itemTypeIds, genreIds, contributionRoleIds, ratingIds, booleanIds } from "@/components/account/picklists";

type Loan = {
  loan_id: number;
  item_id: number;
  title: string;
  loan_out_date: string;
  due_date: string;
  return_date: string | null;
};

type Reservation = {
  reservation_id: number;
  item_id: number;
  title: string;
  reservation_date: string;
  reservation_end_date: string;
};

type ItemForm = {
  title: string;
  description: string;
  item_type_id: string;
  genre_id: string;
  ISBN: string;
  publication_year: string;
  publication_date: string;
  publisher: string;
  issue_number: string;
  explicit: string;
  rating_id: string;
  total_quantity: string;
  quantity_available: string;
  reservation_amount: string;

  contributor_first_name: string;
  contributor_last_name: string;
  contributor_middle_initial: string;
  contribution_role_id: string;
};

export default function StaffPanel() {
  const [cardQuery, setCardQuery] = useState("");
  const [accountResult, setAccountResult] = useState<
    Account | { error: string } | null
  >(null);

  const [itemForm, setItemForm] = useState<ItemForm>({
    title: "",
    description: "",
    item_type_id: "1",
    genre_id: "1",
    ISBN: "",
    publication_year: "",
    publication_date: "",
    publisher: "",
    issue_number: "",
    explicit: "0",
    rating_id: "1",
    total_quantity: "1",
    quantity_available: "1",
    reservation_amount: "0",
    contributor_first_name: "",
    contributor_last_name: "",
    contributor_middle_initial: "",
    contribution_role_id: "",
  });

  const [loans, setLoans] = useState<Loan[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const queryAccount = async () => {
    const res = await fetch(`/api/staff/account-lookup?card=${cardQuery}`);
    const data = await res.json();

    if (res.ok) {
      setAccountResult(data);

      // fetch loans + reservations after valid account is found
      const [resReservations, resLoans] = await Promise.all([
        fetch(`/api/staff/reservations?account_id=${data.account_id}`),
        fetch(`/api/staff/loans?account_id=${data.account_id}`),
      ]);
      const [reservationData, loanData] = await Promise.all([
        resReservations.json(),
        resLoans.json(),
      ]);
      setReservations(reservationData || []);
      setLoans(loanData || []);
    } else {
      setAccountResult({ error: "Not found" });
      setReservations([]);
      setLoans([]);
    }
  };

  const uploadItem = async () => {
    const res = await fetch("/api/staff/item-upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(itemForm),
    });
    if (res.ok) alert("Item uploaded!");
    else alert("Upload failed");
  };

  return (
    <div className="space-y-6 h-[200vh] overflow-auto">
      <h1 className="text-xl font-bold mb-4">Staff Management</h1>
      <div className="border rounded shadow p-6">
        {/* Account Lookup */}
        <section>
          <h3 className="text-lg font-bold mb-2 underline">Account Lookup</h3>
          <input
            placeholder="Enter card number"
            value={cardQuery}
            onChange={(e) => setCardQuery(e.target.value)}
            className="border p-1 mr-2"
          />
          <button
            onClick={queryAccount}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded font-bold"
          >
            Search
          </button>

          {/* When account is found, show account info */}
          {accountResult && "error" in accountResult ? (
            <p className="mt-2 text-red-600 font-semibold">
              {accountResult.error}
            </p>
          ) : accountResult ? (
            <div className="mt-4 bg-white shadow rounded p-4 space-y-2">
              <h4 className="text-lg font-bold mb-2">Account Info</h4>
              <div className="grid grid-cols-2 gap-2">
                <p>
                  <span className="font-semibold">Name:</span>{" "}
                  {accountResult.first_name}{" "}
                  {accountResult.middle_initial
                    ? accountResult.middle_initial + "."
                    : ""}{" "}
                  {accountResult.last_name}
                </p>
                <p>
                  <span className="font-semibold">Card #:</span>{" "}
                  {accountResult.card_number}
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {accountResult.email}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span>{" "}
                  {accountResult.phone_number || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Address:</span>{" "}
                  {accountResult.address || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Birthdate:</span>{" "}
                  {accountResult.birthdate?.slice(0, 10)}
                </p>
                <p>
                  <span className="font-semibold">Account Type:</span>{" "}
                  {accountResult.account_type_id}
                </p>
                <p>
                  <span className="font-semibold">Restricted:</span>{" "}
                  {accountResult.restricted ? "Yes" : "No"}
                </p>
              </div>
            </div>
          ) : null}
        </section>
        {/* Show their loans */}
        {accountResult && !("error" in accountResult) && (
          <section>
            <h3 className="text-lg font-bold mb-2 mt-4">Loans</h3>
            {loans.length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                No loans found for this user.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border text-sm">
                  <thead>
                    <tr>
                      <th className="border px-2 py-1">Loan ID</th>
                      <th className="border px-2 py-1">Item ID</th>
                      <th className="border px-2 py-1">Title</th>
                      <th className="border px-2 py-1">Loan Out</th>
                      <th className="border px-2 py-1">Due Date</th>
                      <th className="border px-2 py-1">Returned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loans.map((loan) => (
                      <tr key={loan.loan_id}>
                        <td className="border px-2 py-1">{loan.loan_id}</td>
                        <td className="border px-2 py-1">{loan.item_id}</td>
                        <td className="border px-2 py-1">{loan.title}</td>
                        <td className="border px-2 py-1">
                          {loan.loan_out_date.slice(0, 10)}
                        </td>
                        <td className="border px-2 py-1">
                          {loan.due_date.slice(0, 10)}
                        </td>
                        <td className="border px-2 py-1">
                          {loan.return_date ?? "Not returned"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* Show their reservations */}
        {accountResult && !("error" in accountResult) && (
          <section>
            <h3 className="text-lg font-bold mb-2 mt-6">Reservations</h3>
            {reservations.length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                No reservations found for this user.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border text-sm">
                  <thead>
                    <tr>
                      <th className="border px-2 py-1">Reservation ID</th>
                      <th className="border px-2 py-1">Item ID</th>
                      <th className="border px-2 py-1">Title</th>
                      <th className="border px-2 py-1">Start Date</th>
                      <th className="border px-2 py-1">End Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((r) => (
                      <tr key={r.reservation_id}>
                        <td className="border px-2 py-1">{r.reservation_id}</td>
                        <td className="border px-2 py-1">{r.item_id}</td>
                        <td className="border px-2 py-1">{r.title}</td>
                        <td className="border px-2 py-1">
                          {r.reservation_date.slice(0, 10)}
                        </td>
                        <td className="border px-2 py-1">
                          {r.reservation_end_date.slice(0, 10)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </div>
      <hr /> {/* Divider */}
      {/* Upload a new item */}
      <section className="border rounded shadow p-6">
        <h3 className="text-lg font-bold mb-4 underline">Upload New Item</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-semibold">Title</label>
            <input
              type="text"
              value={itemForm.title}
              onChange={(e) =>
                setItemForm({ ...itemForm, title: e.target.value })
              }
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Description</label>
            <input
              type="text"
              value={itemForm.description}
              onChange={(e) =>
                setItemForm({ ...itemForm, description: e.target.value })
              }
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Item Type</label>
            <select
              value={itemForm.item_type_id}
              onChange={(e) =>
                setItemForm({ ...itemForm, item_type_id: e.target.value })
              }
              className="border p-2 w-full rounded"
            >
              {itemTypeIds.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold">Genre</label>
            <select
              value={itemForm.genre_id}
              onChange={(e) =>
                setItemForm({ ...itemForm, genre_id: e.target.value })
              }
              className="border p-2 w-full rounded"
            >
              {genreIds.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold">ISBN</label>
            <input
              type="text"
              value={itemForm.ISBN}
              onChange={(e) =>
                setItemForm({ ...itemForm, ISBN: e.target.value })
              }
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Publication Year</label>
            <input
              type="text"
              value={itemForm.publication_year}
              onChange={(e) =>
                setItemForm({ ...itemForm, publication_year: e.target.value })
              }
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Publication Date</label>
            <input
              type="date"
              value={itemForm.publication_date}
              onChange={(e) =>
                setItemForm({ ...itemForm, publication_date: e.target.value })
              }
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Publisher</label>
            <input
              type="text"
              value={itemForm.publisher}
              onChange={(e) =>
                setItemForm({ ...itemForm, publisher: e.target.value })
              }
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Issue Number</label>
            <input
              type="text"
              value={itemForm.issue_number}
              onChange={(e) =>
                setItemForm({ ...itemForm, issue_number: e.target.value })
              }
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Creator First Name</label>
            <input
              type="text"
              value={itemForm.contributor_first_name}
              onChange={(e) =>
                setItemForm({ ...itemForm, contributor_first_name: e.target.value })
              }
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Creator Last Name</label>
            <input
              type="text"
              value={itemForm.contributor_last_name}
              onChange={(e) =>
                setItemForm({ ...itemForm, contributor_last_name: e.target.value })
              }
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Creator Role</label>
            <select
              value={itemForm.contribution_role_id}
              onChange={(e) =>
                setItemForm({ ...itemForm, contribution_role_id: e.target.value })
              }
              className="border p-2 w-full rounded"
            >
              {contributionRoleIds.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold">
              Explicit
            </label>
            <select
              value={itemForm.explicit}
              onChange={(e) =>
                setItemForm({ ...itemForm, explicit: e.target.value })
              }
              className="border p-2 w-full rounded"
            >
              {booleanIds.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold">Rating ID</label>
            <select
              value={itemForm.rating_id}
              onChange={(e) =>
                setItemForm({ ...itemForm, rating_id: e.target.value })
              }
              className="border p-2 w-full rounded"
            >
              {ratingIds.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold">Total Quantity</label>
            <input
              type="text"
              value={itemForm.total_quantity}
              onChange={(e) =>
                setItemForm({ ...itemForm, total_quantity: e.target.value })
              }
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">
              Quantity Available
            </label>
            <input
              type="text"
              value={itemForm.quantity_available}
              onChange={(e) =>
                setItemForm({ ...itemForm, quantity_available: e.target.value })
              }
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">
              Reservation Amount
            </label>
            <input
              type="text"
              value={itemForm.reservation_amount}
              onChange={(e) =>
                setItemForm({ ...itemForm, reservation_amount: e.target.value })
              }
              className="border p-2 w-full rounded"
            />
          </div>
        </div>
        <button
          onClick={uploadItem}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold w-full"
        >
          Upload Item
        </button>
      </section>
    </div>
  );
}
