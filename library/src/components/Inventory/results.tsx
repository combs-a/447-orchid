"use client";

import { useState } from "react";
import MakeLoanPopup from "@/components/Inventory/makeLoanPopup";
import MakeReservationPopup from "@/components/Inventory/makeReservationPopup";

// Item type, servers to retreive the relevant for results from the API
type Item = {
  item_id: number;
  title: string;
  description: string;
  quantity_available: number;
  publication_year: number;
  contributor_f_name: string ; // First name of the contributor Concatenated at the rendering stage
  contributor_l_name: string ; // Last name of the contributor
  contributor_role_name: string ; // Role of the contributor
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
            <h2 className="text-xl font-bold mb-2">{item.title}</h2>
            <p className="text-gray-700 mb-2">{item.description}</p>
            <p className="text-gray-500 mb-2">
              {/*concatenates contributor information for display */}
              Contributors:{`${item.contributor_f_name} ${item.contributor_l_name} (${item.contributor_role_name}) `}
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
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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
    </div>
  );
}