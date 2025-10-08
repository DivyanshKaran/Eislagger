import React from "react";

export default function PatronStoresPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Store Locator
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Find the nearest EisLagger stores and discover new locations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Nearby Stores
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  EisLagger Downtown
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  0.8 km
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  EisLagger Mall
                </span>
                <span className="font-medium text-green-600">1.2 km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  EisLagger Station
                </span>
                <span className="font-medium text-blue-600">2.1 km</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Store Hours
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Monday - Friday
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  9:00 - 22:00
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Saturday
                </span>
                <span className="font-medium text-green-600">
                  10:00 - 23:00
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Sunday</span>
                <span className="font-medium text-blue-600">11:00 - 21:00</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Popular Features
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Drive-through
                </span>
                <span className="font-medium text-green-600">Available</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Outdoor Seating
                </span>
                <span className="font-medium text-green-600">Available</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">WiFi</span>
                <span className="font-medium text-blue-600">Free</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Store Map
          </h3>
          <div className="h-96 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">
              Interactive store map will be loaded here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
