"use client";

import { useState } from "react";
import MakeLoanPopup from "@/components/Inventory/makeLoanPopup";
import MakeReservationPopup from "@/components/Inventory/makeReservationPopup";
import BookInfoPopup from "@/components/Inventory/bookInfoPopup";

// Item type, serves to retrieve the relevant info for results from the API
type Item = {
  item_id: number;
  title: string;
  description: string;
  quantity_available: number;
  publication_year: number;
  contributor_f_name: string; // First name of the contributor (concatenated at rendering)
  contributor_l_name: string; // Last name of the contributor
  contributor_role_name: string; // Role of the contributor
};

export default function InventoryResults({
  items,
  accountId,
}: {
  items: Item[];
  accountId: number;
}) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [reservationItem, setReservationItem] = useState<Item | null>(null);
  const [infoItem, setInfoItem] = useState<Item | null>(null);

  const handleLoanSuccess = () => {
    alert("Loan created successfully!");
    setSelectedItem(null); // Close the loan popup
  };

  const handleReservationSuccess = () => {
    alert("Reservation created successfully!");
    setReservationItem(null); // Close the reservation popup
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.length > 0 ? (
        items.map((item) => (
          <div key={item.item_id} className="border p-4 rounded shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{item.title}</h2>
              <button
                onClick={() => setInfoItem(item)}
                className="bg-gray-400 text-white p-2 rounded-full hover:bg-purple-700"
                title="More Info"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M12 20.25c4.97 0 9-4.03 9-9s-4.03-9-9-9-9 4.03-9 9 4.03 9 9 9z"
                  />
                </svg>
              </button>
            </div>
            <p className="text-gray-700 mb-2">{item.description}</p>
            <p className="text-gray-500 mb-2">
              {/* Concatenates contributor information for display */}
              Contributors: {`${item.contributor_f_name} ${item.contributor_l_name} (${item.contributor_role_name})`}
            </p>
            <p className="text-gray-500 mb-4">
              Available: {item.quantity_available}
            </p>
            <div className="flex space-x-2">
              {item.quantity_available > 0 ? (
                <button
                  onClick={() => setSelectedItem(item)}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                  Make a Loan
                </button>
              ) : (
                <button
                  onClick={() => setReservationItem(item)}
                  className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Reserve Item
                </button>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-center col-span-3">No items found.</p>
      )}

      {selectedItem && (
        <MakeLoanPopup
          item={selectedItem}
          accountId={accountId}
          onClose={() => setSelectedItem(null)}
          onLoanSuccess={handleLoanSuccess}
        />
      )}

      {reservationItem && (
        <MakeReservationPopup
          item={reservationItem}
          accountId={accountId}
          onClose={() => setReservationItem(null)}
          onReservationSuccess={handleReservationSuccess}
        />
      )}
      {infoItem && (
        <BookInfoPopup item={infoItem} onClose={() => setInfoItem(null)} />
      )}
    </div>
  );