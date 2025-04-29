"use client";

import { useState } from "react";
import Popup from "@/components/Popup";

type LoanPopupProps = {
  item: {
    item_id: number;
    title: string;
    quantity_available: number;
  };
  accountId: number;
  onClose: () => void;
  onLoanSuccess: () => void;
};

export default function MakeLoanPopup({
  item,
  accountId,
  onClose,
  onLoanSuccess,
}: LoanPopupProps) {
  const [loanOutDate, setLoanOutDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const handleLoan = async () => {
    if (!loanOutDate || !dueDate) {
      setError("Please select both loan out date and due date.");
      return;
    }

    const payload = {
      item_id: item.item_id,
      account_id: accountId,
      loan_out_date: loanOutDate,
      due_date: dueDate,
    };

    console.log("Sending payload:", payload);

    try {
      const res = await fetch(`/api/loans?account_id=${accountId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        console.error("API Error:", data);
        throw new Error(data.error || "Failed to create loan.");
      }

      onLoanSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError("An error occurred while creating the loan.");
    }
  };

  if (item.quantity_available === 0) {
    return (
      <Popup title="Item Unavailable" onClose={onClose}>
        <p className="text-gray-700 mb-4">
          Sorry, this item is currently unavailable for loan.
        </p>
        <button
          onClick={onClose}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Close
        </button>
      </Popup>
    );
  }

  return (
    <Popup title={`Loan Item: ${item.title}`} onClose={onClose}>
      <div className="mb-4">
        <label className="block font-medium mb-2">Loan Out Date:</label>
        <input
          type="date"
          value={loanOutDate}
          onChange={(e) => setLoanOutDate(e.target.value)}
          className="border px-4 py-2 rounded w-full"
          min={today}
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-2">Due Date:</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="border px-4 py-2 rounded w-full"
          min={today}
        />
      </div>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div className="flex justify-end space-x-4">
        <button
          onClick={onClose}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
        <button
          onClick={handleLoan}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Confirm Loan
        </button>
      </div>
    </Popup>
  );
}