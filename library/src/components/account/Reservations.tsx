"use client";

import { useEffect, useState } from "react";

type ReservationWithItem = {
  reservation_id: number;
  reservation_date: string;
  reservation_end_date: string;
  item_id: number;
  title: string;
  description: string;
  quantity_available: number;
  reservation_amount: number;
};

export default function Reservations({ accountId }: { accountId: number }) {
  const [reservations, setReservations] = useState<ReservationWithItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await fetch(`/api/reservations?account_id=${accountId}`);
        if (!res.ok) throw new Error("Failed to fetch reservations");
        const data = await res.json();
        setReservations(data);
      } catch (err) {
        console.error("Error loading reservations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [accountId]);

  if (loading) return <p>Loading reservations...</p>;

  return (
    <div className="overflow-y-auto max-h-[80vh] pr-2">
      <h2 className="text-xl font-semibold mb-4">Reservations</h2>
      {reservations.length === 0 ? (
        <p>No reservations on file.</p>
      ) : (
        <div className="space-y-4">
          {reservations.map((r) => (
            <div
              key={r.reservation_id}
              className="flex border rounded-lg shadow-sm p-4 gap-4 bg-white"
            >
              {/* Left Side */}
              <div className="w-1/2 flex flex-col justify-between">
                <div className="text-lg font-semibold">{r.title}</div>
                <div className="text-sm text-gray-600">
                  Reserve Window:
                  <br />
                  Start: {r.reservation_date.slice(0, 10)}
                  <br />
                  End: {r.reservation_end_date.slice(0, 10)}
                </div>
              </div>

              {/* Right Side */}
              <div className="w-1/2 flex flex-col justify-between text-sm text-gray-700">
                <p className="font-medium">
                  <strong>Additional Information</strong>
                </p>
                <p>{r.description}</p>
                <p>
                  <strong>Available:</strong> {r.quantity_available}
                </p>
                <p>
                  <strong>Reserved:</strong> {r.reservation_amount}
                </p>

                {new Date(r.reservation_end_date) > new Date() && (
                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch(`/api/reservations/cancel`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            reservation_id: r.reservation_id,
                          }),
                        });
                        if (res.ok) {
                          alert("Reservation canceled!");
                          setReservations(
                            reservations.filter(
                              (resv) => resv.reservation_id !== r.reservation_id
                            )
                          );
                        } else {
                          alert("Failed to cancel reservation.");
                        }
                      } catch (err) {
                        console.error(err);
                        alert("Error canceling reservation.");
                      }
                    }}
                    className="mt-2 bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
                  >
                    Cancel Reservation
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
