"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Filter,
  Heart,
  Star,
  ShoppingCart,
  MapPin,
  Clock,
  Users,
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

// Mock data for browse page
const categories = [
  { id: "all", name: "All Flavors", emoji: "🍦", count: 48 },
  { id: "fruity", name: "Fruity", emoji: "🍓", count: 12 },
  { id: "chocolate", name: "Chocolate", emoji: "🍫", count: 8 },
  { id: "vanilla", name: "Vanilla", emoji: "🌿", count: 6 },
  { id: "nutty", name: "Nutty", emoji: "🥜", count: 5 },
  { id: "coffee", name: "Coffee", emoji: "☕", count: 4 },
  { id: "seasonal", name: "Seasonal", emoji: "🎄", count: 8 },
  { id: "premium", name: "Premium", emoji: "👑", count: 5 },
];

const flavors = [
  {
    id: 1,
    name: "Mango Tango",
    emoji: "🥭",
    category: "fruity",
    description: "Tropical mango with a tangy twist",
    price: "€8.50",
    rating: 4.9,
    reviews: 127,
    isFavorite: true,
    isPremium: false,
    isSeasonal: false,
    allergens: ["Dairy"],
    calories: 180,
    preparationTime: "5 min",
    availableAt: ["Berlin Central", "Mumbai Downtown"],
    image: "🥭",
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
    isFavorite: false,
    isPremium: true,
    isSeasonal: false,
    allergens: ["Dairy", "Nuts"],
    calories: 220,
    preparationTime: "7 min",
    availableAt: ["All Stores"],
    image: "🍫",
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
    isFavorite: true,
    isPremium: false,
    isSeasonal: false,
    allergens: ["Dairy"],
    calories: 160,
    preparationTime: "3 min",
    availableAt: ["All Stores"],
    image: "🌿",
  },
  {
    id: 4,
    name: "Strawberry Delight",
    emoji: "🍓",
    category: "fruity",
    description: "Fresh strawberries with cream",
    price: "€8.00",
    rating: 4.6,
    reviews: 94,
    isFavorite: false,
    isPremium: false,
    isSeasonal: true,
    allergens: ["Dairy"],
    calories: 170,
    preparationTime: "4 min",
    availableAt: ["Berlin Central", "Pune HQ"],
    image: "🍓",
  },
  {
    id: 5,
    name: "Hazelnut Heaven",
    emoji: "🥜",
    category: "nutty",
    description: "Roasted hazelnuts with caramel",
    price: "€9.50",
    rating: 4.9,
    reviews: 67,
    isFavorite: false,
    isPremium: true,
    isSeasonal: false,
    allergens: ["Dairy", "Nuts"],
    calories: 240,
    preparationTime: "6 min",
    availableAt: ["Mumbai Downtown", "Pune HQ"],
    image: "🥜",
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
    isFavorite: true,
    isPremium: false,
    isSeasonal: false,
    allergens: ["Dairy"],
    calories: 190,
    preparationTime: "8 min",
    availableAt: ["All Stores"],
    image: "☕",
  },
  {
    id: 7,
    name: "Pumpkin Spice",
    emoji: "🎃",
    category: "seasonal",
    description: "Autumn pumpkin with warm spices",
    price: "€9.00",
    rating: 4.8,
    reviews: 45,
    isFavorite: false,
    isPremium: false,
    isSeasonal: true,
    allergens: ["Dairy", "Gluten"],
    calories: 200,
    preparationTime: "10 min",
    availableAt: ["Berlin Central"],
    image: "🎃",
  },
  {
    id: 8,
    name: "Royal Gold",
    emoji: "👑",
    category: "premium",
    description: "Saffron-infused with gold leaf",
    price: "€15.00",
    rating: 5.0,
    reviews: 23,
    isFavorite: false,
    isPremium: true,
    isSeasonal: false,
    allergens: ["Dairy"],
    calories: 180,
    preparationTime: "12 min",
    availableAt: ["Mumbai Downtown"],
    image: "👑",
  },
];

const filters = [
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
  { id: "rating", label: "Highest Rated" },
  { id: "popular", label: "Most Popular" },
  { id: "newest", label: "Newest" },
];

export default function PatronBrowsePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [favorites, setFavorites] = useState(
    flavors.filter((f) => f.isFavorite).map((f) => f.id)
  );

  const filteredFlavors = flavors.filter((flavor) => {
    const matchesSearch =
      flavor.name.toLowerCase().includes(search.toLowerCase()) ||
      flavor.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || flavor.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (flavorId: number) => {
    setFavorites((prev) =>
      prev.includes(flavorId)
        ? prev.filter((id) => id !== flavorId)
        : [...prev, flavorId]
    );
  };

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === "all") return flavors.length;
    return flavors.filter((f) => f.category === categoryId).length;
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
            Browse Flavors
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Discover our amazing collection of artisanal ice cream flavors
          </p>
        </div>

        {/* Search and Filters */}
        <div
          className="mb-8 space-y-4 animate-slide-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search flavors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700 focus:border-orange-400 dark:focus:border-orange-500"
              />
            </div>
            <Button
              variant="outline"
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950/20"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                onClick={() => setSelectedCategory(category.id)}
                className={`${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white border-0"
                    : "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950/20"
                } transition-all duration-200`}
              >
                <span className="mr-2">{category.emoji}</span>
                {category.name}
                <Badge
                  variant="secondary"
                  className={`ml-2 ${
                    selectedCategory === category.id
                      ? "bg-white/20 text-white"
                      : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                  }`}
                >
                  {getCategoryCount(category.id)}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Button
                key={filter.id}
                variant={selectedFilter === filter.id ? "default" : "outline"}
                onClick={() => setSelectedFilter(filter.id)}
                size="sm"
                className={`${
                  selectedFilter === filter.id
                    ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white border-0"
                    : "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950/20"
                } transition-all duration-200`}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div
          className="mb-6 animate-slide-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <p className="text-gray-600 dark:text-gray-300">
            Showing {filteredFlavors.length} of {flavors.length} flavors
          </p>
        </div>

        {/* Flavor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFlavors.map((flavor, index) => (
            <Link key={flavor.id} href={`/patron/browse/${flavor.id}`}>
              <Card
                className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700 hover:border-orange-400 dark:hover:border-orange-500 transition-all duration-300 hover:shadow-lg hover:shadow-orange-100 dark:hover:shadow-orange-900/20 animate-fade-in-scale cursor-pointer"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
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
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(flavor.id);
                      }}
                      className={`p-2 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors ${
                        favorites.includes(flavor.id)
                          ? "text-red-500"
                          : "text-gray-400 hover:text-red-500"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          favorites.includes(flavor.id) ? "fill-current" : ""
                        }`}
                      />
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

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {flavor.preparationTime}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {flavor.calories} cal
                    </div>
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
                      onClick={(e) => {
                        e.preventDefault();
                        // Handle order action
                      }}
                      className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white"
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* No Results */}
        {filteredFlavors.length === 0 && (
          <div className="text-center py-12 animate-fade-in-scale">
            <div className="text-6xl mb-4">🍦</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No flavors found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
