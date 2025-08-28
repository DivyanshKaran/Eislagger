"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Bell,
  User,
  MapPin,
  Factory,
  Truck,
  Store,
  Filter,
  ChevronDown,
  Layers,
  Navigation,
  BarChart3,
  Activity,
  Maximize2,
  Minimize2,
  Map,
  Satellite,
  Cloud,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

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
  
  .leaflet-container {
    border-radius: 1rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  
  .leaflet-popup-content-wrapper {
    border-radius: 1rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }
  
  .leaflet-popup-content {
    margin: 1rem;
    font-family: inherit;
  }
  
  .leaflet-control-zoom {
    border-radius: 1rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
  
  .leaflet-control-zoom a {
    border-radius: 0.5rem;
    margin: 2px;
  }
`;

// Mock data for locations
const storeLocations = [
  {
    id: 1,
    name: "EisLager Berlin Central",
    type: "store",
    coordinates: [52.52, 13.405],
    address: "Unter den Linden 1, 10117 Berlin, Germany",
    status: "active",
    revenue: "€2.1M",
    orders: 15420,
    rating: 4.8,
    employees: 12,
    specialties: ["Artisan Ice Cream", "Gelato", "Sorbet"],
    hours: "8:00 AM - 10:00 PM",
    phone: "+49 30 12345678",
    email: "berlin@eislagger.com",
    manager: "Anna Schmidt",
    lastOrder: "2 minutes ago",
    deliveryRadius: 15,
    popularFlavors: ["Mango Tango", "Chocolate Dream", "Vanilla Bean"],
  },
  {
    id: 2,
    name: "EisLager Mumbai Downtown",
    type: "store",
    coordinates: [19.076, 72.8777],
    address: "Colaba Causeway, Mumbai, Maharashtra 400001, India",
    status: "active",
    revenue: "₹1.8M",
    orders: 12850,
    rating: 4.6,
    employees: 15,
    specialties: ["Kulfi", "Falooda", "Ice Cream"],
    hours: "9:00 AM - 11:00 PM",
    phone: "+91 22 12345678",
    email: "mumbai@eislagger.com",
    manager: "Rajesh Kumar",
    lastOrder: "5 minutes ago",
    deliveryRadius: 12,
    popularFlavors: ["Kesar Pista", "Mango", "Chocolate"],
  },
  {
    id: 3,
    name: "EisLager Pune HQ",
    type: "store",
    coordinates: [18.5204, 73.8567],
    address: "FC Road, Pune, Maharashtra 411005, India",
    status: "active",
    revenue: "₹1.5M",
    orders: 9850,
    rating: 4.7,
    employees: 10,
    specialties: ["Gelato", "Ice Cream", "Smoothies"],
    hours: "8:30 AM - 10:30 PM",
    phone: "+91 20 12345678",
    email: "pune@eislagger.com",
    manager: "Priya Sharma",
    lastOrder: "1 minute ago",
    deliveryRadius: 10,
    popularFlavors: ["Strawberry", "Vanilla", "Coffee"],
  },
  {
    id: 4,
    name: "EisLager New York",
    type: "store",
    coordinates: [40.7128, -74.006],
    address: "Times Square, New York, NY 10036, USA",
    status: "active",
    revenue: "$2.5M",
    orders: 18200,
    rating: 4.9,
    employees: 18,
    specialties: ["Artisan Ice Cream", "Frozen Yogurt", "Sorbet"],
    hours: "7:00 AM - 11:00 PM",
    phone: "+1 212 1234567",
    email: "newyork@eislagger.com",
    manager: "Michael Johnson",
    lastOrder: "3 minutes ago",
    deliveryRadius: 20,
    popularFlavors: ["Rocky Road", "Mint Chocolate", "Cookie Dough"],
  },
  {
    id: 5,
    name: "EisLager London",
    type: "store",
    coordinates: [51.5074, -0.1278],
    address: "Oxford Street, London W1D 1BS, UK",
    status: "active",
    revenue: "£1.9M",
    orders: 14200,
    rating: 4.7,
    employees: 14,
    specialties: ["Gelato", "Ice Cream", "Frozen Desserts"],
    hours: "8:00 AM - 10:00 PM",
    phone: "+44 20 12345678",
    email: "london@eislagger.com",
    manager: "Emma Wilson",
    lastOrder: "4 minutes ago",
    deliveryRadius: 18,
    popularFlavors: ["Salted Caramel", "Vanilla", "Strawberry"],
  },
];

const factoryLocations = [
  {
    id: 1,
    name: "EisLager Berlin Factory",
    type: "factory",
    coordinates: [52.52, 13.405],
    address: "Industriepark 15, 10115 Berlin, Germany",
    status: "operational",
    production: "50,000 units/day",
    capacity: "85%",
    employees: 150,
    manager: "Hans Mueller",
    phone: "+49 30 87654321",
    email: "factory.berlin@eislagger.com",
    specialties: ["Gelato", "Sorbet", "Ice Cream"],
    lastProduction: "2 hours ago",
    qualityScore: 98.5,
    efficiency: 92.3,
  },
  {
    id: 2,
    name: "EisLager Mumbai Factory",
    type: "factory",
    coordinates: [19.076, 72.8777],
    address: "Industrial Area, Mumbai, Maharashtra 400001, India",
    status: "operational",
    production: "45,000 units/day",
    capacity: "78%",
    employees: 200,
    manager: "Amit Patel",
    phone: "+91 22 87654321",
    email: "factory.mumbai@eislagger.com",
    specialties: ["Kulfi", "Falooda", "Ice Cream"],
    lastProduction: "1 hour ago",
    qualityScore: 97.8,
    efficiency: 89.5,
  },
  {
    id: 3,
    name: "EisLager Pune Factory",
    type: "factory",
    coordinates: [18.5204, 73.8567],
    address: "Industrial Zone, Pune, Maharashtra 411005, India",
    status: "operational",
    production: "35,000 units/day",
    capacity: "72%",
    employees: 120,
    manager: "Suresh Deshmukh",
    phone: "+91 20 87654321",
    email: "factory.pune@eislagger.com",
    specialties: ["Gelato", "Ice Cream", "Frozen Yogurt"],
    lastProduction: "3 hours ago",
    qualityScore: 96.9,
    efficiency: 87.2,
  },
];

const deliveryRoutes = [
  {
    id: 1,
    name: "Berlin Central Route",
    start: "EisLager Berlin Factory",
    end: "EisLager Berlin Central",
    coordinates: [
      [52.52, 13.405],
      [52.52, 13.405],
    ],
    status: "in-transit",
    driver: "Klaus Weber",
    vehicle: "Truck-001",
    estimatedArrival: "30 minutes",
    currentLocation: [52.52, 13.405],
    items: ["Mango Tango", "Chocolate Dream", "Vanilla Bean"],
    temperature: "2.5°C",
    humidity: "85%",
  },
  {
    id: 2,
    name: "Mumbai Downtown Route",
    start: "EisLager Mumbai Factory",
    end: "EisLager Mumbai Downtown",
    coordinates: [
      [19.076, 72.8777],
      [19.076, 72.8777],
    ],
    status: "delivered",
    driver: "Ramesh Singh",
    vehicle: "Truck-002",
    estimatedArrival: "Delivered",
    currentLocation: [19.076, 72.8777],
    items: ["Kesar Pista", "Mango", "Chocolate"],
    temperature: "3.2°C",
    humidity: "90%",
  },
];

const mapLayers = [
  { id: "stores", label: "Stores", icon: Store, visible: true },
  { id: "factories", label: "Factories", icon: Factory, visible: true },
  { id: "deliveries", label: "Deliveries", icon: Truck, visible: true },
  { id: "traffic", label: "Traffic", icon: Activity, visible: false },
  { id: "weather", label: "Weather", icon: Cloud, visible: false },
];

export default function ExecutiveMapPage() {
  const [map, setMap] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [activeLayers, setActiveLayers] = useState<string[]>([
    "stores",
    "factories",
    "deliveries",
  ]);
  const [mapType, setMapType] = useState("street");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMap = async () => {
      if (typeof window !== "undefined") {
        const L = await import("leaflet");
        await import("leaflet.markercluster");

        // Set up map
        const mapInstance = L.map(mapRef.current!).setView([20, 0], 2);

        // Add tile layer based on map type
        const tileLayer = L.tileLayer(
          mapType === "satellite"
            ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution: "© OpenStreetMap contributors",
            maxZoom: 19,
          }
        );
        tileLayer.addTo(mapInstance);

        // Add markers for stores
        if (activeLayers.includes("stores")) {
          storeLocations.forEach((store) => {
            const marker = L.marker(store.coordinates as [number, number])
              .bindPopup(`
                <div class="p-4">
                  <h3 class="font-bold text-lg mb-2">${store.name}</h3>
                  <p class="text-sm text-gray-600 mb-2">${store.address}</p>
                  <div class="flex items-center gap-2 mb-2">
                    <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">${
                      store.status
                    }</span>
                    <span class="text-sm font-medium">${store.revenue}</span>
                  </div>
                  <p class="text-sm mb-2">Orders: ${store.orders.toLocaleString()}</p>
                  <p class="text-sm mb-2">Rating: ${store.rating}/5 ⭐</p>
                  <div class="flex gap-2">
                    <button class="px-3 py-1 bg-blue-500 text-white rounded text-xs">View Details</button>
                    <button class="px-3 py-1 bg-gray-500 text-white rounded text-xs">Directions</button>
                  </div>
                </div>
              `);
            marker.addTo(mapInstance);
          });
        }

        // Add markers for factories
        if (activeLayers.includes("factories")) {
          factoryLocations.forEach((factory) => {
            const marker = L.marker(factory.coordinates as [number, number], {
              icon: L.divIcon({
                className: "custom-div-icon",
                html: `<div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">🏭</div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 16],
              }),
            }).bindPopup(`
                <div class="p-4">
                  <h3 class="font-bold text-lg mb-2">${factory.name}</h3>
                  <p class="text-sm text-gray-600 mb-2">${factory.address}</p>
                  <div class="flex items-center gap-2 mb-2">
                    <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">${factory.status}</span>
                    <span class="text-sm font-medium">${factory.production}</span>
                  </div>
                  <p class="text-sm mb-2">Capacity: ${factory.capacity}</p>
                  <p class="text-sm mb-2">Quality Score: ${factory.qualityScore}%</p>
                  <div class="flex gap-2">
                    <button class="px-3 py-1 bg-blue-500 text-white rounded text-xs">View Details</button>
                    <button class="px-3 py-1 bg-gray-500 text-white rounded text-xs">Production Data</button>
                  </div>
                </div>
              `);
            marker.addTo(mapInstance);
          });
        }

        // Add delivery routes
        if (activeLayers.includes("deliveries")) {
          deliveryRoutes.forEach((route) => {
            const polyline = L.polyline(
              route.coordinates as [number, number][],
              {
                color: route.status === "in-transit" ? "orange" : "green",
                weight: 4,
                opacity: 0.8,
              }
            ).bindPopup(`
                <div class="p-4">
                  <h3 class="font-bold text-lg mb-2">${route.name}</h3>
                  <p class="text-sm text-gray-600 mb-2">${route.start} → ${
              route.end
            }</p>
                  <div class="flex items-center gap-2 mb-2">
                    <span class="px-2 py-1 ${
                      route.status === "in-transit"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-green-100 text-green-800"
                    } rounded-full text-xs">${route.status}</span>
                    <span class="text-sm font-medium">${
                      route.estimatedArrival
                    }</span>
                  </div>
                  <p class="text-sm mb-2">Driver: ${route.driver}</p>
                  <p class="text-sm mb-2">Vehicle: ${route.vehicle}</p>
                  <p class="text-sm mb-2">Temperature: ${route.temperature}</p>
                  <div class="flex gap-2">
                    <button class="px-3 py-1 bg-blue-500 text-white rounded text-xs">Track Route</button>
                    <button class="px-3 py-1 bg-gray-500 text-white rounded text-xs">Contact Driver</button>
                  </div>
                </div>
              `);
            polyline.addTo(mapInstance);
          });
        }

        setMap(mapInstance);
      }
    };

    loadMap();
  }, [activeLayers, mapType]);

  const toggleLayer = (layerId: string) => {
    setActiveLayers((prev) =>
      prev.includes(layerId)
        ? prev.filter((id) => id !== layerId)
        : [...prev, layerId]
    );
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Stunning Glassy Top Navigation */}
        <header className="sticky top-0 z-30 bg-white/70 dark:bg-slate-800/70 border-b border-pink-200/50 dark:border-slate-700/50 px-8 py-6 flex items-center justify-between backdrop-blur-xl shadow-lg">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🗺️</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="font-bold text-2xl bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400 bg-clip-text text-transparent">
                Global Operations Map
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Real-time location tracking & analytics
              </p>
            </div>
          </div>

          <div className="flex-1 flex justify-center max-w-2xl mx-8">
            <div className="relative w-full group">
              <Input
                type="text"
                placeholder="Search locations, routes, or coordinates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-2xl pl-12 pr-4 py-3 bg-white/70 dark:bg-slate-800/70 shadow-lg border-0 focus:ring-2 focus:ring-pink-500/50 transition-all duration-300 group-hover:shadow-xl"
              />
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="hover:bg-pink-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  <Layers className="w-4 h-4 mr-2" />
                  Map Type
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Map Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setMapType("street")}>
                  <Map className="w-4 h-4 mr-2" />
                  Street View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMapType("satellite")}>
                  <Satellite className="w-4 h-4 mr-2" />
                  Satellite View
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={toggleFullscreen}
              variant="ghost"
              size="icon"
              className="hover:bg-pink-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-300"
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-pink-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-300"
            >
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </Button>

            <Avatar className="ml-2 ring-2 ring-pink-200 dark:ring-slate-700 hover:ring-pink-400 transition-all duration-300">
              <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white">
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Map Controls */}
        <div className="sticky top-[5.5rem] z-20 flex justify-center w-full px-6 py-4">
          <div className="flex gap-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-xl px-6 py-3 border border-pink-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Layers className="w-4 h-4" />
              <span className="text-sm font-medium">Layers:</span>
            </div>
            {mapLayers.map((layer) => {
              const IconComponent = layer.icon;
              return (
                <Button
                  key={layer.id}
                  variant={
                    activeLayers.includes(layer.id) ? "default" : "ghost"
                  }
                  size="sm"
                  onClick={() => toggleLayer(layer.id)}
                  className={`rounded-xl px-4 py-2 text-sm transition-all duration-300 flex items-center gap-2 ${
                    activeLayers.includes(layer.id)
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                      : "hover:bg-pink-100 dark:hover:bg-slate-700"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {layer.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Main Map Area */}
        <div className="flex-1 relative">
          {/* Map Container */}
          <div
            ref={mapRef}
            className={`w-full h-full ${
              isFullscreen ? "fixed inset-0 z-50" : ""
            }`}
          />

          {/* Map Overlay Controls */}
          {!isFullscreen && (
            <div className="absolute top-4 right-4 z-40 space-y-2">
              <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-pink-200/50 dark:border-slate-700/50 shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-slate-800 dark:text-white">
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400">
                      Stores:
                    </span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      {storeLocations.length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400">
                      Factories:
                    </span>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                      {factoryLocations.length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400">
                      Active Routes:
                    </span>
                    <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
                      {
                        deliveryRoutes.filter((r) => r.status === "in-transit")
                          .length
                      }
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Location Details Panel */}
          {selectedLocation && !isFullscreen && (
            <div className="absolute bottom-4 left-4 z-40 w-96">
              <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-pink-200/50 dark:border-slate-700/50 shadow-xl">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">
                      {selectedLocation.name}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedLocation(null)}
                      className="hover:bg-pink-100 dark:hover:bg-slate-700 rounded-xl"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {selectedLocation.address}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`${
                        selectedLocation.status === "active" ||
                        selectedLocation.status === "operational"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                      }`}
                    >
                      {selectedLocation.status}
                    </Badge>
                    {selectedLocation.revenue && (
                      <span className="text-sm font-medium text-slate-800 dark:text-white">
                        {selectedLocation.revenue}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Directions
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-xl">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
