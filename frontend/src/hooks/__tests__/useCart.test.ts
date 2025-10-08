/**
 * useCart Hook Tests
 * Tests for the cart management hook
 */

import { renderHook, act } from "@testing-library/react";

import { fixtures } from "../../__tests__/fixtures/data";
import { mockCartContextValue } from "../../__tests__/mocks/services";
import { useCart } from "../useCart";

// Mock the cart context
jest.mock("../../contexts/CartContext", () => ({
  useCart: () => mockCartContextValue,
}));

describe("useCart", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Initial State", () => {
    it("should initialize with empty cart", () => {
      const { result } = renderHook(() => useCart());

      expect(result.current.cartItems).toEqual([]);
      expect(result.current.cartSummary.isEmpty).toBe(true);
      expect(result.current.cartSummary.hasItems).toBe(false);
      expect(result.current.cartSummary.total).toBe(0);
      expect(result.current.cartSummary.itemCount).toBe(0);
      expect(result.current.isCartOpen).toBe(false);
    });
  });

  describe("Add to Cart", () => {
    it("should add item to cart", () => {
      const { result } = renderHook(() => useCart());
      const flavor = fixtures.flavors[0];

      act(() => {
        result.current.addToCart(flavor, 2, "regular");
      });

      expect(mockCartContextValue.addItem).toHaveBeenCalledWith({
        flavor,
        quantity: 2,
        size: "regular",
        customizations: undefined,
        price: expect.any(Number),
      });
    });

    it("should add item with customizations", () => {
      const { result } = renderHook(() => useCart());
      const flavor = fixtures.flavors[0];
      const customizations = ["extra sugar", "no ice"];

      act(() => {
        result.current.addToCart(flavor, 1, "large", customizations);
      });

      expect(mockCartContextValue.addItem).toHaveBeenCalledWith({
        flavor,
        quantity: 1,
        size: "large",
        customizations,
        price: expect.any(Number),
      });
    });

    it("should use default quantity and size", () => {
      const { result } = renderHook(() => useCart());
      const flavor = fixtures.flavors[0];

      act(() => {
        result.current.addToCart(flavor);
      });

      expect(mockCartContextValue.addItem).toHaveBeenCalledWith({
        flavor,
        quantity: 1,
        size: "regular",
        customizations: undefined,
        price: expect.any(Number),
      });
    });
  });

  describe("Remove from Cart", () => {
    it("should remove item from cart", () => {
      const { result } = renderHook(() => useCart());
      const itemId = "item-1";

      act(() => {
        result.current.removeFromCart(itemId);
      });

      expect(mockCartContextValue.removeItem).toHaveBeenCalledWith(itemId);
    });
  });

  describe("Update Quantity", () => {
    it("should update item quantity", () => {
      const { result } = renderHook(() => useCart());
      const itemId = "item-1";
      const newQuantity = 3;

      act(() => {
        result.current.updateCartItemQuantity(itemId, newQuantity);
      });

      expect(mockCartContextValue.updateQuantity).toHaveBeenCalledWith(
        itemId,
        newQuantity,
      );
    });
  });

  describe("Clear Cart", () => {
    it("should clear all items from cart", () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.clearCart();
      });

      expect(mockCartContextValue.clearCart).toHaveBeenCalled();
    });
  });

  describe("Cart Toggle", () => {
    it("should toggle cart open/closed", () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.toggleCart();
      });

      expect(mockCartContextValue.toggleCart).toHaveBeenCalled();
    });

    it("should open cart", () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.openCart();
      });

      expect(mockCartContextValue.openCart).toHaveBeenCalled();
    });

    it("should close cart", () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.closeCart();
      });

      expect(mockCartContextValue.closeCart).toHaveBeenCalled();
    });
  });

  describe("Helper Functions", () => {
    it("should get item quantity", () => {
      const { result } = renderHook(() => useCart());
      const flavorId = "flavor-1";
      const size = "regular";

      act(() => {
        result.current.getItemQuantity(flavorId, size);
      });

      expect(mockCartContextValue.getItemQuantity).toHaveBeenCalledWith(
        flavorId,
        size,
      );
    });

    it("should get item total", () => {
      const { result } = renderHook(() => useCart());
      const itemId = "item-1";

      act(() => {
        result.current.getItemTotal(itemId);
      });

      expect(mockCartContextValue.getItemTotal).toHaveBeenCalledWith(itemId);
    });
  });

  describe("Memoization", () => {
    it("should memoize cart summary", () => {
      const { result, rerender } = renderHook(() => useCart());

      const firstSummary = result.current.cartSummary;

      // Re-render
      rerender();

      const secondSummary = result.current.cartSummary;

      // Should be the same reference due to memoization
      expect(firstSummary).toBe(secondSummary);
    });

    it("should memoize cart items", () => {
      const { result, rerender } = renderHook(() => useCart());

      const firstItems = result.current.cartItems;

      // Re-render
      rerender();

      const secondItems = result.current.cartItems;

      // Should be the same reference due to memoization
      expect(firstItems).toBe(secondItems);
    });

    it("should memoize cart open state", () => {
      const { result, rerender } = renderHook(() => useCart());

      const firstIsOpen = result.current.isCartOpen;

      // Re-render
      rerender();

      const secondIsOpen = result.current.isCartOpen;

      // Should be the same reference due to memoization
      expect(firstIsOpen).toBe(secondIsOpen);
    });
  });

  describe("Price Calculation", () => {
    it("should calculate price for regular size", () => {
      const { result } = renderHook(() => useCart());
      const flavor = fixtures.flavors[0]; // price: 9.99

      act(() => {
        result.current.addToCart(flavor, 1, "regular");
      });

      expect(mockCartContextValue.addItem).toHaveBeenCalledWith({
        flavor,
        quantity: 1,
        size: "regular",
        customizations: undefined,
        price: 9.99,
      });
    });

    it("should calculate price for large size", () => {
      const { result } = renderHook(() => useCart());
      const flavor = fixtures.flavors[0]; // price: 9.99

      act(() => {
        result.current.addToCart(flavor, 1, "large");
      });

      expect(mockCartContextValue.addItem).toHaveBeenCalledWith({
        flavor,
        quantity: 1,
        size: "large",
        customizations: undefined,
        price: 11.99, // 9.99 * 1.2
      });
    });

    it("should calculate price for small size", () => {
      const { result } = renderHook(() => useCart());
      const flavor = fixtures.flavors[0]; // price: 9.99

      act(() => {
        result.current.addToCart(flavor, 1, "small");
      });

      expect(mockCartContextValue.addItem).toHaveBeenCalledWith({
        flavor,
        quantity: 1,
        size: "small",
        customizations: undefined,
        price: 7.99, // 9.99 * 0.8
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle add to cart errors gracefully", () => {
      const { result } = renderHook(() => useCart());
      const flavor = fixtures.flavors[0];

      // Mock context to throw error
      mockCartContextValue.addItem.mockImplementation(() => {
        throw new Error("Add to cart failed");
      });

      expect(() => {
        act(() => {
          result.current.addToCart(flavor);
        });
      }).toThrow("Add to cart failed");
    });

    it("should handle remove from cart errors gracefully", () => {
      const { result } = renderHook(() => useCart());
      const itemId = "item-1";

      // Mock context to throw error
      mockCartContextValue.removeItem.mockImplementation(() => {
        throw new Error("Remove from cart failed");
      });

      expect(() => {
        act(() => {
          result.current.removeFromCart(itemId);
        });
      }).toThrow("Remove from cart failed");
    });
  });
});
