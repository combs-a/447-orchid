"use client";

import { useEffect, useState } from "react";

type LoanWithItem = {
  loan_id: number;
  loan_out_date: string;
  due_date: string;
  return_date: string | null;
  item_id: number;
  title: string;
  description: string;
  quantity_available: number;
};

export default function LoanHistory({ accountId }: { accountId: number }) {
  const [loans, setLoans] = useState<LoanWithItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await fetch(`/api/loans?account_id=${accountId}`);
        if (!res.ok) throw new Error("Failed to fetch loan history");
        const data = await res.json();
        setLoans(data);
      } catch (err) {
        console.error("Error loading loans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, [accountId]);

  if (loading) return <p>Loading loan history...</p>;

  return (
    <div className="overflow-y-auto max-h-[80vh] pr-2">
      <h2 className="text-xl font-semibold mb-4">Loan History</h2>
      {loans.length === 0 ? (
        <p>No loans found.</p>
      ) : (
        <div className="space-y-4">
          {loans.map((loan) => (
            <div
              key={loan.loan_id}
              className="flex border rounded-lg shadow-sm p-4 gap-4 bg-white items-stretch"
            >
              {/* Left: Loan info */}
              <div className="w-1/2 flex flex-col justify-between">
                <div className="text-lg font-semibold">{loan.title}</div>
                <div className="text-sm text-gray-600">
                  Loaned on: {loan.loan_out_date.slice(0, 10)}
                  <br />
                  Due: {loan.due_date.slice(0, 10)}
                  <br />
                  Returned:{" "}
                  {loan.return_date
                    ? loan.return_date.slice(0, 10)
                    : "Not returned"}
                </div>
              </div>

              {/* Right: Item info + return button */}
              <div className="w-1/2 flex flex-col justify-between text-sm text-gray-700">
                <p className="font-medium">
                  <strong>Additional Information</strong>
                </p>
                <p>{loan.description}</p>
                <p>
                  <strong>Quantity Available:</strong> {loan.quantity_available}
                </p>

                {!loan.return_date && (
                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch(`/api/loans/return`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ loan_id: loan.loan_id }),
                        });
                        if (res.ok) {
                          alert("Item returned!");
                          const updatedLoans = loans.map((l) =>
                            l.loan_id === loan.loan_id
                              ? { ...l, return_date: new Date().toISOString() }
                              : l
                          );
                          setLoans(updatedLoans);
                        } else {
                          alert("Failed to return item.");
                        }
                      } catch (err) {
                        console.error(err);
                        alert("Error returning item.");
                      }
                    }}
                    className="mt-2 bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
                  >
                    Return Item
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
