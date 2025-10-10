"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  X,
  Star,
  Heart,
  Sparkles,
  Moon,
  Sun,
} from "lucide-react";

// POS-specific data
const categories = [
  {
    id: "all",
    name: "All Items",
    emoji: "🍯",
    color: "from-amber-400 to-orange-500",
  },
  {
    id: "fruity",
    name: "Fruity",
    emoji: "🍓",
    color: "from-red-400 to-pink-500",
  },
  {
    id: "chocolate",
    name: "Chocolate",
    emoji: "🍫",
    color: "from-amber-600 to-yellow-700",
  },
  {
    id: "vanilla",
    name: "Vanilla",
    emoji: "🌿",
    color: "from-green-400 to-emerald-500",
  },
  {
    id: "nutty",
    name: "Nutty",
    emoji: "🥜",
    color: "from-orange-400 to-amber-600",
  },
  {
    id: "coffee",
    name: "Coffee",
    emoji: "☕",
    color: "from-amber-800 to-yellow-900",
  },
];

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  stock: number;
  category: string;
  emoji: string;
  rating: number;
  reviews: number;
  isPopular: boolean;
  description: string;
}

interface CartItem extends Product {
  qty: number;
  customizations?: string[];
}

const products: Product[] = [
  {
    id: 1,
    name: "Mango Tango Swirl",
    price: 150,
    originalPrice: 180,
    stock: 12,
    category: "fruity",
    emoji: "🥭",
    rating: 4.8,
    reviews: 120,
    isPopular: true,
    description: "Tropical mango with a tangy twist",
  },
  {
    id: 2,
    name: "Strawberry Fields",
    price: 140,
    originalPrice: 160,
    stock: 8,
    category: "fruity",
    emoji: "🍓",
    rating: 4.7,
    reviews: 98,
    isPopular: false,
    description: "Fresh strawberries in creamy delight",
  },
  {
    id: 3,
    name: "Dark Chocolate Dreams",
    price: 180,
    originalPrice: 200,
    stock: 5,
    category: "chocolate",
    emoji: "🍫",
    rating: 4.9,
    reviews: 150,
    isPopular: true,
    description: "Rich Belgian dark chocolate indulgence",
  },
  {
    id: 4,
    name: "Madagascar Vanilla",
    price: 130,
    originalPrice: 150,
    stock: 7,
    category: "vanilla",
    emoji: "🌿",
    rating: 4.6,
    reviews: 80,
    isPopular: false,
    description: "Pure Madagascar vanilla bean perfection",
  },
  {
    id: 5,
    name: "Hazelnut Paradise",
    price: 170,
    originalPrice: 190,
    stock: 3,
    category: "nutty",
    emoji: "🥜",
    rating: 4.5,
    reviews: 60,
    isPopular: true,
    description: "Roasted hazelnuts in creamy heaven",
  },
  {
    id: 6,
    name: "Espresso Euphoria",
    price: 160,
    originalPrice: 180,
    stock: 10,
    category: "coffee",
    emoji: "☕",
    rating: 4.4,
    reviews: 70,
    isPopular: false,
    description: "Bold espresso with smooth cream",
  },
  {
    id: 7,
    name: "Berry Bliss Mix",
    price: 165,
    originalPrice: 185,
    stock: 15,
    category: "fruity",
    emoji: "🫐",
    rating: 4.6,
    reviews: 95,
    isPopular: true,
    description: "Mixed berries in perfect harmony",
  },
  {
    id: 8,
    name: "Caramel Crunch",
    price: 155,
    originalPrice: 175,
    stock: 6,
    category: "chocolate",
    emoji: "🍮",
    rating: 4.7,
    reviews: 110,
    isPopular: false,
    description: "Salted caramel with crunchy bits",
  },
];

export default function ClerkPOSPage() {
  const { theme, setTheme } = useTheme();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState(new Set());

  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isDark = theme === "dark";

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, qty: Math.max(0, item.qty + delta) }
            : item,
        )
        .filter((item) => item.qty > 0),
    );
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="w-full h-full bg-transparent flex flex-col lg:flex-row min-h-screen">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200/30 dark:bg-pink-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-24 h-24 bg-purple-200/30 dark:bg-purple-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-rose-200/30 dark:bg-rose-400/20 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 pr-0">
        <div className="relative z-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Point of Sale
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Select products to add to cart</p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-pink-400" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for delicious treats..."
                className="w-full pl-14 pr-4 py-4 bg-white/80 text-gray-800 placeholder-pink-400 dark:bg-gray-700/80 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 dark:focus:border-pink-400 dark:focus:ring-pink-400/20 backdrop-blur-sm border-2 border-pink-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 rounded-2xl transition-all duration-300 text-lg shadow-lg"
              />
            </div>
          </div>

          {/* Category Tags */}
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${
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
                    ? products.length
                    : products.filter((p) => p.category === category.id).length}
                </span>
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:scale-105"
              >
                {/* Product Image/Icon */}
                <div className="relative p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
                  {product.isPopular && (
                    <div className="absolute top-2 left-2 bg-pink-500 text-white px-2 py-1 rounded text-xs font-medium">
                      Popular
                    </div>
                  )}
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white dark:bg-gray-600/80 dark:hover:bg-gray-500 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors duration-300 ${
                        favorites.has(product.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </button>

                  {/* Product Icon */}
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-white dark:bg-gray-600 rounded-lg shadow-sm flex items-center justify-center text-3xl">
                      {product.emoji}
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1 text-gray-800 dark:text-gray-100 group-hover:text-pink-600 transition-colors truncate">
                    {product.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {product.rating}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({product.reviews})
                    </span>
                  </div>

                  {/* Stock Status */}
                  <div className="mb-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        product.stock === 0
                          ? "bg-red-100 text-red-700"
                          : product.stock < 5
                            ? "bg-orange-100 text-orange-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {product.stock === 0
                        ? "Out of Stock"
                        : product.stock < 5
                          ? "Low Stock"
                          : "In Stock"}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-pink-600">
                        ₹{product.price}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="line-through text-sm text-gray-400 dark:text-gray-500">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* No Products Found */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-600 dark:text-gray-300">
                No products found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search or category filter
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Cart Sidebar */}
      <div className="w-96 p-6 flex-shrink-0">
        <div className="fixed top-6 right-6 bottom-6 w-96 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-xl border border-pink-200/50 dark:border-gray-700/50 overflow-hidden flex flex-col">
          {/* Cart Header */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-4 text-white flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-yellow-400 text-pink-800 text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-bold">Your Cart</h2>
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 min-h-0">
            {cart.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-3xl mb-3">🛒</div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Your cart is empty</p>
                  <p className="text-xs mt-1 text-gray-400 dark:text-gray-500">
                    Add some delicious treats!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-pink-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-white dark:bg-gray-600 rounded-full flex items-center justify-center text-sm shadow-sm">
                      {item.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 dark:text-gray-100 text-sm truncate">
                        {item.name}
                      </h4>
                      <p className="text-pink-600 font-semibold text-sm">₹{item.price}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="w-6 h-6 bg-white hover:bg-pink-100 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-full shadow-sm flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                      </button>
                      <span className="font-semibold min-w-[1.5rem] text-center text-gray-800 dark:text-gray-100 text-sm">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="w-6 h-6 bg-white hover:bg-pink-100 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-full shadow-sm flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-6 h-6 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 rounded-full shadow-sm flex items-center justify-center transition-colors ml-1"
                      >
                        <X className="w-3 h-3 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-pink-100 dark:border-gray-700 flex-shrink-0">
              <div className="flex justify-between items-center mb-3">
                <span className="text-base font-semibold text-gray-700 dark:text-gray-200">
                  Total:
                </span>
                <span className="text-xl font-bold text-pink-600">
                  ₹{total}
                </span>
              </div>
              <button 
                onClick={() => {
                  const cartData = encodeURIComponent(JSON.stringify(cart));
                  window.location.href = `/clerk/checkout?cart=${cartData}`;
                }}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>Checkout</span>
                <span className="text-base">→</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
