"use client";
import React, { useState } from "react";
import {
  FaShoppingCart,
  FaHeart,
  FaCheck,
  FaUserCircle,
  FaChevronDown,
} from "react-icons/fa";
import { cn } from "@/lib/utils";

// --- Mock Data ---
const categories = [
  { key: "chocolate", label: "Chocolate", color: "#A87C6E" },
  { key: "mango", label: "Mango", color: "#FFCB6B" },
  { key: "fruit", label: "Fruit", color: "#E29587" },
  { key: "nutty", label: "Nutty", color: "#DCC6AC" },
  { key: "premium", label: "Premium", color: "#FFD700" },
  { key: "dairyfree", label: "Dairy-Free", color: "#B3EACD" },
  {
    key: "kids",
    label: "Kids Specials",
    color: "linear-gradient(90deg,#FFB7CE,#B3EACD,#FFD700)",
  },
  { key: "international", label: "International", color: "#B8C4E3" },
  { key: "seasonal", label: "Seasonal", color: "#C62828" },
];
const tags = ["Vegan", "Nut-Free", "Festive", "Gluten-Free", "Low Sugar"];
const sortOptions = [
  { key: "popularity", label: "Popularity" },
  { key: "priceLow", label: "Price: Low to High" },
  { key: "priceHigh", label: "Price: High to Low" },
  { key: "newest", label: "Newest" },
  { key: "alpha", label: "Alphabetical" },
];
const dietaryFilters = ["Dairy-Free", "Vegan", "Nut-Free", "Seasonal Only"];

const mockFlavors = [
  {
    id: 1,
    name: "Nivora Frostbite",
    category: "chocolate",
    description: "Intense dark chocolate with mint fudge ribbons.",
    tags: ["Chocolate", "Dairy-Free", "Premium"],
    price: 120,
    image: "/icecream1.jpg",
    isFavorite: false,
    isVegan: true,
    isNutFree: true,
    isSeasonal: false,
  },
  {
    id: 2,
    name: "Mango Coconut Kiss",
    category: "mango",
    description: "Mango puree swirled with coconut cream.",
    tags: ["Mango", "Dairy-Free", "Vegan"],
    price: 110,
    image: "/icecream2.jpg",
    isFavorite: true,
    isVegan: true,
    isNutFree: true,
    isSeasonal: false,
  },
  {
    id: 3,
    name: "Berry Carnival",
    category: "fruit",
    description: "Strawberry, blueberry, and raspberry medley.",
    tags: ["Fruit", "Nut-Free", "Kids Specials"],
    price: 100,
    image: "/icecream3.jpg",
    isFavorite: false,
    isVegan: false,
    isNutFree: true,
    isSeasonal: false,
  },
  {
    id: 4,
    name: "Hazelnut Dream",
    category: "nutty",
    description: "Creamy hazelnut with caramelized crunch.",
    tags: ["Nutty", "Premium"],
    price: 130,
    image: "/icecream4.jpg",
    isFavorite: false,
    isVegan: false,
    isNutFree: false,
    isSeasonal: false,
  },
  {
    id: 5,
    name: "Gold Leaf Caramel",
    category: "premium",
    description: "Caramel ice cream with edible gold leaf.",
    tags: ["Premium", "Festive"],
    price: 200,
    image: "/icecream5.jpg",
    isFavorite: true,
    isVegan: false,
    isNutFree: true,
    isSeasonal: true,
  },
  // ...add more mock flavors as needed
];

// --- Components ---
function TopNavBar({ cartCount }: { cartCount: number }) {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white dark:bg-[#18181b] shadow rounded-t-2xl">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-pink-400 cursor-pointer">
          🍦 EisLager
        </span>
      </div>
      <div className="flex items-center gap-6">
        <button className="relative">
          <FaShoppingCart className="w-6 h-6 text-pink-400" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-pink-400 text-white text-xs rounded-full px-2 py-0.5 font-bold">
              {cartCount}
            </span>
          )}
        </button>
        <div className="relative group">
          <button className="flex items-center gap-2 text-pink-400 font-semibold">
            <FaUserCircle className="w-6 h-6" />
            <span>Profile</span>
            <FaChevronDown className="w-4 h-4" />
          </button>
          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-[#23232b] rounded-xl shadow-lg p-2 hidden group-hover:block z-20">
            <button className="w-full text-left px-3 py-2 hover:bg-pink-50 dark:hover:bg-zinc-800 rounded-lg">
              Orders
            </button>
            <button className="w-full text-left px-3 py-2 hover:bg-pink-50 dark:hover:bg-zinc-800 rounded-lg">
              Preferences
            </button>
            <button className="w-full text-left px-3 py-2 text-red-500 hover:bg-pink-50 dark:hover:bg-zinc-800 rounded-lg">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function SidebarFilters({
  selectedCategories,
  setSelectedCategories,
  selectedTags,
  setSelectedTags,
  selectedSort,
  setSelectedSort,
  selectedDietary,
  setSelectedDietary,
}: any) {
  return (
    <aside className="w-full md:w-64 bg-[#FCE7F3] dark:bg-[#2a202b] rounded-2xl shadow-lg p-6 flex flex-col gap-6 border border-pink-100 dark:border-zinc-800">
      <div>
        <h3 className="font-bold text-pink-400 mb-2">Categories</h3>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <label
              key={cat.key}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.key)}
                onChange={() => {
                  setSelectedCategories((prev: string[]) =>
                    prev.includes(cat.key)
                      ? prev.filter((c) => c !== cat.key)
                      : [...prev, cat.key]
                  );
                }}
                className="accent-pink-400 w-4 h-4 rounded"
              />
              <span className="font-medium" style={{ color: cat.color }}>
                {cat.label}
              </span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-bold text-pink-400 mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              className={cn(
                "px-3 py-1 rounded-full border text-xs font-semibold",
                selectedTags.includes(tag)
                  ? "bg-pink-400 text-white border-pink-400"
                  : "bg-white dark:bg-zinc-900 text-pink-400 border-pink-200 dark:border-zinc-700"
              )}
              onClick={() =>
                setSelectedTags((prev: string[]) =>
                  prev.includes(tag)
                    ? prev.filter((t) => t !== tag)
                    : [...prev, tag]
                )
              }
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-bold text-pink-400 mb-2">Sort By</h3>
        <select
          className="w-full rounded-lg border border-pink-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2"
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value)}
        >
          {sortOptions.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <h3 className="font-bold text-pink-400 mb-2">Dietary</h3>
        <div className="flex flex-wrap gap-2">
          {dietaryFilters.map((filter) => (
            <button
              key={filter}
              className={cn(
                "px-3 py-1 rounded-full border text-xs font-semibold",
                selectedDietary.includes(filter)
                  ? "bg-pink-400 text-white border-pink-400"
                  : "bg-white dark:bg-zinc-900 text-pink-400 border-pink-200 dark:border-zinc-700"
              )}
              onClick={() =>
                setSelectedDietary((prev: string[]) =>
                  prev.includes(filter)
                    ? prev.filter((f) => f !== filter)
                    : [...prev, filter]
                )
              }
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

function FlavorCard({ flavor, onFavorite, onAddToCart }: any) {
  const cat = categories.find((c) => c.key === flavor.category);
  return (
    <div
      className="flex flex-col bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-lg border border-pink-100 dark:border-zinc-800 overflow-hidden hover:shadow-xl transition-all relative"
      style={{ borderTop: cat ? `6px solid ${cat.color}` : undefined }}
    >
      <div className="h-36 w-full bg-gray-100 dark:bg-zinc-900 flex items-center justify-center overflow-hidden">
        <img
          src={flavor.image}
          alt={flavor.name}
          className="object-cover h-full w-full"
        />
      </div>
      <div className="p-4 flex-1 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="font-bold text-lg text-pink-400 truncate">
            {flavor.name}
          </span>
          <button
            className={cn(
              "text-xl transition-colors",
              flavor.isFavorite
                ? "text-pink-400"
                : "text-gray-300 hover:text-pink-400"
            )}
            onClick={() => onFavorite(flavor.id)}
          >
            <FaHeart />
          </button>
        </div>
        <span className="text-xs text-gray-500 dark:text-zinc-400 truncate">
          {flavor.description}
        </span>
        <div className="flex flex-wrap gap-2 mt-1">
          {flavor.tags.map((tag: string) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full bg-pink-100 dark:bg-zinc-800 text-pink-500 dark:text-pink-300 text-xs font-semibold border border-pink-200 dark:border-zinc-700"
            >
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-pink-400 text-lg">
            ₹{flavor.price}
          </span>
          <button
            className="bg-pink-400 hover:bg-pink-500 text-white rounded-lg px-4 py-2 font-bold flex items-center gap-2 shadow"
            onClick={() => onAddToCart(flavor.id)}
          >
            <FaShoppingCart /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PatronBrowsePage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>(sortOptions[0].key);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [cart, setCart] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);

  // Filter and sort logic (mock)
  let flavors = mockFlavors.filter(
    (f) =>
      (selectedCategories.length === 0 ||
        selectedCategories.includes(f.category)) &&
      (selectedTags.length === 0 ||
        selectedTags.every((t) => f.tags.includes(t))) &&
      (selectedDietary.length === 0 ||
        selectedDietary.every((d) =>
          d === "Dairy-Free"
            ? f.isVegan || f.isNutFree
            : d === "Vegan"
            ? f.isVegan
            : d === "Nut-Free"
            ? f.isNutFree
            : d === "Seasonal Only"
            ? f.isSeasonal
            : true
        ))
  );
  // Sorting (mock)
  if (selectedSort === "priceLow")
    flavors = flavors.sort((a, b) => a.price - b.price);
  if (selectedSort === "priceHigh")
    flavors = flavors.sort((a, b) => b.price - a.price);
  if (selectedSort === "alpha")
    flavors = flavors.sort((a, b) => a.name.localeCompare(b.name));

  function handleFavorite(id: number) {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }
  function handleAddToCart(id: number) {
    setCart((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  return (
    <div className="min-h-screen bg-[#FDF6FA] dark:bg-[#18181b] flex flex-col">
      <TopNavBar cartCount={cart.length} />
      <div className="flex-1 flex flex-row gap-8 px-8 py-8">
        <SidebarFilters
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
          selectedDietary={selectedDietary}
          setSelectedDietary={setSelectedDietary}
        />
        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {flavors.map((flavor) => (
              <FlavorCard
                key={flavor.id}
                flavor={{
                  ...flavor,
                  isFavorite: favorites.includes(flavor.id),
                }}
                onFavorite={handleFavorite}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
          {/* Pagination (mock) */}
          <div className="flex justify-center items-center gap-2 mt-8">
            <button className="px-3 py-1 rounded-lg bg-pink-100 text-pink-400 font-bold">
              &lt;
            </button>
            <button className="px-3 py-1 rounded-lg bg-pink-400 text-white font-bold">
              1
            </button>
            <button className="px-3 py-1 rounded-lg bg-pink-100 text-pink-400 font-bold">
              2
            </button>
            <button className="px-3 py-1 rounded-lg bg-pink-100 text-pink-400 font-bold">
              3
            </button>
            <button className="px-3 py-1 rounded-lg bg-pink-100 text-pink-400 font-bold">
              &gt;
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
