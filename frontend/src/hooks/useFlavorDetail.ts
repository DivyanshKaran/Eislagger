import { useState } from "react";

export interface FlavorSize {
  id: string;
  name: string;
  price: string;
  description: string;
}

export interface FlavorReview {
  id: number;
  user: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  helpful: number;
  verified: boolean;
  avatar: string;
}

export interface FlavorData {
  id: number;
  name: string;
  emoji: string;
  description: string;
  price: string;
  rating: number;
  reviewCount: number;
  isFavorite: boolean;
  category: string;
  ingredients: string[];
  nutrition: {
    calories: number;
    fat: number;
    protein: number;
    carbs: number;
  };
  availability: {
    inStock: boolean;
    stores: string[];
  };
  reviews: FlavorReview[];
  similarFlavors: Array<{
    id: number;
    name: string;
    emoji: string;
    rating: number;
    price: string;
  }>;
}

export interface UseFlavorDetailOptions {
  flavorData: FlavorData;
  sizes?: FlavorSize[];
}

export function useFlavorDetail({
  flavorData,
  sizes = [],
}: UseFlavorDetailOptions) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(flavorData.isFavorite);
  const [selectedSize, setSelectedSize] = useState(sizes[0]?.id || "regular");

  const defaultSizes: FlavorSize[] = [
    {
      id: "small",
      name: "Small",
      price: "€6.50",
      description: "Perfect for a quick treat",
    },
    {
      id: "regular",
      name: "Regular",
      price: "€8.50",
      description: "Our most popular size",
    },
    {
      id: "large",
      name: "Large",
      price: "€10.50",
      description: "For serious ice cream lovers",
    },
  ];

  const availableSizes = sizes.length > 0 ? sizes : defaultSizes;

  const getCurrentPrice = () => {
    const size = availableSizes.find((s) => s.id === selectedSize);
    return size ? size.price : flavorData.price;
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const incrementQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, 10));
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const addToCart = () => {
    // This would typically add the item to cart
    console.log("Added to cart:", {
      flavor: flavorData.name,
      size: selectedSize,
      quantity,
      price: getCurrentPrice(),
    });
  };

  const shareFlavor = () => {
    if (navigator.share) {
      navigator.share({
        title: flavorData.name,
        text: `Check out this amazing ${flavorData.name} ice cream!`,
        url: window.location.href,
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return {
    quantity,
    setQuantity,
    isFavorite,
    toggleFavorite,
    selectedSize,
    setSelectedSize,
    availableSizes,
    getCurrentPrice,
    incrementQuantity,
    decrementQuantity,
    addToCart,
    shareFlavor,
  };
}
