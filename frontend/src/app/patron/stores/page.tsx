"use client";

import { StoreMap } from "@/components/map/StoreMap";
import { useStoreData } from "@/hooks/useStoreData";

export default function PatronStoresPage() {
  const { stores, error } = useStoreData();

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-orange-50 via-white to-pink-50 dark:from-orange-950/20 dark:via-gray-950 dark:to-rose-950/20 p-4 md:p-6">
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Store Finder</h1>
        <p className="text-gray-600 dark:text-gray-300">Discover ice cream stores near you</p>
      </div>

      {error && <div className="text-red-600 dark:text-red-400">{error}</div>}
      <div className="rounded-xl overflow-hidden">
        <StoreMap stores={stores} />
      </div>
    </div>
  );
}