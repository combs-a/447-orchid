"use client";
import { useState } from "react";
import Popup from "@/components/Popup";

type ReservationPopupProps = {
  item: {
    item_id: number;
    title: string;
  };
  accountId: number;
  onClose: () => void;
  onReservationSuccess: () => void;
  earliestLoanDueDate: string | null;
};

export default function MakeReservationPopup({
  item,
  accountId,
  onClose,
  onReservationSuccess,
  earliestLoanDueDate,
}: ReservationPopupProps) {
  const [reservationDate, setReservationDate] = useState("");
  const [reservationEndDate, setReservationEndDate] = useState("");
  const [error, setError] = useState("");

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];
  // Extract date portion from earliestLoanDueDate if available
  const formattedEarliest = earliestLoanDueDate ? earliestLoanDueDate.split("T")[0] : null;
  // The minimum reservation date is the provided earliestLoanDueDate (parsed) or today
  const minReservationDate = formattedEarliest || today;
  // Maximum reservation date is 4 weeks (28 days) after minReservationDate
  const maxReservationDate = new Date(
    new Date(minReservationDate).getTime() + 28 * 24 * 60 * 60 * 1000
  )
    .toISOString()
    .split("T")[0];

  console.log('Computed minReservationDate:', minReservationDate);
  console.log('Computed maxReservationDate:', maxReservationDate);

  const handleReservation = async () => {
    if (!reservationDate || !reservationEndDate) {
      setError("Please select both reservation start and end dates.");
      return;
    }

    const payload = {
      item_id: item.item_id,
      account_id: accountId,
      reservation_date: reservationDate,
      reservation_end_date: reservationEndDate,
    };

    console.log("Sending reservation payload:", payload);

    try {
      const res = await fetch(`/api/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        console.error("API Error:", data);
        throw new Error(data.error || "Failed to create reservation.");
      }

      onReservationSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError("An error occurred while creating the reservation.");
    }
  };

  return (
    <Popup title={`Reserve Item: ${item.title}`} onClose={onClose}>
      <div className="mb-4">
        <label className="block font-medium mb-2">
          Reservation Start Date:
        </label>
        <input
          type="date"
          value={reservationDate}
          onChange={(e) => setReservationDate(e.target.value)}
          className="border px-4 py-2 rounded w-full"
          min={minReservationDate}
          max={maxReservationDate}
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-2">
          Reservation End Date:
        </label>
        <input
          type="date"
          value={reservationEndDate}
          onChange={(e) => setReservationEndDate(e.target.value)}
          className="border px-4 py-2 rounded w-full"
          min={reservationDate || minReservationDate}
          max={maxReservationDate}
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
          onClick={handleReservation}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Confirm Reservation
        </button>
      </div>
    </Popup>
  );
}