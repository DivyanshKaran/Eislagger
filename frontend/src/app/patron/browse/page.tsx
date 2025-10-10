"use client";

import { useState ,useEffect} from "react";

import Link from "next/link";

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
  IceCream,
  Menu,
  X,
  Shield,
  Truck
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFlavors, useSearchFlavors } from "@/hooks/useFlavors";
import { Skeleton } from "@/components/ui/skeleton";
import type { Flavor } from "@/types/models";

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
  const [favorites, setFavorites] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  // Use the new hooks for data fetching
  const { data: flavorsResponse, isLoading: loading, error } = useFlavors({ 
    available: true,
    page: 1,
    limit: 100
  });
  const flavors = flavorsResponse?.data || [];
  const { data: searchResultsResponse } = useSearchFlavors(search);
  const searchResults = searchResultsResponse?.data || [];

  // Use search results if there's a search term, otherwise use all flavors
  const displayFlavors = search ? searchResults : flavors;

  // Generate categories from flavors data
  const categories = [
    { id: "all", name: "All Flavors", emoji: "🍦", count: flavors.length },
    ...Array.from(new Set(flavors.map(f => f.category))).map(category => ({
      id: category.toLowerCase(),
      name: category,
      emoji: "🍦",
      count: flavors.filter(f => f.category === category).length
    }))
  ];

  const filteredFlavors = displayFlavors.filter((flavor) => {
    const matchesSearch =
      flavor.name.toLowerCase().includes(search.toLowerCase()) ||
      (flavor.description && flavor.description.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory =
      selectedCategory === "all" || flavor.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (flavorId: string) => {
    setFavorites((prev) =>
      prev.includes(flavorId)
        ? prev.filter((id) => id !== flavorId)
        : [...prev, flavorId],
    );
  };

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === "all") return flavors.length;
    return flavors.filter((f) => f.category.toLowerCase() === categoryId).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-pink-50 dark:from-orange-950/20 dark:via-gray-950 dark:to-rose-950/20">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Header skeleton */}
            <div className="text-center space-y-4">
              <Skeleton className="h-12 w-96 mx-auto" />
              <Skeleton className="h-6 w-64 mx-auto" />
            </div>
            
            {/* Search and filters skeleton */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-24" />
            </div>
            
            {/* Categories skeleton */}
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-20" />
              ))}
            </div>
            
            {/* Flavor grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-pink-50 dark:from-orange-950/20 dark:via-gray-950 dark:to-rose-950/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">😞</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Oops! Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-400">{error?.message || 'An error occurred'}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-gradient-to-r from-orange-400 to-pink-500 text-white hover:from-orange-500 hover:to-pink-600"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-pink-50 dark:from-orange-950/20 dark:via-gray-950 dark:to-rose-950/20">
      {/* Navbar */}
      <header className="sticky top-0 z-30 border-b border-orange-100/60 dark:border-orange-900/40 bg-white/70 dark:bg-gray-900/60 backdrop-blur supports-[backdrop-filter]:bg-white/50">
        <nav className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-orange-400 to-pink-500 text-white shadow-sm">
                <IceCream className="h-5 w-5" />
              </span>
              <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">EisLagger</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/patron/browse" className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Browse</Link>
              <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">About</Link>
              <Link href="/contact" className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Contact</Link>
              <Button className="bg-gradient-to-r from-orange-400 to-pink-500 text-white hover:from-orange-500 hover:to-pink-600">Get Started</Button>
            </div>
            <button aria-label="Toggle Menu" onClick={() => setMenuOpen((o) => !o)} className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-orange-50 dark:text-gray-200 dark:hover:bg-orange-900/20">
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
          {menuOpen && (
            <div className="md:hidden pb-4">
              <div className="grid gap-2">
                <Link href="/patron/browse" className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-orange-50 dark:text-gray-200 dark:hover:bg-orange-900/20">Browse</Link>
                <Link href="/about" className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-orange-50 dark:text-gray-200 dark:hover:bg-orange-900/20">About</Link>
                <Link href="/contact" className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-orange-50 dark:text-gray-200 dark:hover:bg-orange-900/20">Contact</Link>
                <Button className="mt-1 bg-gradient-to-r from-orange-400 to-pink-500 text-white hover:from-orange-500 hover:to-pink-600">Get Started</Button>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700 dark:border-orange-900/40 dark:bg-orange-900/20 dark:text-orange-300">New • Handcrafted flavors added weekly</div>
              <h1 className="mt-4 text-4xl/tight font-extrabold tracking-tight text-gray-900 md:text-5xl dark:text-white">Discover artisan ice cream crafted for moments that matter</h1>
              <p className="mt-4 text-base text-gray-600 md:text-lg dark:text-gray-300">Browse, compare, and order small-batch flavors from top creameries near you. Seasonal drops, premium picks, and classics—all in one place.</p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search flavors (e.g., pistachio, mocha)"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 h-11 bg-white dark:bg-gray-800 border-orange-200 dark:border-orange-900 focus-visible:ring-orange-300"
                  />
                </div>
                <Button className="h-11 bg-gradient-to-r from-orange-400 to-pink-500 text-white hover:from-orange-500 hover:to-pink-600">Search</Button>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1"><Shield className="h-4 w-4 text-orange-500" />Trusted vendors</div>
                <div className="flex items-center gap-1"><Truck className="h-4 w-4 text-pink-500" />Fast pickup</div>
              </div>
            </div>
            <div className="relative">
              <div className="mx-auto grid max-w-md grid-cols-2 gap-4 md:max-w-none">
                {filteredFlavors.slice(0,4).map((f) => (
                  <Card key={f.id} className="border-orange-200/60 dark:border-orange-900/40 bg-white/90 dark:bg-gray-900/50">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/30 dark:to-pink-900/30">
                          <AvatarFallback className="text-lg">{f.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">{f.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
                        <span>{f.category}</span>
                        <span className="font-semibold text-gray-900 dark:text-white">€{f.price}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - 3 column */}
      <section className="border-y border-orange-100/60 dark:border-orange-900/40 bg-white/70 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Curated Selection</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Only the most loved and trending flavors from trusted makers.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300">
                <Shield className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Quality First</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Transparent ingredients, clear nutrition, and verified vendors.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300">
                <Truck className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Convenient Pickup</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Order online and grab at a nearby store when ready.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse Controls */}
      <div className="container mx-auto px-4 py-10">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Browse Flavors</h2>
          <p className="text-gray-600 dark:text-gray-300">Filter and sort to find your next favorite.</p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search flavors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white dark:bg-gray-800 border-orange-200 dark:border-orange-900 focus-visible:ring-orange-300"
              />
            </div>
            <Button
              variant="outline"
              className="border-orange-200 dark:border-orange-900 hover:bg-orange-50 dark:hover:bg-orange-900/20"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`h-9 rounded-full ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white border-0"
                    : "bg-white dark:bg-gray-900 border-orange-200 dark:border-orange-900 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                }`}
              >
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
                    : "bg-white dark:bg-gray-900 border-orange-200 dark:border-orange-900 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                }`}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            Showing {filteredFlavors.length} of {flavors.length} flavors
          </p>
        </div>

        {/* Flavor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFlavors.map((flavor) => (
            <Link key={flavor.id} href={`/patron/browse/${flavor.id}`}>
              <Card className="group bg-white dark:bg-gray-900 border border-orange-200/70 dark:border-orange-900/40 hover:shadow-lg hover:shadow-orange-100/50 dark:hover:shadow-black/30 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12 bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/30 dark:to-pink-900/30">
                        <AvatarFallback className="text-2xl">
                          {flavor.name.charAt(0)}
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
                              5.0
                            </span>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            (10)
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(flavor.id.toString());
                      }}
                      className={`p-2 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors ${
                        favorites.includes(flavor.id.toString())
                          ? "text-red-500"
                          : "text-gray-400 hover:text-red-500"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          favorites.includes(flavor.id.toString()) ? "fill-current" : ""
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
                      {false && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                          <Award className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                      {false && (
                        <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Seasonal
                        </Badge>
                      )}
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      €{flavor.price}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      5 min
                    </div>
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {flavor.nutritionalInfo?.calories || 0} cal
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        5 stores
                      </span>
                    </div>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
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
          <div className="text-center py-12">
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

      {/* Footer */}
      <footer className="border-t border-orange-100/60 dark:border-orange-900/40">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <IceCream className="h-5 w-5 text-orange-500" />
              <span className="font-semibold">EisLagger</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">© {new Date().getFullYear()} EisLagger. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
