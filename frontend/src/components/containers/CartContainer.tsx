import React, { useMemo } from "react";

import { useCart } from "@/hooks/useCart";
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

// Cart Container Component
interface CartContainerProps {
  children: (cartProps: {
    items: ReturnType<typeof useCart>["items"];
    total: number;
    itemCount: number;
    isEmpty: boolean;
    hasItems: boolean;
    addToCart: (
      flavor: Flavor,
      quantity?: number,
      size?: "small" | "regular" | "large",
      customizations?: string[],
    ) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getItemQuantity: (flavorId: string, size: string) => number;
  }) => React.ReactNode;
}

export function CartContainer({ children }: CartContainerProps) {
  const cart = useCart();

  const cartProps = useMemo(
    () => ({
      items: cart.items,
      total: cart.total,
      itemCount: cart.itemCount,
      isEmpty: cart.isEmpty,
      hasItems: cart.hasItems,
      addToCart: cart.addToCart,
      removeFromCart: cart.removeFromCart,
      updateQuantity: cart.updateCartItemQuantity,
      clearCart: cart.clearCart,
      getItemQuantity: cart.getItemQuantity,
    }),
    [cart],
  );

  return <>{children(cartProps)}</>;
}

// Cart UI Component
interface CartUIProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function CartUI({ isOpen, onToggle, onClose }: CartUIProps) {
  const cart = useCart();

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <span className="relative">
          🛒
          {cart.itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cart.itemCount}
            </span>
          )}
        </span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-end">
      <div className="bg-white w-96 h-full shadow-xl transform transition-transform">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cart.isEmpty ? (
            <div className="text-center text-gray-500 py-8">
              Your cart is empty
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-3 p-3 border rounded"
                >
                  <div className="flex-1">
                    <h3 className="font-medium">{item.flavor.name}</h3>
                    <p className="text-sm text-gray-500">
                      {item.size} • ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        cart.updateCartItemQuantity(item.id, item.quantity - 1)
                      }
                      className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() =>
                        cart.updateCartItemQuantity(item.id, item.quantity + 1)
                      }
                      className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center"
                    >
                      +
                    </button>
                    <button
                      onClick={() => cart.removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.hasItems && (
          <div className="p-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-lg">
                ${cart.total.toFixed(2)}
              </span>
            </div>
            <button
              onClick={() => {
                // Handle checkout
                console.log("Checkout");
              }}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
