"use client";
import { useState } from "react";
import {
  Package,
  AlertTriangle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Grid3X3,
  List,
  Eye,
  Plus,
  Minus,
  Calendar,
  Clock,
  Star,
  Heart,
  ShoppingCart,
} from "lucide-react";

interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  category: string;
  stock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  price: number;
  status: "in_stock" | "low_stock" | "out_of_stock" | "overstock";
  lastUpdated: string;
  expiryDate: string;
  supplier: string;
  emoji: string;
  isPopular: boolean;
  rating: number;
  reviews: number;
}

const inventoryData: InventoryItem[] = [
  {
    id: 1,
    name: "Choco Burst Ice Cream",
    sku: "ICE-001",
    category: "Ice Cream",
    stock: 32,
    minStock: 10,
    maxStock: 50,
    unit: "Tubs",
    price: 45.00,
    status: "in_stock",
    lastUpdated: "2 hours ago",
    expiryDate: "2024-07-15",
    supplier: "Frozen Delights Co.",
    emoji: "🍫",
    isPopular: true,
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 2,
    name: "Mango Swirl",
    sku: "ICE-002",
    category: "Ice Cream",
    stock: 8,
    minStock: 15,
    maxStock: 40,
    unit: "Tubs",
    price: 42.00,
    status: "low_stock",
    lastUpdated: "4 hours ago",
    expiryDate: "2024-06-25",
    supplier: "Tropical Treats Ltd.",
    emoji: "🥭",
    isPopular: false,
    rating: 4.6,
    reviews: 89,
  },
  {
    id: 3,
    name: "Vanilla Dream",
    sku: "ICE-003",
    category: "Ice Cream",
    stock: 0,
    minStock: 10,
    maxStock: 35,
    unit: "Tubs",
    price: 38.00,
    status: "out_of_stock",
    lastUpdated: "1 day ago",
    expiryDate: "2024-06-20",
    supplier: "Classic Creamery",
    emoji: "🍦",
    isPopular: true,
    rating: 4.7,
    reviews: 156,
  },
  {
    id: 4,
    name: "Raspberry Delight",
    sku: "ICE-004",
    category: "Ice Cream",
    stock: 12,
    minStock: 10,
    maxStock: 30,
    unit: "Tubs",
    price: 48.00,
    status: "in_stock",
    lastUpdated: "3 hours ago",
    expiryDate: "2024-07-01",
    supplier: "Berry Best Co.",
    emoji: "🍓",
    isPopular: false,
    rating: 4.5,
    reviews: 67,
  },
  {
    id: 5,
    name: "Hazelnut Heaven",
    sku: "ICE-005",
    category: "Ice Cream",
    stock: 5,
    minStock: 8,
    maxStock: 25,
    unit: "Tubs",
    price: 52.00,
    status: "low_stock",
    lastUpdated: "5 hours ago",
    expiryDate: "2024-06-18",
    supplier: "Nutty Delights Inc.",
    emoji: "🌰",
    isPopular: false,
    rating: 4.9,
    reviews: 203,
  },
  {
    id: 6,
    name: "Strawberry Shortcake",
    sku: "ICE-006",
    category: "Ice Cream",
    stock: 28,
    minStock: 12,
    maxStock: 45,
    unit: "Tubs",
    price: 46.00,
    status: "in_stock",
    lastUpdated: "1 hour ago",
    expiryDate: "2024-07-10",
    supplier: "Sweet Dreams Ltd.",
    emoji: "🍰",
    isPopular: true,
    rating: 4.8,
    reviews: 178,
  },
];

const categories = [
  { id: "all", name: "All Items", emoji: "📦", color: "from-pink-500 to-purple-600" },
  { id: "Ice Cream", name: "Ice Cream", emoji: "🍦", color: "from-pink-500 to-purple-600" },
  { id: "Toppings", name: "Toppings", emoji: "🍒", color: "from-purple-500 to-pink-600" },
  { id: "Cones", name: "Cones", emoji: "🍦", color: "from-rose-500 to-pink-600" },
];

export default function ClerkStockPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const filteredInventory = inventoryData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                         item.sku.toLowerCase().includes(search.toLowerCase()) ||
                         item.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_stock": return "bg-green-100 text-green-700";
      case "low_stock": return "bg-yellow-100 text-yellow-700";
      case "out_of_stock": return "bg-red-100 text-red-700";
      case "overstock": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "in_stock": return "In Stock";
      case "low_stock": return "Low Stock";
      case "out_of_stock": return "Out of Stock";
      case "overstock": return "Overstock";
      default: return "Unknown";
    }
  };

  const toggleFavorite = (id: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const stats = {
    totalItems: inventoryData.length,
    inStock: inventoryData.filter(item => item.status === "in_stock").length,
    lowStock: inventoryData.filter(item => item.status === "low_stock").length,
    outOfStock: inventoryData.filter(item => item.status === "out_of_stock").length,
    totalValue: inventoryData.reduce((sum, item) => sum + (item.stock * item.price), 0),
  };

  return (
    <div className="w-full h-full bg-transparent flex flex-col min-h-screen">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200/30 dark:bg-pink-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-24 h-24 bg-purple-200/30 dark:bg-purple-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-rose-200/30 dark:bg-rose-400/20 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        <div className="relative z-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Shop Inventory
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Manage your store&apos;s stock levels</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-pink-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total Items</p>
                  <p className="text-xl font-bold text-gray-800 dark:text-white">{stats.totalItems}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-pink-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">In Stock</p>
                  <p className="text-xl font-bold text-green-600">{stats.inStock}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-pink-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Low Stock</p>
                  <p className="text-xl font-bold text-yellow-600">{stats.lowStock}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-pink-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Out of Stock</p>
                  <p className="text-xl font-bold text-red-600">{stats.outOfStock}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-pink-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total Value</p>
                  <p className="text-xl font-bold text-purple-600">₹{stats.totalValue.toFixed(0)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-pink-400" />
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search inventory..."
                  className="w-full pl-12 pr-4 py-3 bg-white/80 text-gray-800 placeholder-pink-400 dark:bg-gray-700/80 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 dark:focus:border-pink-400 dark:focus:ring-pink-400/20 backdrop-blur-sm border-2 border-pink-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 rounded-xl transition-all duration-300 shadow-lg"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  viewMode === "grid"
                    ? "bg-pink-500 text-white shadow-lg"
                    : "bg-white/80 text-gray-600 hover:bg-pink-50 dark:bg-gray-700/80 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  viewMode === "list"
                    ? "bg-pink-500 text-white shadow-lg"
                    : "bg-white/80 text-gray-600 hover:bg-pink-50 dark:bg-gray-700/80 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Category Tags */}
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${
                  selectedCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : "bg-white/80 text-gray-700 hover:bg-white dark:bg-gray-700/80 dark:text-gray-200 dark:hover:bg-gray-600 border border-pink-200 dark:border-gray-600"
                }`}
              >
                <span className="text-lg">{category.emoji}</span>
                <span>{category.name}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    selectedCategory === category.id
                      ? "bg-white/20"
                      : "bg-pink-100 text-pink-600 dark:bg-gray-600 dark:text-gray-300"
                  }`}
                >
                  {category.id === "all"
                    ? inventoryData.length
                    : inventoryData.filter((item) => item.category === category.id).length}
                </span>
              </button>
            ))}
          </div>

          {/* Inventory Display */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredInventory.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl border border-pink-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:scale-105"
                >
                  {/* Item Header */}
                  <div className="relative p-4 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-700 dark:to-purple-800">
                    {item.isPopular && (
                      <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Popular
                      </div>
                    )}
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white dark:bg-gray-600/80 dark:hover:bg-gray-500 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors duration-300 ${
                          favorites.has(item.id)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400"
                        }`}
                      />
                    </button>

                    {/* Item Icon */}
                    <div className="flex justify-center mb-3">
                      <div className="w-16 h-16 bg-white dark:bg-gray-600 rounded-lg shadow-md flex items-center justify-center text-3xl">
                        {item.emoji}
                      </div>
                    </div>
                  </div>

                  {/* Item Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1 text-gray-800 dark:text-gray-100 group-hover:text-pink-600 transition-colors truncate">
                      {item.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{item.sku}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{item.category}</span>
                    </div>

                    {/* Stock Level */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Stock Level</span>
                        <span className="text-sm font-bold text-pink-600">{item.stock} {item.unit}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            item.status === "in_stock"
                              ? "bg-green-500"
                              : item.status === "low_stock"
                                ? "bg-yellow-500"
                                : item.status === "out_of_stock"
                                  ? "bg-red-500"
                                  : "bg-blue-500"
                          }`}
                          style={{
                            width: `${Math.min((item.stock / item.maxStock) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>Min: {item.minStock}</span>
                        <span>Max: {item.maxStock}</span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="mb-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}
                      >
                        {getStatusText(item.status)}
                      </span>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-pink-600">₹{item.price}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">per {item.unit}</p>
                      </div>
                      <div className="flex gap-1">
                        <button className="p-2 bg-pink-100 hover:bg-pink-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-lg transition-colors">
                          <Plus className="w-4 h-4 text-pink-600" />
                        </button>
                        <button className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {/* Last Updated */}
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>Updated {item.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-pink-100 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Product</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">SKU</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Stock</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Price</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Last Updated</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {filteredInventory.map((item) => (
                      <tr key={item.id} className="hover:bg-pink-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white dark:bg-gray-600 rounded-lg flex items-center justify-center text-xl">
                              {item.emoji}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 dark:text-gray-100">{item.name}</p>
                              {item.isPopular && (
                                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                                  Popular
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{item.sku}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{item.category}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-800 dark:text-gray-100">{item.stock}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{item.unit}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}
                          >
                            {getStatusText(item.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-pink-600">₹{item.price}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{item.lastUpdated}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button className="p-2 bg-pink-100 hover:bg-pink-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-lg transition-colors">
                              <Plus className="w-4 h-4 text-pink-600" />
                            </button>
                            <button className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-lg transition-colors">
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* No Items Found */}
          {filteredInventory.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-600 dark:text-gray-300">
                No inventory items found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search or category filter
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}