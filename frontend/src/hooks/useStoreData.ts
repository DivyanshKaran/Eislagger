"use client";

import { useEffect, useState } from "react";

export type StoreLocation = {
  id: string;
  name: string;
  type: "flagship" | "branch" | "outlet" | "seasonal" | "coming-soon" | string;
  lat: number;
  lng: number;
  address: string;
  rating?: number;
  reviews?: number;
};

// Temporary normalized data source (can be replaced with API call)
const seedStores: StoreLocation[] = [
  {
    id: "1",
    name: "Sweet Dreams Downtown",
    type: "flagship",
    lat: 28.6139,
    lng: 77.209,
    address: "Connaught Place, New Delhi, India",
    rating: 4.8,
    reviews: 120,
  },
  {
    id: "2",
    name: "Chill Corner Mall Store",
    type: "branch",
    lat: 28.6358,
    lng: 77.2245,
    address: "Select Citywalk Mall, Saket, New Delhi",
    rating: 4.6,
    reviews: 98,
  },
  {
    id: "3",
    name: "Garden Fresh Ice Cream",
    type: "outlet",
    lat: 28.7041,
    lng: 77.1025,
    address: "Lodi Garden Park Entrance, New Delhi",
    rating: 4.9,
    reviews: 87,
  },
];

export function useStoreData() {
  const [stores, setStores] = useState<StoreLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate async fetch; replace with real API later
    const timeout = setTimeout(() => {
      try {
        setStores(seedStores);
      } catch (e) {
        setError("Failed to load store data");
      } finally {
        setLoading(false);
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  return { stores, loading, error };
}

export default useStoreData;


