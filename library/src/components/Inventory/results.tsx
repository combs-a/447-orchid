"use client";

type Item = {
  item_id: number;
  title: string;
  description: string;
  quantity_available: number;
  publication_year: number;
  author_name: string;
};

export default function InventoryResults({ items }: { items: Item[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.length > 0 ? (
        items.map((item) => (
          <div key={item.item_id} className="border p-4 rounded shadow-sm">
            <h2 className="text-xl font-bold mb-2">{item.title}</h2>
            <p className="text-gray-700 mb-2">{item.description}</p>
            <p className="text-gray-500 mb-4">
              Available: {item.quantity_available}
            </p>
            <div className="flex space-x-2">
              <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                Loan
              </button>
              <button className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
                Reserve
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center col-span-3">No items found.</p>
      )}
    </div>
  );
}
