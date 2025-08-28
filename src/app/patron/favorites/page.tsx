"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Heart,
  Star,
  ShoppingCart,
  MapPin,
  Clock,
  Trash2,
  Share2,
  Plus,
  Minus,
  Award,
  Sparkles,
} from "lucide-react";

// Custom styles for animations
const customStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes pulse-glow {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
  }
  
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  .animate-pulse-glow {
    animation: pulse-glow 2s ease-in-out infinite;
  }
  
  .animate-slide-in-up {
    animation: slideInUp 0.6s ease-out forwards;
  }
  
  .animate-fade-in-scale {
    animation: fadeInScale 0.5s ease-out forwards;
  }
`;

// Mock data for favorites page
const favoriteFlavors = [
  {
    id: 1,
    name: "Mango Tango",
    emoji: "🥭",
    category: "fruity",
    description: "Tropical mango with a tangy twist",
    price: "€8.50",
    rating: 4.9,
    reviews: 127,
    isPremium: false,
    isSeasonal: false,
    calories: 180,
    preparationTime: "5 min",
    availableAt: ["Berlin Central", "Mumbai Downtown"],
    addedDate: "2024-01-10",
  },
  {
    id: 3,
    name: "Vanilla Bean",
    emoji: "🌿",
    category: "vanilla",
    description: "Classic vanilla with real vanilla beans",
    price: "€7.50",
    rating: 4.7,
    reviews: 156,
    isPremium: false,
    isSeasonal: false,
    calories: 160,
    preparationTime: "3 min",
    availableAt: ["All Stores"],
    addedDate: "2024-01-08",
  },
  {
    id: 6,
    name: "Espresso Shot",
    emoji: "☕",
    category: "coffee",
    description: "Strong coffee with chocolate chips",
    price: "€8.50",
    rating: 4.5,
    reviews: 78,
    isPremium: false,
    isSeasonal: false,
    calories: 190,
    preparationTime: "8 min",
    availableAt: ["All Stores"],
    addedDate: "2024-01-05",
  },
  {
    id: 2,
    name: "Chocolate Dream",
    emoji: "🍫",
    category: "chocolate",
    description: "Rich Belgian chocolate with cocoa nibs",
    price: "€9.00",
    rating: 4.8,
    reviews: 89,
    isPremium: true,
    isSeasonal: false,
    calories: 220,
    preparationTime: "7 min",
    availableAt: ["All Stores"],
    addedDate: "2024-01-12",
  },
];

const favoriteStores = [
  {
    id: 1,
    name: "EisLager Berlin Central",
    distance: "0.8 km",
    rating: 4.8,
    status: "open",
    specialties: ["Artisan Ice Cream", "Gelato"],
    favoriteCount: 234,
    lastVisited: "2024-01-15",
    image: "🏪",
  },
  {
    id: 2,
    name: "EisLager Mumbai Downtown",
    distance: "1.2 km",
    rating: 4.6,
    status: "open",
    specialties: ["Kulfi", "Falooda"],
    favoriteCount: 189,
    lastVisited: "2024-01-14",
    image: "🏪",
  },
  {
    id: 3,
    name: "EisLager Pune HQ",
    distance: "2.1 km",
    rating: 4.7,
    status: "open",
    specialties: ["Gelato", "Smoothies"],
    favoriteCount: 156,
    lastVisited: "2024-01-13",
    image: "🏪",
  },
];

const favoriteOrders = [
  {
    id: 1,
    items: [
      { name: "Mango Tango", quantity: 2, price: "€8.50" },
      { name: "Vanilla Bean", quantity: 1, price: "€7.50" },
    ],
    total: "€24.50",
    store: "EisLager Berlin Central",
    date: "2024-01-15",
    status: "delivered",
    rating: 5,
  },
  {
    id: 2,
    items: [
      { name: "Chocolate Dream", quantity: 1, price: "€9.00" },
      { name: "Espresso Shot", quantity: 1, price: "€8.50" },
    ],
    total: "€17.50",
    store: "EisLager Mumbai Downtown",
    date: "2024-01-14",
    status: "delivered",
    rating: 4,
  },
];

const tabs = [
  {
    id: "flavors",
    name: "Flavors",
    count: favoriteFlavors.length,
    emoji: "🍦",
  },
  { id: "stores", name: "Stores", count: favoriteStores.length, emoji: "🏪" },
  { id: "orders", name: "Orders", count: favoriteOrders.length, emoji: "📦" },
];

export default function PatronFavoritesPage() {
  const [activeTab, setActiveTab] = useState("flavors");
  const [search, setSearch] = useState("");

  const filteredFlavors = favoriteFlavors.filter((flavor) =>
    flavor.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredStores = favoriteStores.filter((store) =>
    store.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredOrders = favoriteOrders.filter(
    (order) =>
      order.store.toLowerCase().includes(search.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      )
  );

  const removeFavorite = (type: string, id: number) => {
    // In a real app, this would update the backend
    console.log(`Removing ${type} with id ${id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "in-transit":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "preparing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50 dark:from-orange-950/20 dark:via-pink-950/20 dark:to-rose-950/20">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-orange-200/30 to-pink-200/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-pink-200/30 to-rose-200/30 rounded-full blur-2xl animate-pulse-glow"></div>
        <div
          className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-r from-orange-200/20 to-yellow-200/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-in-up">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            My Favorites
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Your saved flavors, stores, and favorite orders
          </p>
        </div>

        {/* Search */}
        <div
          className="mb-6 animate-slide-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search favorites..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700 focus:border-orange-400 dark:focus:border-orange-500"
            />
          </div>
        </div>

        {/* Tabs */}
        <div
          className="mb-8 animate-slide-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white border-0"
                    : "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950/20"
                } transition-all duration-200`}
              >
                <span className="mr-2">{tab.emoji}</span>
                {tab.name}
                <Badge
                  variant="secondary"
                  className={`ml-2 ${
                    activeTab === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                  }`}
                >
                  {tab.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="animate-fade-in-scale">
          {activeTab === "flavors" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFlavors.map((flavor, index) => (
                <Card
                  key={flavor.id}
                  className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700 hover:border-orange-400 dark:hover:border-orange-500 transition-all duration-300 hover:shadow-lg hover:shadow-orange-100 dark:hover:shadow-orange-900/20"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12 bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/30 dark:to-pink-900/30">
                          <AvatarFallback className="text-2xl">
                            {flavor.emoji}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                            {flavor.name}
                          </CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">
                                {flavor.rating}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              ({flavor.reviews})
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFavorite("flavor", flavor.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {flavor.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="secondary"
                          className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                        >
                          {flavor.category}
                        </Badge>
                        {flavor.isPremium && (
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                            <Award className="w-3 h-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                        {flavor.isSeasonal && (
                          <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Seasonal
                          </Badge>
                        )}
                      </div>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {flavor.price}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {flavor.availableAt.length} stores
                        </span>
                      </div>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white"
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Order
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "stores" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStores.map((store, index) => (
                <Card
                  key={store.id}
                  className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700 hover:border-orange-400 dark:hover:border-orange-500 transition-all duration-300 hover:shadow-lg hover:shadow-orange-100 dark:hover:shadow-orange-900/20"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12 bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/30 dark:to-pink-900/30">
                          <AvatarFallback className="text-2xl">
                            {store.image}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                            {store.name}
                          </CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">
                                {store.rating}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {store.distance}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFavorite("store", store.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge
                        className={`${
                          store.status === "open"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        }`}
                      >
                        {store.status}
                      </Badge>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {store.favoriteCount} favorites
                      </span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Specialties:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {store.specialties.map((specialty, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-300"
                          >
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Last visited: {store.lastVisited}
                      </span>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white"
                        >
                          Visit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-6">
              {filteredOrders.map((order, index) => (
                <Card
                  key={order.id}
                  className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700 hover:border-orange-400 dark:hover:border-orange-500 transition-all duration-300 hover:shadow-lg hover:shadow-orange-100 dark:hover:shadow-orange-900/20"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                          Order #{order.id}
                        </CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {order.store} • {order.date}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFavorite("order", order.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between py-2 border-b border-orange-100 dark:border-orange-800/30 last:border-b-0"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">
                              {idx === 0 ? "🍦" : "🍨"}
                            </span>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {item.name}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {item.price}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-orange-100 dark:border-orange-800/30">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">
                            {order.rating}/5
                          </span>
                        </div>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          Total: {order.total}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white"
                      >
                        Reorder
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {((activeTab === "flavors" && filteredFlavors.length === 0) ||
            (activeTab === "stores" && filteredStores.length === 0) ||
            (activeTab === "orders" && filteredOrders.length === 0)) && (
            <div className="text-center py-12 animate-fade-in-scale">
              <div className="text-6xl mb-4">
                {activeTab === "flavors"
                  ? "🍦"
                  : activeTab === "stores"
                  ? "🏪"
                  : "📦"}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No favorites found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {activeTab === "flavors"
                  ? "Start adding flavors to your favorites!"
                  : activeTab === "stores"
                  ? "Save your favorite stores for quick access!"
                  : "Your favorite orders will appear here!"}
              </p>
              <Button className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white">
                Browse{" "}
                {activeTab === "flavors"
                  ? "Flavors"
                  : activeTab === "stores"
                  ? "Stores"
                  : "Orders"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
