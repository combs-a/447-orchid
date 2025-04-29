"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigator from "@/components/Navigator";
import Results from "@/components/Inventory/results";
import Filter from "@/components/Inventory/Filter";
import Sort from "@/components/Inventory/Sort";

type Account = {
  account_id: number; 
  first_name: string;
  last_name: string;
  card_number: string;
};

export default function InventoryPage() {
  const router = useRouter();
  const [user, setUser] = useState<Account | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("A-Z");
  const [items, setItems] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAccountId = localStorage.getItem("account_id");
  
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
  
      // Update the account_id in the user object
      if (storedAccountId) {
        parsedUser.account_id = Number(storedAccountId);
      }
  
      setUser(parsedUser);
    } else {
      router.push("/");
    }
  }, [router]);

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
      <Navigator user={user} setUser={setUser} />

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

          {/* Filter and Sort Section */}
          <div className="flex items-center space-x-2 whitespace-nowrap">
            {/* Filter Section */}
            <div className="flex items-center space-x-2">
              <p className="font-bold">Filter by:</p>
              <Filter value={filter} onChange={setFilter} />
            </div>

            {/* Sort Section */}
            <div className="flex items-center space-x-2">
              <p className="font-bold">Sort by:</p>
              <Sort value={sort} onChange={setSort} />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-3/4 p-6 border bg-white text-black">
          <div className="h-full overflow-y-auto border rounded p-4">
            {user && <Results items={items} accountId={user.account_id} />}
          </div>
        </main>
      </div>
    </>
  );
}