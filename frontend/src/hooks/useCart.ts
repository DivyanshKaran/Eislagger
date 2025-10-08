import { useCallback, useMemo } from "react";

import { useCart as useCartContext } from "@/contexts/CartContext";
// Direct imports to avoid circular dependency issues
import type { BaseEntity } from "@/types/common";

interface Flavor extends BaseEntity {
  name: string;
  emoji: string;
  description: string;
  price: string;
  rating: number;
  reviewCount: number;
  isFavorite: boolean;
  category: string;
  tags: string[];
  ingredients: string[];
  allergens: string[];
  nutritionInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    sugar: number;
  };
  availability: {
    inStock: boolean;
    stockCount: number;
    lastRestocked: string;
  };
  images: string[];
  reviews: Array<{
    id: number;
    user: string;
    rating: number;
    title: string;
    content: string;
    date: string;
    helpful: number;
    verified: boolean;
    avatar: string;
  }>;
}

// Custom hook for cart operations with memoization
export function useCart() {
  const cartContext = useCartContext();

  // Memoized cart operations
  const addToCart = useCallback(
    (
      flavor: Flavor,
      quantity: number = 1,
      size: "small" | "regular" | "large" = "regular",
      customizations?: string[],
    ) => {
      const price = getSizePrice(parseFloat(flavor.price.replace(/[^0-9.-]+/g, "")), size);
      cartContext.addItem({
        flavor,
        quantity,
        size,
        customizations,
        price,
      });
    },
    [cartContext],
  );

  const removeFromCart = useCallback(
    (id: string) => {
      cartContext.removeItem(id);
    },
    [cartContext],
  );

  const updateCartItemQuantity = useCallback(
    (id: string, quantity: number) => {
      cartContext.updateQuantity(id, quantity);
    },
    [cartContext],
  );

  const clearCart = useCallback(() => {
    cartContext.clearCart();
  }, [cartContext]);

  // Memoized computed values
  const cartSummary = useMemo(
    () => ({
      total: cartContext.state.total,
      itemCount: cartContext.state.itemCount,
      isEmpty: cartContext.state.items.length === 0,
      hasItems: cartContext.state.items.length > 0,
    }),
    [
      cartContext.state.total,
      cartContext.state.itemCount,
      cartContext.state.items.length,
    ],
  );

  const cartItems = useMemo(
    () => cartContext.state.items,
    [cartContext.state.items],
  );

  const isCartOpen = useMemo(
    () => cartContext.state.isOpen,
    [cartContext.state.isOpen],
  );

  // Helper functions
  const getItemQuantity = useCallback(
    (flavorId: string, size: string) => {
      return cartContext.getItemQuantity(flavorId, size);
    },
    [cartContext],
  );

  const getItemTotal = useCallback(
    (id: string) => {
      return cartContext.getItemTotal(id);
    },
    [cartContext],
  );

  const toggleCart = useCallback(() => {
    cartContext.toggleCart();
  }, [cartContext]);

  const openCart = useCallback(() => {
    cartContext.openCart();
  }, [cartContext]);

  const closeCart = useCallback(() => {
    cartContext.closeCart();
  }, [cartContext]);

  return {
    // State
    items: cartItems,
    total: cartSummary.total,
    itemCount: cartSummary.itemCount,
    isEmpty: cartSummary.isEmpty,
    hasItems: cartSummary.hasItems,
    isOpen: isCartOpen,

    // Actions
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,

    // Helpers
    getItemQuantity,
    getItemTotal,
  };
}

// Helper function to calculate size-based pricing
function getSizePrice(
  basePrice: number,
  size: "small" | "regular" | "large",
): number {
  switch (size) {
    case "small":
      return basePrice * 0.8;
    case "regular":
      return basePrice;
    case "large":
      return basePrice * 1.2;
    default:
      return basePrice;
  }
}
