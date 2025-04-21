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
                  Loaned on: {loan.loan_out_date}
                  <br />
                  Due: {loan.due_date}
                  <br />
                  Returned: {loan.return_date ?? "Not returned"}
                </div>
              </div>

              {/* Right: Item info */}
              <div className="w-1/2 flex flex-col justify-between text-sm text-gray-700">
                <p className="font-medium">
                  <strong>Additional Information</strong>
                </p>
                <p>{loan.description}</p>
                <p>
                  <strong>Quantity Available:</strong> {loan.quantity_available}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
