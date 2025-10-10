"use client";

import { useState, useEffect, useRef } from "react";
import {
  ShoppingBag,
  Heart,
  Star,
  Store,
  Gift,
  Truck,
  MapPin as LocationIcon,
  Target as TargetIcon,
  Filter,
  Download,
  RefreshCw,
  Search,
  Plus,
  Eye,
  EyeOff,
  Locate,
  Compass,
  Award,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Leaflet types
declare global {
  interface Window {
    L: any;
  }
}

let L: any;

// Patron-themed locations (ice cream stores)
const iceCreamStores = [
  {
    id: "1",
    name: "Sweet Dreams Downtown",
    type: "flagship",
    lat: 28.6139,
    lng: 77.2090,
    address: "Connaught Place, New Delhi, India",
    revenue: "₹2.5M",
    staff: 25,
    performance: "excellent",
    specialties: ["Artisan Gelato", "Custom Cones", "Seasonal Flavors"],
    status: "open",
    lastUpdated: "2024-01-15",
    rating: 4.8,
    reviews: 120
  },
  {
    id: "2", 
    name: "Choco Heaven Mall Store",
    type: "branch",
    lat: 19.0760,
    lng: 72.8777,
    address: "Phoenix Mall, Mumbai, Maharashtra",
    revenue: "₹1.8M",
    staff: 18,
    performance: "good",
    specialties: ["Premium Chocolate", "Kids Special", "Party Orders"],
    status: "open",
    lastUpdated: "2024-01-14",
    rating: 4.6,
    reviews: 98
  },
  {
    id: "3",
    name: "Garden Ice Cream Corner",
    type: "outlet",
    lat: 12.9716,
    lng: 77.5946,
    address: "Cubbon Park, Bengaluru, Karnataka",
    revenue: "₹1.2M",
    staff: 12,
    performance: "excellent",
    specialties: ["Organic Options", "Sugar Free", "Weight Watchers"],
    status: "open",
    lastUpdated: "2024-01-13",
    rating: 4.9,
    reviews: 87
  },
  {
    id: "4",
    name: "Beachy Frozen Treats",
    type: "seasonal",
    lat: 13.0827,
    lng: 80.2707,
    address: "Marina Beach, Chennai, Tamil Nadu",
    revenue: "₹950K",
    staff: 8,
    performance: "good",
    specialties: ["Cold Treats", "Beach Vibes", "Street Food"],
    status: "seasonal",
    lastUpdated: "2024-01-12",
    rating: 4.4,
    reviews: 65
  },
  {
    id: "5",
    name: "Arctic Dreams Ice Cream",
    type: "coming-soon",
    lat: 22.5726,
    lng: 88.3639,
    address: "Park Street, Kolkata, West Bengal",
    revenue: "₹0",
    staff: 0,
    performance: "pending",
    specialties: ["Planning Phase"],
    status: "construction",
    lastUpdated: "2024-01-10",
    rating: 0,
    reviews: 0
  }
];

export default function ExecutiveMapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState(["flagship", "branch", "outlet", "seasonal", "coming-soon"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationPermission, setLocationPermission] = useState<string>("prompt");
  const [mapLoading, setMapLoading] = useState(true);

  // Custom styles for patron theme
  const customStyles = `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    
    @keyframes pulse-glow {
      0% { opacity: 0.6; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.05); }
      100% { opacity: 0.6; transform: scale(1); }
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
    
    .animate-float { animation: float 3s ease-in-out infinite; }
    .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
    .animate-slide-in-up { animation: slideInUp 0.6s ease-out forwards; }
    .animate-fade-in-scale { animation: fadeInScale 0.5s ease-out forwards; }
  `;

  // Load Leaflet dynamically
  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window === "undefined") return;
      
      try {
        // Load Leaflet CSS
        const existingCSS = document.querySelector('link[href*="leaflet"]');
        if (!existingCSS) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        // Load Leaflet JS
        const { default: Leaflet } = await import("leaflet");
        L = Leaflet;
        
        // Fix marker icons
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });

        // Create ice cream themed icons
        const createIceCreamIcon = (type: string, performance: string) => {
          const getColor = (perf: string) => {
            switch (perf) {
              case "excellent": return "#10b981"; // Green
              case "good": return "#3b82f6"; // Blue  
              case "pending": return "#f59e0b"; // Yellow
              default: return "#ef4444"; // Red
            }
          };

          const getEmoji = (storeType: string) => {
            switch (storeType) {
              case "flagship": return "🍦";
              case "branch": return "🛍️";
              case "outlet": return "🏪";
              case "seasonal": return "🌊";
              case "coming-soon": return "🚧";
              default: return "❓";
            }
          };

          return L.divIcon({
            className: 'ice-cream-marker',
            html: `
              <div style="
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, ${getColor(performance)}, ${getColor(performance)}dd);
                border: 3px solid white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 6px 20px rgba(0,0,0,0.3);
                font-size: 18px;
                animation: pulse-glow 2s ease-in-out infinite;
              ">
                ${getEmoji(type)}
              </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
          });
        };

        if (mapRef.current && !map) {
          // Center on India with ice cream themed initial view
          const initialCenter: [number, number] = [20.5937, 78.9629];
          const initialZoom = 5;

          const mapInstance = L.map(mapRef.current, {
            center: initialCenter,
            zoom: initialZoom,
            scrollWheelZoom: true,
            zoomControl: true,
            attributionControl: true,
          });

          // Add tile layer with ice cream themed style
          L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
              attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              maxZoom: 19,
              subdomains: ['a', 'b', 'c'],
            }
          ).addTo(mapInstance);

          setMap(mapInstance);
          
          // Add ice cream store markers
          addIceCreamMarkersToMap(mapInstance, createIceCreamIcon);
          
          setMapLoading(false);
        }

      } catch (error) {
        console.error("Error loading Leaflet:", error);
        setMapLoading(false);
      }
    };

    loadLeaflet();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [userLocation]);

  // Get user's ice cream location 🌹
  const getMyIceCreamLocation = () => {
    if (!navigator.geolocation) {
      setLocationPermission("denied");
      return;
    }

    setLocationPermission("getting");
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(userPos);
        setLocationPermission("granted");
        
        // Add user location marker with ice cream theme
        if (map) {
          const userMarker = (L as any).marker([userPos.lat, userPos.lng], {
            icon: (L as any).divIcon({
              className: 'user-ice-cream-marker',
              html: `
                <div style="
                  width: 28px;
                  height: 28px;
                  background: linear-gradient(135deg, #ec4899, #f43f5e);
                  border: 4px solid white;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  box-shadow: 0 8px 25px rgba(236,72,153,0.4);
                  animation: pulse-glow 1s ease-in-out infinite;
                ">
                  🍧
                </div>
              `,
              iconSize: [28, 28],
              iconAnchor: [14, 14]
            })
          });

          userMarker.bindPopup(`
            <div style="padding: 16px; text-align: center; max-width: 200px;">
              <div style="font-size: 24px; margin-bottom: 8px;">😊</div>
              <h3 style="margin: 0 0 8px 0; color: #ec4899; font-size: 16px;">Your Ice Cream Journey Starts Here!</h3>
              <p style="margin: 0; font-size: 12px; color: #64748b;">
                ${userPos.lat.toFixed(4)}, ${userPos.lng.toFixed(4)}
              </p>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: #9ca3af;">
                Find nearby ice cream stores 🍦
              </p>
            </div>
          `);

          userMarker.addTo(map);
          setMarkers(prev => [...prev, userMarker]);
          
          // Pan to user location
          map.setView([userPos.lat, userPos.lng], 12);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationPermission("denied");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const addIceCreamMarkersToMap = (mapInstance: any, createIceCreamIcon: Function) => {
    // Clear existing markers
    markers.forEach((marker: any) => mapInstance.removeLayer(marker));
    
    const newMarkers: any[] = [];
    
    // Add ice cream store markers
    iceCreamStores
      .filter(store => selectedTypes.includes(store.type) && 
        store.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .forEach(store => {
        const marker = (L as any).marker([store.lat, store.lng], {
          icon: createIceCreamIcon(store.type, store.performance)
        });

        // Create delightful ice cream store popup
        const popupContent = `
          <div style="min-width: 320px; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
              <div style="
                width: 56px;
                height: 56px;
                background: linear-gradient(135deg, #ec4899, #db2777);
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                box-shadow: 0 4px 12px rgba(236,72,153,0.3);
              ">
                ${store.type === "flagship" ? "🍦" : store.type === "bridge" ? "🛍️" : 
                  store.type === "outlet" ? "🏪" : store.type === "seasonal" ? "🌊" : "🚧"}
              </div>
              <div>
                <h3 style="margin: 0; font-size: 20px; font-weight: bold; color: #1e293b; line-height: 1.2;">
                  ${store.name}
                </h3>
                <p style="margin: 4px 0 0 0; font-size: 14px; color: #ec4899; text-transform: capitalize; font-weight: 600;">
                  ${store.type.replace('-', ' ')} Store
                </p>
                <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
                  <div style="display: flex; align-items: center;">
                    ${"⭐".repeat(Math.floor(store.rating))}
                    <span style="margin-left: 4px; font-size: 12px; color: #64748b;">(${store.reviews} reviews)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
              <div style="text-align: center; padding: 16px; background: linear-gradient(135deg, #fdf2f8, #fce7f3); border-radius: 12px; border: 1px solid #f9a8d4;">
                <p style="margin: 0; font-size: 12px; color: #831843; font-weight: 600;">Monthly Revenue</p>
                <p style="margin: 8px 0 0 0; font-size: 18px; font-weight: bold; color: #be185d;">${store.revenue}</p>
              </div>
              <div style="text-align: center; padding: 16px; background: linear-gradient(135deg, #ecfdf5, #d1fae5); border-radius: 12px; border: 1px solid #86efac;">
                <p style="margin: 0; font-size: 12px; color: #14532d; font-weight: 600;">Team Size</p>
                <p style="margin: 8px 0 0 0; font-size: 18px; font-weight: bold; color: #166534;">${store.staff} 🧑‍🍳</p>
              </div>
            </div>
            
            <div style="margin-bottom: 16px;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b; font-weight: 600;">Status:</p>
              <span style="
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                ${store.status === 'open' ? 'background: linear-gradient(135deg, #d1fae5, #a7f3d0); color: #065f46; border: 1px solid #86efac;' : 
                  store.status === 'seasonal' ? 'background: linear-gradient(135deg, #fef3c7, #fde68a); color: #92400e; border: 1px solid #fbbf24;' :
                  'background: linear-gradient(135deg, #fecaca, #fca5a5); color: #991b1b; border: 1px solid #f87171;'}
              ">
                ${store.status === 'open' ? '🟢 Open Now' : 
                  store.status === 'seasonal' ? '🌊 Seasonal' : 
                  store.status === 'construction' ? '🚧 Coming Soon' : store.status.toUpperCase()}
              </span>
            </div>
            
            <div style="margin-bottom: 16px;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b; font-weight: 600;">Specialties:</p>
              <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                ${store.specialties.map((specialty: string) => 
                  `<span style="padding: 4px 8px; background: linear-gradient(135deg, #ede9fe, #ddd6fe); color: #7c3aed; border-radius: 12px; font-size: 11px; font-weight: 500;">${specialty}</span>`
                ).join('')}
              </div>
            </div>
            
            <div style="font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 12px;">
              <p style="margin: 0 0 4px 0;">📍 ${store.address}</p>
              <p style="margin: 0;">Last updated: ${store.lastUpdated}</p>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.addTo(mapInstance);

        marker.on('click', () => {
          setSelectedStore(store);
        });

        newMarkers.push(marker);
      });

    setMarkers(newMarkers);
  };

  const updateMarkers = () => {
    if (map) {
      addIceCreamMarkersToMap(map, () => {});
    }
  };

  useEffect(() => {
    if (map) {
      updateMarkers();
    }
  }, [selectedTypes, searchTerm]);

  const toggleStoreType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case "excellent": return "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/20 dark:text-emerald-400";
      case "good": return "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400";
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400";
      default: return "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/20 dark:text-red-400";
    }
  };

  const getStoreIcon = (type: string) => {
    switch (type) {
      case "flagship": return Store;
      case "branch": return ShoppingBag;
      case "outlet": return Gift;
      case "seasonal": return TargetIcon;
      default: return Star;
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-pink-900/20">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      
      {/* Map Container - Full Content Area */}
      <div className="absolute inset-0 z-0">
        <div ref={mapRef} className="h-full w-full"></div>
        
        {/* Ice Cream Loading Overlay */}
        {mapLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/90 via-pink-100/90 to-rose-100/90 dark:from-slate-900/90 dark:via-purple-900/90 dark:to-pink-900/90 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-float">🍦</div>
              <p className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-2">Sweet Map Loading...</p>
              <p className="text-sm text-purple-600 dark:text-purple-400">Finding ice cream stores near you</p>
              <div className="w-12 h-2 bg-pink-200 dark:bg-pink-800 rounded-full mx-auto mt-4 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse-glow"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Minimal Top Controls */}
      <div className="absolute top-4 left-4 z-20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 rounded-2xl flex items-center justify-center animate-pulse-glow">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-purple-900 dark:text-white flex items-center gap-2">
              🍦 Store Locator
            </h1>
            <p className="text-sm text-purple-600 dark:text-purple-400">Find your favorite stores!</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="absolute top-4 left-64 z-20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-600" />
          <Input
            type="text"
            placeholder="Search stores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-80 bg-white/90 dark:bg-slate-800/90 border-purple-300 dark:border-purple-700 rounded-xl text-purple-900 dark:text-white backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Location Button */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          onClick={getMyIceCreamLocation}
          disabled={locationPermission === "getting"}
          className={`rounded-xl transition-all ${
            locationPermission === "granted" 
              ? "bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse-glow" 
              : locationPermission === "denied"
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          }`}
        >
          {locationPermission === "getting" ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Locate className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Filter Toggle Button */}
      <div className="absolute top-16 right-4 z-20">
        <Button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-white/90 hover:bg-purple-100 dark:bg-slate-800/90 dark:hover:bg-purple-900/90 text-purple-900 dark:text-purple-200 border-purple-300 dark:border-purple-700 rounded-xl transition-all backdrop-blur-sm"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Store Type Filter Panel - Bottom Right */}
      {showFilters && (
        <div className="absolute bottom-4 right-4 z-20 w-80 bg-gradient-to-br from-purple-100/95 via-pink-100/95 to-rose-100/95 dark:from-purple-900/95 dark:via-pink-900/95 dark:to-slate-900/95 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-300/50 dark:border-purple-800/50 p-4 animate-slide-in-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-purple-900 dark:text-white flex items-center gap-2">
              🏪 Store Types
            </h3>
            <Button
              onClick={() => setShowFilters(false)}
              size="sm"
              className="bg-white/80 hover:bg-purple-100 dark:bg-slate-800/80 dark:hover:bg-purple-900/80 text-purple-900 dark:text-purple-200 border-purple-300 dark:border-purple-700"
            >
              ×
            </Button>
          </div>
          <div className="space-y-3">
            {["flagship", "branch", "outlet", "seasonal", "coming-soon"].map((type) => {
              const Icon = getStoreIcon(type);
              const getStoreLabel = (storeType: string) => {
                switch (storeType) {
                  case "flagship": return "🍦 Flagship Stores";
                  case "branch": return "🛍️ Mall Branches";
                  case "outlet": return "🏪 Quick Outlets";
                  case "seasonal": return "🌊 Beach Stores";
                  case "coming-soon": return "🚧 Coming Soon";
                  default: return storeType;
                }
              };
              
              return (
                <label key={type} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 dark:hover:bg-slate-700/50 cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => toggleStoreType(type)}
                    className="w-4 h-4 text-purple-600 rounded border-purple-400 focus:ring-purple-500"
                  />
                  <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-semibold text-purple-900 dark:text-white">
                    {getStoreLabel(type)}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Store Details Panel */}
      {selectedStore && (
        <div className={`absolute z-20 w-96 bg-gradient-to-br from-purple-100/95 via-pink-100/95 to-rose-100/95 dark:from-purple-900/95 dark:via-pink-900/95 dark:to-slate-900/95 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-300/50 dark:border-purple-800/50 p-6 animate-slide-in-up ${showFilters ? 'bottom-4 right-96' : 'bottom-4 right-4'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 rounded-2xl flex items-center justify-center animate-pulse-glow">
                <span className="text-white text-xl">
                  {selectedStore.type === "flagship" ? "🍦" : selectedStore.type === "branch" ? "🛍️" : 
                   selectedStore.type === "outlet" ? "🏪" : selectedStore.type === "seasonal" ? "🌊" : "🚧"}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-purple-900 dark:text-white">{selectedStore.name}</h3>
                <p className="text-sm text-purple-600 dark:text-purple-400 capitalize">{selectedStore.type} Store</p>
              </div>
            </div>
            <Button
              onClick={() => setSelectedStore(null)}
              size="sm"
              className="bg-white/80 hover:bg-purple-100 dark:bg-slate-800/80 dark:hover:bg-purple-900/80 text-purple-900 dark:text-purple-200 border-purple-300 dark:border-purple-700"
            >
              <EyeOff className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-700 dark:to-slate-700 rounded-xl p-4 text-center">
              <p className="text-xs text-purple-700 dark:text-purple-300 mb-1">Monthly Revenue</p>
              <p className="text-lg font-bold text-purple-900 dark:text-white">{selectedStore.revenue}</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-slate-700 dark:to-slate-700 rounded-xl p-4 text-center">
              <p className="text-xs text-pink-700 dark:text-pink-300 mb-1">Team Size</p>
              <p className="text-lg font-bold text-pink-900 dark:text-white">{selectedStore.staff} 🧑‍🍳</p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-purple-900 dark:text-white">Rating & Performance</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getPerformanceColor(selectedStore.performance)}`}>
                {selectedStore.performance.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex text-yellow-400">
                {"⭐".repeat(Math.floor(selectedStore.rating))}
              </div>
              <span className="text-sm text-purple-700 dark:text-purple-300">
                {selectedStore.rating} ({selectedStore.reviews} reviews)
              </span>
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-400">
              Last updated: {selectedStore.lastUpdated}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-xs text-purple-700 dark:text-purple-300 mb-2 font-semibold">Specialties:</p>
            <div className="flex flex-wrap gap-2">
              {selectedStore.specialties.map((specialty: string) => (
                <span key={specialty} className="px-3 py-1 bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-900/20 dark:to-pink-900/20 text-purple-800 dark:text-purple-300 text-xs rounded-full font-medium">
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          <div className="text-xs text-purple-600 dark:text-purple-400 bg-white/50 dark:bg-slate-700/50 rounded-lg p-3">
            <p>📍 {selectedStore.address}</p>
          </div>
        </div>
      )}

      {/* Sweet Stats Legend */}
      <div className="absolute bottom-4 left-4 z-20 bg-gradient-to-br from-purple-100/95 via-pink-100/95 to-rose-100/95 dark:from-purple-900/95 dark:via-pink-900/95 dark:to-slate-900/95 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-300/50 dark:border-purple-800/50 p-4 animate-slide-in-up">
        <div className="flex items-center gap-3 mb-3">
          <ShoppingBag className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h4 className="text-sm font-bold text-purple-900 dark:text-white">🍦 Store Network</h4>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-purple-700 dark:text-purple-300">Open Stores:</span>
            <span className="text-purple-900 dark:text-white font-bold">{iceCreamStores.filter(s => s.status === 'open' || s.status === 'seasonal').length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-purple-700 dark:text-purple-300">Total Staff:</span>
            <span className="text-purple-900 dark:text-white font-bold">{iceCreamStores.reduce((sum, s) => sum + s.staff, 0)} 🧑‍🍳</span>
          </div>
          <div className="flex justify-between">
            <span className="text-purple-700 dark:text-purple-300">Your Location:</span>
            <span className="text-purple-900 dark:text-white font-bold">
              {locationPermission === "granted" ? "🍧 Found!" : locationPermission === "denied" ? "❌ Hidden" : "📍 Locate"}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}