"use client";

import { useState } from "react";
import MakeLoanPopup from "@/components/Inventory/makeLoanPopup";

type Item = {
  item_id: number;
  title: string;
  description: string;
  quantity_available: number;
  publication_year: number;
  contributors: string | null;
};

export default function InventoryResults({
  items,
  accountId,
}: {
  items: Item[];
  accountId: number;
}) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const handleLoanSuccess = () => {
    alert("Loan created successfully!");
    setSelectedItem(null); // Close the popup
    // Optionally, refresh the inventory list here
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.length > 0 ? (
        items.map((item) => (
          <div key={item.item_id} className="border p-4 rounded shadow-sm">
            <h2 className="text-xl font-bold mb-2">{item.title}</h2>
            <p className="text-gray-700 mb-2">{item.description}</p>
            <p className="text-gray-500 mb-2">
              Contributors: {item.contributors || "N/A"}
            </p>
            <p className="text-gray-500 mb-4">
              Available: {item.quantity_available}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedItem(item)}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Make a Loan
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center col-span-3">No items found.</p>
      )}

      {selectedItem && (
        <MakeLoanPopup
          item={selectedItem}
          accountId={accountId} // Pass the accountId here
          onClose={() => setSelectedItem(null)}
          onLoanSuccess={handleLoanSuccess}
        />
      )}
    </div>
  );
}