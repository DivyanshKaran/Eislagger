"use client";

import { useState, useEffect, useRef } from "react";
import {
  MapPin as LocationIcon,
  Search,
  Filter,
  Star,
  Clock,
  Phone,
  Navigation,
  Heart,
  Share2,
  Route,
  Target,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useStoreData } from "@/hooks/useStoreData";

// Leaflet types
declare global {
  interface Window {
    L: any;
  }
}

let L: any;

// Enhanced store data with more details
const enhancedStores = [
  {
    id: "1",
    name: "Sweet Dreams Downtown",
    type: "flagship",
    lat: 28.6139,
    lng: 77.209,
    address: "Connaught Place, New Delhi, India",
    rating: 4.8,
    reviews: 120,
    phone: "+91 11 2345 6789",
    hours: "9:00 AM - 11:00 PM",
    specialties: ["Artisan Gelato", "Custom Cones", "Seasonal Flavors"],
    features: ["WiFi", "Parking", "Outdoor Seating", "Takeaway"],
    distance: "0.8 km",
    estimatedTime: "3 min drive",
    isOpen: true,
    isFavorite: false,
    image: "/api/placeholder/300/200",
  },
  {
    id: "2",
    name: "Chill Corner Mall Store",
    type: "branch",
    lat: 28.6358,
    lng: 77.2245,
    address: "Select Citywalk Mall, Saket, New Delhi",
    rating: 4.6,
    reviews: 98,
    phone: "+91 11 2345 6790",
    hours: "10:00 AM - 10:00 PM",
    specialties: ["Premium Chocolate", "Kids Special", "Party Orders"],
    features: ["Mall Location", "Family Friendly", "Birthday Parties"],
    distance: "2.1 km",
    estimatedTime: "8 min drive",
    isOpen: true,
    isFavorite: true,
    image: "/api/placeholder/300/200",
  },
  {
    id: "3",
    name: "Garden Fresh Ice Cream",
    type: "outlet",
    lat: 28.7041,
    lng: 77.1025,
    address: "Lodi Garden Park Entrance, New Delhi",
    rating: 4.9,
    reviews: 87,
    phone: "+91 11 2345 6791",
    hours: "6:00 AM - 9:00 PM",
    specialties: ["Organic Options", "Sugar Free", "Weight Watchers"],
    features: ["Park Location", "Healthy Options", "Outdoor Seating"],
    distance: "3.5 km",
    estimatedTime: "12 min drive",
    isOpen: true,
    isFavorite: false,
    image: "/api/placeholder/300/200",
  },
  {
    id: "4",
    name: "Beachy Frozen Treats",
    type: "seasonal",
    lat: 28.5829,
    lng: 77.2090,
    address: "India Gate Area, New Delhi",
    rating: 4.4,
    reviews: 65,
    phone: "+91 11 2345 6792",
    hours: "Seasonal Hours",
    specialties: ["Cold Treats", "Beach Vibes", "Street Food"],
    features: ["Seasonal", "Tourist Spot", "Quick Service"],
    distance: "1.2 km",
    estimatedTime: "5 min drive",
    isOpen: false,
    isFavorite: false,
    image: "/api/placeholder/300/200",
  },
];

export default function PatronStoresPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState(["flagship", "branch", "outlet", "seasonal"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationPermission, setLocationPermission] = useState<string>("prompt");
  const [mapLoading, setMapLoading] = useState(true);
  const [showStoreList, setShowStoreList] = useState(true);

  // Custom styles for animations
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
    
    .animate-float { animation: float 3s ease-in-out infinite; }
    .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
    .animate-slide-in-up { animation: slideInUp 0.6s ease-out forwards; }
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
        const createIceCreamIcon = (type: string, isOpen: boolean) => {
          const getColor = (storeType: string) => {
            switch (storeType) {
              case "flagship": return "#f97316"; // Orange
              case "branch": return "#ec4899"; // Pink  
              case "outlet": return "#10b981"; // Green
              case "seasonal": return "#3b82f6"; // Blue
              default: return "#6b7280"; // Gray
            }
          };

          const getEmoji = (storeType: string) => {
            switch (storeType) {
              case "flagship": return "🍦";
              case "branch": return "🛍️";
              case "outlet": return "🏪";
              case "seasonal": return "🌊";
              default: return "❓";
            }
          };

          return L.divIcon({
            className: 'ice-cream-marker',
            html: `
              <div style="
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, ${getColor(type)}, ${getColor(type)}dd);
                border: 3px solid white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 6px 20px rgba(0,0,0,0.3);
                font-size: 18px;
                opacity: ${isOpen ? '1' : '0.6'};
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
          // Center on Delhi with ice cream themed initial view
          const initialCenter: [number, number] = [28.6139, 77.2090];
          const initialZoom = 12;

          const mapInstance = L.map(mapRef.current, {
            center: initialCenter,
            zoom: initialZoom,
            scrollWheelZoom: true,
            zoomControl: true,
            attributionControl: true,
          });

          // Add tile layer
          L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
              attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              maxZoom: 19,
              subdomains: ['a', 'b', 'c'],
            }
          ).addTo(mapInstance);

          setMap(mapInstance);
          
          // Add store markers
          addStoreMarkersToMap(mapInstance, createIceCreamIcon);
          
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

  // Get user's location
  const getMyLocation = () => {
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
        
        // Add user location marker
        if (map) {
          const userMarker = (L as any).marker([userPos.lat, userPos.lng], {
            icon: (L as any).divIcon({
              className: 'user-location-marker',
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
              <h3 style="margin: 0 0 8px 0; color: #ec4899; font-size: 16px;">You are here!</h3>
              <p style="margin: 0; font-size: 12px; color: #64748b;">
                ${userPos.lat.toFixed(4)}, ${userPos.lng.toFixed(4)}
              </p>
            </div>
          `);

          userMarker.addTo(map);
          setMarkers(prev => [...prev, userMarker]);
          
          // Pan to user location
          map.setView([userPos.lat, userPos.lng], 15);
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

  const addStoreMarkersToMap = (mapInstance: any, createIceCreamIcon: Function) => {
    // Clear existing markers
    markers.forEach((marker: any) => mapInstance.removeLayer(marker));
    
    const newMarkers: any[] = [];
    
    // Add store markers
    enhancedStores
      .filter(store => selectedTypes.includes(store.type) && 
        store.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .forEach(store => {
        const marker = (L as any).marker([store.lat, store.lng], {
          icon: createIceCreamIcon(store.type, store.isOpen)
        });

        // Create store popup
        const popupContent = `
          <div style="min-width: 280px; padding: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
              <div style="
                width: 48px;
                height: 48px;
                background: linear-gradient(135deg, #f97316, #ec4899);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                box-shadow: 0 4px 12px rgba(249,115,22,0.3);
              ">
                ${store.type === "flagship" ? "🍦" : store.type === "branch" ? "🛍️" : 
                  store.type === "outlet" ? "🏪" : store.type === "seasonal" ? "🌊" : "❓"}
              </div>
              <div>
                <h3 style="margin: 0; font-size: 16px; font-weight: bold; color: #1e293b; line-height: 1.2;">
                  ${store.name}
                </h3>
                <p style="margin: 2px 0 0 0; font-size: 12px; color: #ec4899; text-transform: capitalize; font-weight: 600;">
                  ${store.type} Store
                </p>
                <div style="display: flex; align-items: center; gap: 4px; margin-top: 4px;">
                  <div style="display: flex; align-items: center;">
                    ${"⭐".repeat(Math.floor(store.rating))}
                    <span style="margin-left: 4px; font-size: 11px; color: #64748b;">(${store.reviews})</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div style="margin-bottom: 12px;">
              <p style="margin: 0 0 4px 0; font-size: 11px; color: #64748b; font-weight: 600;">Status:</p>
              <span style="
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 600;
                ${store.isOpen ? 'background: linear-gradient(135deg, #d1fae5, #a7f3d0); color: #065f46; border: 1px solid #86efac;' : 
                  'background: linear-gradient(135deg, #fecaca, #fca5a5); color: #991b1b; border: 1px solid #f87171;'}
              ">
                ${store.isOpen ? '🟢 Open Now' : '🔴 Closed'}
              </span>
            </div>
            
            <div style="font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 8px;">
              <p style="margin: 0 0 4px 0;">📍 ${store.address}</p>
              <p style="margin: 0;">📞 ${store.phone}</p>
              <p style="margin: 4px 0 0 0;">🕒 ${store.hours}</p>
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
      addStoreMarkersToMap(map, () => {});
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

  const getStoreIcon = (type: string) => {
    switch (type) {
      case "flagship": return "🍦";
      case "branch": return "🛍️";
      case "outlet": return "🏪";
      case "seasonal": return "🌊";
      default: return "❓";
    }
  };

  const filteredStores = enhancedStores.filter(store => 
    selectedTypes.includes(store.type) && 
    store.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50 dark:from-orange-900/20 dark:via-pink-900/20 dark:to-rose-900/20">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      
      {/* Map Container - Full Content Area */}
      <div className="absolute inset-0 z-0">
        <div ref={mapRef} className="h-full w-full"></div>
        
        {/* Loading Overlay */}
        {mapLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-orange-100/90 via-pink-100/90 to-rose-100/90 dark:from-orange-900/90 dark:via-pink-900/90 dark:to-rose-900/90 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-float">🍦</div>
              <p className="text-xl font-bold text-orange-800 dark:text-orange-200 mb-2">Finding Stores...</p>
              <p className="text-sm text-orange-600 dark:text-orange-400">Loading your ice cream paradise</p>
              <div className="w-12 h-2 bg-pink-200 dark:bg-pink-800 rounded-full mx-auto mt-4 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-r from-orange-600 to-pink-600 animate-pulse-glow"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Top Controls */}
      <div className="absolute top-4 left-4 z-20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-600 via-pink-600 to-rose-600 rounded-2xl flex items-center justify-center animate-pulse-glow">
            <LocationIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-orange-900 dark:text-white flex items-center gap-2">
              🍦 Store Finder
            </h1>
            <p className="text-sm text-orange-600 dark:text-orange-400">Discover your favorite ice cream stores!</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="absolute top-4 left-64 z-20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-orange-600" />
          <Input
            type="text"
            placeholder="Search stores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-80 bg-white/90 dark:bg-slate-800/90 border-orange-300 dark:border-orange-700 rounded-xl text-orange-900 dark:text-white backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Location Button */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          onClick={getMyLocation}
          disabled={locationPermission === "getting"}
          className={`rounded-xl transition-all ${
            locationPermission === "granted" 
              ? "bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse-glow" 
              : locationPermission === "denied"
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white"
          }`}
        >
          {locationPermission === "getting" ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Filter Toggle Button */}
      <div className="absolute top-16 right-4 z-20">
        <Button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-white/90 hover:bg-orange-100 dark:bg-slate-800/90 dark:hover:bg-orange-900/90 text-orange-900 dark:text-orange-200 border-orange-300 dark:border-orange-700 rounded-xl transition-all backdrop-blur-sm"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Store List Toggle */}
      <div className="absolute top-16 right-32 z-20">
        <Button
          onClick={() => setShowStoreList(!showStoreList)}
          className="bg-white/90 hover:bg-orange-100 dark:bg-slate-800/90 dark:hover:bg-orange-900/90 text-orange-900 dark:text-orange-200 border-orange-300 dark:border-orange-700 rounded-xl transition-all backdrop-blur-sm"
        >
          {showStoreList ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
          {showStoreList ? "Hide List" : "Show List"}
        </Button>
      </div>

      {/* Store Type Filter Panel */}
      {showFilters && (
        <div className="absolute bottom-4 right-4 z-20 w-80 bg-gradient-to-br from-orange-100/95 via-pink-100/95 to-rose-100/95 dark:from-orange-900/95 dark:via-pink-900/95 dark:to-slate-900/95 backdrop-blur-xl rounded-2xl shadow-xl border border-orange-300/50 dark:border-orange-800/50 p-4 animate-slide-in-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-orange-900 dark:text-white flex items-center gap-2">
              🏪 Store Types
            </h3>
            <Button
              onClick={() => setShowFilters(false)}
              size="sm"
              className="bg-white/80 hover:bg-orange-100 dark:bg-slate-800/80 dark:hover:bg-orange-900/80 text-orange-900 dark:text-orange-200 border-orange-300 dark:border-orange-700"
            >
              ×
            </Button>
          </div>
          <div className="space-y-3">
            {["flagship", "branch", "outlet", "seasonal"].map((type) => {
              const getStoreLabel = (storeType: string) => {
                switch (storeType) {
                  case "flagship": return "🍦 Flagship Stores";
                  case "branch": return "🛍️ Mall Branches";
                  case "outlet": return "🏪 Quick Outlets";
                  case "seasonal": return "🌊 Seasonal Stores";
                  default: return storeType;
                }
              };
              
              return (
                <label key={type} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 dark:hover:bg-slate-700/50 cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => toggleStoreType(type)}
                    className="w-4 h-4 text-orange-600 rounded border-orange-400 focus:ring-orange-500"
                  />
                  <span className="text-lg">{getStoreIcon(type)}</span>
                  <span className="text-sm font-semibold text-orange-900 dark:text-white">
                    {getStoreLabel(type)}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Store List Panel */}
      {showStoreList && (
        <div className={`absolute z-20 w-96 bg-gradient-to-br from-orange-100/95 via-pink-100/95 to-rose-100/95 dark:from-orange-900/95 dark:via-pink-900/95 dark:to-slate-900/95 backdrop-blur-xl rounded-2xl shadow-xl border border-orange-300/50 dark:border-orange-800/50 overflow-hidden animate-slide-in-up ${showFilters ? 'bottom-4 right-96' : 'bottom-4 right-4'}`}>
          <div className="p-4 border-b border-orange-200/50 dark:border-orange-700/50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-orange-900 dark:text-white flex items-center gap-2">
                🏪 Nearby Stores
              </h3>
              <Button
                onClick={() => setShowStoreList(false)}
                size="sm"
                className="bg-white/80 hover:bg-orange-100 dark:bg-slate-800/80 dark:hover:bg-orange-900/80 text-orange-900 dark:text-orange-200 border-orange-300 dark:border-orange-700"
              >
                ×
              </Button>
            </div>
            <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
              {filteredStores.length} stores found
            </p>
          </div>
          
          <div className="max-h-96 overflow-y-auto p-4 space-y-3">
            {filteredStores.map((store) => (
              <Card 
                key={store.id} 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedStore?.id === store.id 
                    ? "bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-900/20 dark:to-pink-900/20 border-orange-300 dark:border-orange-700" 
                    : "bg-white/80 dark:bg-slate-800/80 border-orange-200/50 dark:border-orange-700/50"
                }`}
                onClick={() => setSelectedStore(store)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center text-white text-lg">
                      {getStoreIcon(store.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-orange-900 dark:text-white truncate">
                          {store.name}
                        </h4>
                        {store.isFavorite && (
                          <Heart className="w-4 h-4 text-red-500 fill-current" />
                        )}
                      </div>
                      <p className="text-xs text-orange-600 dark:text-orange-400 mb-2">
                        {store.address}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex text-yellow-400">
                          {"⭐".repeat(Math.floor(store.rating))}
                        </div>
                        <span className="text-xs text-orange-700 dark:text-orange-300">
                          {store.rating} ({store.reviews})
                        </span>
                        <Badge 
                          className={`text-xs ${
                            store.isOpen 
                              ? "bg-emerald-100 text-emerald-700 border-emerald-300" 
                              : "bg-red-100 text-red-700 border-red-300"
                          }`}
                        >
                          {store.isOpen ? "Open" : "Closed"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400">
                        <span>📍 {store.distance}</span>
                        <span>🕒 {store.estimatedTime}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Store Details Panel */}
      {selectedStore && (
        <div className={`absolute z-20 w-96 bg-gradient-to-br from-orange-100/95 via-pink-100/95 to-rose-100/95 dark:from-orange-900/95 dark:via-pink-900/95 dark:to-slate-900/95 backdrop-blur-xl rounded-2xl shadow-xl border border-orange-300/50 dark:border-orange-800/50 p-6 animate-slide-in-up ${showStoreList ? 'bottom-4 left-4' : 'bottom-4 right-4'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-600 via-pink-600 to-rose-600 rounded-2xl flex items-center justify-center animate-pulse-glow">
                <span className="text-white text-xl">
                  {getStoreIcon(selectedStore.type)}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-orange-900 dark:text-white">{selectedStore.name}</h3>
                <p className="text-sm text-orange-600 dark:text-orange-400 capitalize">{selectedStore.type} Store</p>
              </div>
            </div>
            <Button
              onClick={() => setSelectedStore(null)}
              size="sm"
              className="bg-white/80 hover:bg-orange-100 dark:bg-slate-800/80 dark:hover:bg-orange-900/80 text-orange-900 dark:text-orange-200 border-orange-300 dark:border-orange-700"
            >
              ×
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gradient-to-br from-orange-50 to-pink-50 dark:from-slate-700 dark:to-slate-700 rounded-xl p-4 text-center">
              <p className="text-xs text-orange-700 dark:text-orange-300 mb-1">Rating</p>
              <div className="flex justify-center text-yellow-400 mb-1">
                {"⭐".repeat(Math.floor(selectedStore.rating))}
              </div>
              <p className="text-sm font-bold text-orange-900 dark:text-white">{selectedStore.rating} ({selectedStore.reviews})</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-slate-700 dark:to-slate-700 rounded-xl p-4 text-center">
              <p className="text-xs text-pink-700 dark:text-pink-300 mb-1">Distance</p>
              <p className="text-lg font-bold text-pink-900 dark:text-white">{selectedStore.distance}</p>
              <p className="text-xs text-pink-600 dark:text-pink-400">{selectedStore.estimatedTime}</p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-orange-900 dark:text-white">Status</span>
              <Badge 
                className={`text-xs ${
                  selectedStore.isOpen 
                    ? "bg-emerald-100 text-emerald-700 border-emerald-300" 
                    : "bg-red-100 text-red-700 border-red-300"
                }`}
              >
                {selectedStore.isOpen ? "🟢 Open Now" : "🔴 Closed"}
              </Badge>
            </div>
            <div className="text-xs text-orange-600 dark:text-orange-400 bg-white/50 dark:bg-slate-700/50 rounded-lg p-3">
              <p>🕒 {selectedStore.hours}</p>
              <p>📞 {selectedStore.phone}</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-xs text-orange-700 dark:text-orange-300 mb-2 font-semibold">Specialties:</p>
            <div className="flex flex-wrap gap-2">
              {selectedStore.specialties.map((specialty: string) => (
                <span key={specialty} className="px-3 py-1 bg-gradient-to-r from-orange-200 to-pink-200 dark:from-orange-900/20 dark:to-pink-900/20 text-orange-800 dark:text-orange-300 text-xs rounded-full font-medium">
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          <div className="text-xs text-orange-600 dark:text-orange-400 bg-white/50 dark:bg-slate-700/50 rounded-lg p-3 mb-4">
            <p>📍 {selectedStore.address}</p>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white rounded-xl">
              <Route className="w-4 h-4 mr-2" />
              Directions
            </Button>
            <Button variant="outline" className="border-orange-300 dark:border-orange-700 text-orange-900 dark:text-orange-200">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="border-orange-300 dark:border-orange-700 text-orange-900 dark:text-orange-200">
              <Heart className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="border-orange-300 dark:border-orange-700 text-orange-900 dark:text-orange-200">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Stats Legend */}
      <div className="absolute bottom-4 left-4 z-20 bg-gradient-to-br from-orange-100/95 via-pink-100/95 to-rose-100/95 dark:from-orange-900/95 dark:via-pink-900/95 dark:to-slate-900/95 backdrop-blur-xl rounded-2xl shadow-xl border border-orange-300/50 dark:border-orange-800/50 p-4 animate-slide-in-up">
        <div className="flex items-center gap-3 mb-3">
          <LocationIcon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          <h4 className="text-sm font-bold text-orange-900 dark:text-white">🍦 Store Network</h4>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-orange-700 dark:text-orange-300">Open Stores:</span>
            <span className="text-orange-900 dark:text-white font-bold">{enhancedStores.filter(s => s.isOpen).length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-orange-700 dark:text-orange-300">Total Stores:</span>
            <span className="text-orange-900 dark:text-white font-bold">{enhancedStores.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-orange-700 dark:text-orange-300">Your Location:</span>
            <span className="text-orange-900 dark:text-white font-bold">
              {locationPermission === "granted" ? "🍧 Found!" : locationPermission === "denied" ? "❌ Hidden" : "📍 Locate"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}