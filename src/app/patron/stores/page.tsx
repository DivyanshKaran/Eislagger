"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  MapPin,
  Star,
  Heart,
  Clock,
  Phone,
  Mail,
  Navigation,
  Map,
  List,
} from "lucide-react";

// Simple Static Map Component (no Leaflet)
function StoreMap({
  stores,
  center,
}: {
  stores: Array<{
    id: number;
    name: string;
    address: string;
    rating: number;
    reviews: number;
    status: string;
    coordinates: { lat: number; lng: number };
  }>;
  center: { lat: number; lng: number };
}) {
  const [selectedStore, setSelectedStore] = useState<number | null>(null);

  // Calculate relative positions for store markers
  const getMarkerPosition = (store: {
    coordinates: { lat: number; lng: number };
  }) => {
    const baseLat = center.lat;
    const baseLng = center.lng;
    const latDiff = store.coordinates.lat - baseLat;
    const lngDiff = store.coordinates.lng - baseLng;

    // Convert to percentage positions
    const left = 50 + lngDiff * 2000; // Adjust multiplier as needed
    const top = 50 - latDiff * 2000; // Adjust multiplier as needed

    return {
      left: `${Math.max(5, Math.min(95, left))}%`,
      top: `${Math.max(5, Math.min(95, top))}%`,
    };
  };

  return (
    <div className="h-96 w-full relative bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Map Background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Hazaribagh City Map
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {stores.length} store locations
          </p>
        </div>
      </div>

      {/* Store Markers */}
      {stores.map((store) => {
        const position = getMarkerPosition(store);
        return (
          <div
            key={store.id}
            className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-full"
            style={{ left: position.left, top: position.top }}
            onClick={() =>
              setSelectedStore(selectedStore === store.id ? null : store.id)
            }
          >
            <div className="relative">
              <div
                className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                  store.status === "open" ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>

              {/* Store Popup */}
              {selectedStore === store.id && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 min-w-[200px] z-10">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                    {store.name}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-xs mb-2">
                    {store.address}
                  </p>
                  <div className="flex items-center mb-2">
                    <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      {store.rating} ({store.reviews} reviews)
                    </span>
                  </div>
                  <Badge
                    variant={store.status === "open" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {store.status}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3">
        <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
          Store Status
        </h4>
        <div className="space-y-1">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-xs text-gray-600 dark:text-gray-300">
              Open
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-xs text-gray-600 dark:text-gray-300">
              Closed
            </span>
          </div>
        </div>
      </div>

      {/* Store Count */}
      <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 px-3 py-2">
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          {stores.length} Stores
        </span>
      </div>
    </div>
  );
}

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

// Mock data for stores page - Updated with Hazaribagh city locations
const stores = [
  {
    id: 1,
    name: "EisLager Hazaribagh Central",
    distance: "0.8 km",
    rating: 4.8,
    reviews: 234,
    status: "open",
    address: "Station Road, Hazaribagh, Jharkhand 825301, India",
    phone: "+91 6546 123456",
    email: "hazaribagh@eislager.com",
    hours: "10:00 AM - 10:00 PM",
    specialties: ["Artisan Ice Cream", "Gelato", "Sorbet"],
    features: ["WiFi", "Parking", "Wheelchair Accessible", "Delivery"],
    popularFlavors: ["Mango Tango", "Chocolate Dream", "Vanilla Bean"],
    isFavorite: true,
    image: "🏪",
    coordinates: { lat: 23.9924, lng: 85.3612 },
  },
  {
    id: 2,
    name: "EisLager Hazaribagh Market",
    distance: "1.2 km",
    rating: 4.6,
    reviews: 189,
    status: "open",
    address: "Gandhi Chowk, Hazaribagh, Jharkhand 825301, India",
    phone: "+91 6546 123457",
    email: "hazaribagh-market@eislager.com",
    hours: "11:00 AM - 11:00 PM",
    specialties: ["Kulfi", "Falooda", "Traditional Indian Ice Cream"],
    features: ["WiFi", "Parking", "Delivery", "Takeaway"],
    popularFlavors: ["Kesar Pista", "Mango Kulfi", "Rose Falooda"],
    isFavorite: false,
    image: "🏪",
    coordinates: { lat: 23.9945, lng: 85.3634 },
  },
  {
    id: 3,
    name: "EisLager Hazaribagh College",
    distance: "2.1 km",
    rating: 4.7,
    reviews: 156,
    status: "open",
    address:
      "Vinoba Bhave University Campus, Hazaribagh, Jharkhand 825301, India",
    phone: "+91 6546 123458",
    email: "hazaribagh-college@eislager.com",
    hours: "10:30 AM - 10:30 PM",
    specialties: ["Gelato", "Smoothies", "Ice Cream Cakes"],
    features: [
      "WiFi",
      "Parking",
      "Wheelchair Accessible",
      "Delivery",
      "Events",
    ],
    popularFlavors: ["Strawberry Delight", "Espresso Shot", "Hazelnut Heaven"],
    isFavorite: true,
    image: "🏪",
    coordinates: { lat: 23.9889, lng: 85.3587 },
  },
  {
    id: 4,
    name: "EisLager Hazaribagh Lake",
    distance: "3.5 km",
    rating: 4.5,
    reviews: 98,
    status: "open",
    address: "Canary Hill Lake, Hazaribagh, Jharkhand 825301, India",
    phone: "+91 6546 123459",
    email: "hazaribagh-lake@eislager.com",
    hours: "9:00 AM - 9:00 PM",
    specialties: ["Nordic Ice Cream", "Organic Options", "Lake View"],
    features: ["WiFi", "Parking", "Wheelchair Accessible", "Lake View"],
    popularFlavors: ["Lake Berry", "Mountain Mint", "Forest Vanilla"],
    isFavorite: false,
    image: "🏪",
    coordinates: { lat: 23.9856, lng: 85.3556 },
  },
  {
    id: 5,
    name: "EisLager Hazaribagh Station",
    distance: "4.2 km",
    rating: 4.9,
    reviews: 312,
    status: "open",
    address:
      "Hazaribagh Road Railway Station, Hazaribagh, Jharkhand 825301, India",
    phone: "+91 6546 123460",
    email: "hazaribagh-station@eislager.com",
    hours: "8:00 AM - 12:00 AM",
    specialties: ["Travel-Friendly", "24/7 Service", "Quick Service"],
    features: ["WiFi", "Parking", "24/7", "Travel Support", "Waiting Area"],
    popularFlavors: ["Journey Java", "Travel Treat", "Station Special"],
    isFavorite: false,
    image: "🏪",
    coordinates: { lat: 23.9901, lng: 85.3654 },
  },
];

const filters = [
  { id: "all", label: "All Stores" },
  { id: "nearby", label: "Nearby (< 2km)" },
  { id: "open", label: "Open Now" },
  { id: "delivery", label: "Delivery Available" },
  { id: "parking", label: "Parking Available" },
];

const sortOptions = [
  { id: "distance", label: "Distance" },
  { id: "rating", label: "Rating" },
  { id: "reviews", label: "Most Reviews" },
  { id: "name", label: "Name" },
];

export default function PatronStoresPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("distance");
  const [favorites, setFavorites] = useState(
    stores.filter((s) => s.isFavorite).map((s) => s.id)
  );

  // Hazaribagh city center coordinates
  const hazaribaghCenter = { lat: 23.9924, lng: 85.3612 };

  const filteredStores = stores.filter((store) => {
    let matchesFilter = true;
    if (selectedFilter === "nearby") {
      const distance = parseFloat(store.distance.replace(" km", ""));
      matchesFilter = distance < 2;
    } else if (selectedFilter === "open") {
      matchesFilter = store.status === "open";
    } else if (selectedFilter === "delivery") {
      matchesFilter = store.features.includes("Delivery");
    } else if (selectedFilter === "parking") {
      matchesFilter = store.features.includes("Parking");
    }

    return matchesFilter;
  });

  const sortedStores = [...filteredStores].sort((a, b) => {
    if (sortBy === "distance") {
      const distanceA = parseFloat(a.distance.replace(" km", ""));
      const distanceB = parseFloat(b.distance.replace(" km", ""));
      return distanceA - distanceB;
    } else if (sortBy === "rating") {
      return b.rating - a.rating;
    } else if (sortBy === "reviews") {
      return b.reviews - a.reviews;
    } else if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  const toggleFavorite = (storeId: number) => {
    setFavorites((prev) =>
      prev.includes(storeId)
        ? prev.filter((id) => id !== storeId)
        : [...prev, storeId]
    );
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case "WiFi":
        return <Map className="w-4 h-4" />;
      case "Parking":
        return <List className="w-4 h-4" />;
      case "Wheelchair Accessible":
        return <MapPin className="w-4 h-4" />;
      case "Delivery":
        return <Map className="w-4 h-4" />;
      case "Takeaway":
        return <List className="w-4 h-4" />;
      case "Events":
        return <Map className="w-4 h-4" />;
      case "24/7":
        return <Clock className="w-4 h-4" />;
      case "Tech Support":
        return <Map className="w-4 h-4" />;
      case "Meeting Rooms":
        return <Map className="w-4 h-4" />;
      case "Boat Delivery":
        return <Navigation className="w-4 h-4" />;
      case "Lake View":
        return <MapPin className="w-4 h-4" />;
      case "Travel Support":
        return <Map className="w-4 h-4" />;
      case "Waiting Area":
        return <Map className="w-4 h-4" />;
      default:
        return <Map className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50 dark:from-orange-950/20 dark:via-pink-950/20 dark:to-rose-950/20">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-300/30 to-pink-300/30 dark:from-orange-300/20 dark:to-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-rose-300/30 to-orange-300/30 dark:from-rose-300/20 dark:to-orange-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-300/20 to-rose-300/20 dark:from-pink-300/10 dark:to-rose-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-in-up">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Find Our Stores
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Discover EisLager stores in Hazaribagh, Jharkhand
          </p>
        </div>

        {/* Map Section - Always Visible */}
        <div className="mb-8 animate-slide-in-up">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                Store Locations in Hazaribagh
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <StoreMap stores={filteredStores} center={hazaribaghCenter} />
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 animate-slide-in-up">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                  {filters.map((filter) => (
                    <Button
                      key={filter.id}
                      variant={
                        selectedFilter === filter.id ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedFilter(filter.id)}
                      className={`${
                        selectedFilter === filter.id
                          ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white border-0"
                          : "bg-white/50 dark:bg-gray-700/50 border-orange-200 dark:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950/20"
                      }`}
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    Sort by:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 bg-white/50 dark:bg-gray-700/50 border border-orange-200 dark:border-orange-700 rounded-lg text-sm focus:outline-none focus:border-orange-500 dark:focus:border-orange-400"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Store List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedStores.map((store, index) => (
            <Card
              key={store.id}
              className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-700 hover:border-orange-400 dark:hover:border-orange-500 transition-all duration-300 hover:shadow-lg hover:shadow-orange-100 dark:hover:shadow-orange-900/20 animate-fade-in-scale"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16 bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/30 dark:to-pink-900/30">
                      <AvatarFallback className="text-3xl">
                        {store.image}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                          {store.name}
                        </h3>
                        <Badge
                          className={`${
                            store.status === "open"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          }`}
                        >
                          {store.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {store.distance}
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          {store.rating} ({store.reviews})
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(store.id)}
                    className={`p-2 transition-colors ${
                      favorites.includes(store.id)
                        ? "text-red-500"
                        : "text-gray-400 hover:text-red-500"
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        favorites.includes(store.id) ? "fill-current" : ""
                      }`}
                    />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {store.address}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {store.hours}
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {store.phone}
                    </div>
                  </div>
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

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Features:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {store.features.map((feature, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="text-xs bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300"
                      >
                        {getFeatureIcon(feature)}
                        <span className="ml-1">{feature}</span>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Popular Flavors:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {store.popularFlavors.map((flavor, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="text-xs bg-pink-50 dark:bg-pink-950/20 border-pink-200 dark:border-pink-700 text-pink-700 dark:text-pink-300"
                      >
                        {flavor}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-orange-100 dark:border-orange-800/30">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Mail className="w-4 h-4 mr-1" />
                      Contact
                    </Button>
                    <Button variant="outline" size="sm">
                      <Navigation className="w-4 h-4 mr-1" />
                      Directions
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white"
                  >
                    Visit Store
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {sortedStores.length === 0 && (
          <div className="text-center py-12 animate-fade-in-scale">
            <div className="text-6xl mb-4">🏪</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No stores found
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
