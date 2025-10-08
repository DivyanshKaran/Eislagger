"use client";

import L from "leaflet";
import type { StoreLocation } from "@/hooks/useStoreData";

export function createStoreIcon(store: StoreLocation) {
  const color = getColor(store.rating ?? 0);
  const emoji = getEmoji(store.type);

  return L.divIcon({
    className: "store-marker",
    html: `
      <div style="
        width: 42px; height: 42px; border-radius: 12px;
        display: flex; align-items: center; justify-content: center;
        background: linear-gradient(135deg, ${color}, ${color}dd);
        border: 3px solid white; box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        font-size: 20px;">
        ${emoji}
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
  });
}

export function popupHtml(store: StoreLocation) {
  const rating = store.rating ? `${store.rating} ⭐` : "Coming soon";
  const reviews = store.reviews ? `(${store.reviews} reviews)` : "";
  return `
    <div class="p-2">
      <h3 class="m-0 text-sm font-semibold text-gray-900">${store.name}</h3>
      <p class="m-0 text-xs text-gray-600">${store.address}</p>
      <p class="m-0 mt-1 text-xs text-gray-500">${rating} ${reviews}</p>
    </div>
  `;
}

function getEmoji(type: string) {
  switch (type) {
    case "flagship":
      return "🍦";
    case "branch":
      return "🛍️";
    case "outlet":
      return "🏪";
    case "seasonal":
      return "🌊";
    case "coming-soon":
      return "🚧";
    default:
      return "📍";
  }
}

function getColor(rating: number) {
  if (rating >= 4.7) return "#10b981"; // emerald
  if (rating >= 4.3) return "#3b82f6"; // blue
  if (rating >= 3.5) return "#f59e0b"; // amber
  return "#ef4444"; // red
}


