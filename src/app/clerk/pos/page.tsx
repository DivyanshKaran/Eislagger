"use client";
import React, { useState } from "react";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  X,
  Star,
  Heart,
  Sparkles,
} from "lucide-react";

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

const products = [
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

export default function DessertPOSPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState(new Set());

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, qty: Math.max(1, item.qty + delta) }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const toggleFavorite = (id) => {
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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-100 flex">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-24 h-24 bg-purple-200/30 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-rose-200/30 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 pr-0">
        <div className="relative z-10">
          {/* Embedded Search Bar */}
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
                className="w-full pl-14 pr-4 py-4 bg-white/80 backdrop-blur-sm border-2 border-pink-200 rounded-2xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-300 text-lg placeholder-pink-400 shadow-lg"
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
                    : "bg-white/80 text-gray-700 hover:bg-white border border-pink-200"
                }`}
              >
                <span className="text-lg">{category.emoji}</span>
                <span>{category.name}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    selectedCategory === category.id
                      ? "bg-white/20"
                      : "bg-pink-100 text-pink-600"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl border border-pink-100 overflow-hidden transition-all duration-500 hover:scale-105"
              >
                {/* Product Header */}
                <div className="relative p-6 bg-gradient-to-br from-pink-50 to-purple-50">
                  {product.isPopular && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Popular
                    </div>
                  )}
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors duration-300 ${
                        favorites.has(product.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </button>

                  {/* Product Emoji/Icon */}
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center text-4xl transform group-hover:scale-110 transition-transform duration-300">
                      {product.emoji}
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {product.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-700">
                        {product.rating}
                      </span>
                    </div>
                    <span className="text-gray-500 text-sm">
                      ({product.reviews} reviews)
                    </span>
                  </div>

                  {/* Stock Status */}
                  <div className="mb-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
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
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl font-bold text-pink-600">
                      ₹{product.price}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-gray-400 line-through text-lg">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No products found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or category filter
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Cart Sidebar */}
      <div className="w-96 p-6 flex-shrink-0">
        <div className="sticky top-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-pink-200/50 overflow-hidden max-h-[calc(100vh-3rem)]">
          {/* Cart Header */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingCart className="w-6 h-6" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-yellow-400 text-pink-800 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold">Your Cart</h2>
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div className="max-h-96 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-4">🛒</div>
                <p className="text-gray-500">Your cart is empty</p>
                <p className="text-sm text-gray-400 mt-2">
                  Add some delicious treats!
                </p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 bg-pink-50 rounded-xl"
                  >
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-md">
                      {item.emoji}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {item.name}
                      </h4>
                      <p className="text-pink-600 font-bold">₹{item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-pink-100 transition-colors"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="font-semibold text-gray-800 min-w-[2rem] text-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-pink-100 transition-colors"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 bg-red-100 rounded-full shadow-md flex items-center justify-center hover:bg-red-200 transition-colors ml-2"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-pink-100">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-700">
                  Total:
                </span>
                <span className="text-2xl font-bold text-pink-600">
                  ₹{total}
                </span>
              </div>
              <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2">
                <span>Checkout</span>
                <span className="text-lg">→</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
