"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import { createStoreIcon, popupHtml } from "./LocationMarker";
import type { StoreLocation } from "@/hooks/useStoreData";

type StoreMapProps = {
  stores: StoreLocation[];
};

export function StoreMap({ stores }: StoreMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Ensure Leaflet CSS is present
    if (typeof document !== "undefined" && !document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    if (!mapRef.current) return;
    if (mapInstanceRef.current) return; // init once

    // Create map
    const map = L.map(mapRef.current, {
      center: [28.6139, 77.209],
      zoom: 12,
      scrollWheelZoom: true,
    });
    mapInstanceRef.current = map;

    // Base layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing layers except tile layer
    map.eachLayer((layer) => {
      if ((layer as any).getAttribution) return; // tile layer
      map.removeLayer(layer);
    });

    const bounds = L.latLngBounds([]);

    stores.forEach((store) => {
      const marker = L.marker([store.lat, store.lng], {
        icon: createStoreIcon(store),
      }).addTo(map);
      marker.bindPopup(popupHtml(store));
      bounds.extend([store.lat, store.lng]);
    });

    if (stores.length > 0) {
      map.fitBounds(bounds.pad(0.2));
    }
  }, [stores]);

  return (
    <div className="h-[calc(100vh-4rem)] w-full rounded-xl border border-orange-200/70 dark:border-orange-900/40 overflow-hidden">
      <div ref={mapRef} className="h-full w-full" />
    </div>
  );
}

export default StoreMap;


