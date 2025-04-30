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
  // Advanced search states:
  const [author, setAuthor] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [isbn, setIsbn] = useState("");
  const [issueNumber, setIssueNumber] = useState("");
  const [genre, setGenre] = useState("");
  const [ageRating, setAgeRating] = useState("");
  
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("A-Z");
  const [items, setItems] = useState([]);
  
  // State to control the advanced options panel
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAccountId = localStorage.getItem("account_id");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
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
        // Build query params including advanced search fields
        const query = new URLSearchParams({
          search: searchTerm,
          author,
          releaseYear,
          isbn,
          issueNumber,
          genre,
          ageRating,
          filter,
          sort
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
  }, [searchTerm, author, releaseYear, isbn, issueNumber, genre, ageRating, filter, sort]);

  return (
    <>
      <Navigator user={user} setUser={setUser} />

      <div className="flex h-screen text-black">
        {/* Sidebar */}
        <aside className="w-1/4 border-r p-4 bg-gray-50 space-y-4">
          <label className="block mb-1">Search Title:</label>
          <input
            type="text"
            placeholder="Search by title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-4 py-2 rounded w-full"
          />

          {/* toggle button for advanced options */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-blue-600 hover:text-gray-700"
          >
            {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
          </button>

          {/* advanced search fields in an expandable panel */}
          {showAdvanced && (
            <div className="mt-4 space-y-3 border-t pt-4">
              <div>
                <label className="block mb-1">Author Name:</label>
                <input 
                  type="text"
                  placeholder="Enter author name"
                  value={author}
                  onChange={(e) => setAuthor((e.target.value))}
                  className="border px-4 py-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block mb-1">Release Year:</label>
                <input 
                  type="interger"
                  placeholder="Enter release year"
                  value={releaseYear}
                  onChange={(e) => setReleaseYear(e.target.value)}
                  className="border px-4 py-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block mb-1">ISBN:</label>
                <input 
                  type="text"
                  placeholder="Enter ISBN"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  className="border px-4 py-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block mb-1">Issue Number:</label>
                <input 
                  type="text"
                  placeholder="Enter issue number"
                  value={issueNumber}
                  onChange={(e) => setIssueNumber(e.target.value)}
                  className="border px-4 py-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block mb-1">Genre:</label>
                <input 
                  type="text"
                  placeholder="Enter genre name"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="border px-4 py-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block mb-1">Age Rating:</label>
                <select 
                  value={ageRating}
                  onChange={(e) => setAgeRating(e.target.value)}
                  className="border px-4 py-2 rounded w-full"
                >
                  <option value="">Select rating</option>
                  <option value="G">G</option>
                  <option value="PG">PG</option>
                  <option value="PG-13">PG-13</option>
                  <option value="R">R</option>
                  <option value="NC-17">NC-17</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2 whitespace-nowrap">
            <div className="flex items-center space-x-2">
              <p className="font-bold">Filter by:</p>
              <Filter value={filter} onChange={setFilter} />
            </div>
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