"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navigator from "@/components/Navigator";
import Results from "@/components/Inventory/results";
import Filter from "@/components/Inventory/Filter";
import Sort from "@/components/Inventory/Sort";

export default function InventoryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('A-Z');
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const query = new URLSearchParams({
          search: searchTerm,
          filter,
          sort,
        }).toString();

        const res = await fetch(`/api/item?${query}`);
        const data = await res.json();
        if (res.ok) {
          setItems(data);
        } else {
          console.error("Failed to fetch inventory items");
        }
      } catch (err) {
        console.error("Failed to fetch items:", err);
      }
    };

    fetchItems();
  }, [searchTerm, filter, sort]);

  return (
    <>
      <Navigator user={null} setUser={() => null} />

      <div className="flex h-screen text-black">
        {/* Sidebar */}
        <aside className="w-1/4 border-r p-4 bg-gray-50 space-y-4">
          <input
            type="text"
            placeholder="Search for items in the library"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-4 py-2 rounded w-full"
          />

          <Filter value={filter} onChange={setFilter} />
          <Sort value={sort} onChange={setSort} />
        </aside>

        {/* Main Content */}
        <main className="w-3/4 p-6 border bg-white text-black">
          <Results items={items} />
        </main>
      </div>
    </>
  );
}