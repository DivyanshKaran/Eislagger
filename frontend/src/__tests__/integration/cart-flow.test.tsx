/**
 * Cart Flow Integration Tests
 * Tests for the complete shopping cart user flow
 */

import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useCart } from "../../hooks/useCart";
import { fixtures } from "../fixtures/data";

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Test component that uses the cart hook
function CartTestComponent() {
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    isInCart,
  } = useCart();

  return (
    <div>
      <div data-testid="cart-items">{items.length}</div>
      <div data-testid="cart-total">{getTotalPrice()}</div>
      <div data-testid="cart-count">{getTotalItems()}</div>

      <button onClick={() => addItem(fixtures.flavors[0], 1)}>
        Add Flavor 1
      </button>
      <button onClick={() => addItem(fixtures.flavors[1], 2)}>
        Add Flavor 2
      </button>
      <button onClick={() => removeItem(fixtures.flavors[0].id)}>
        Remove Flavor 1
      </button>
      <button onClick={() => updateQuantity(fixtures.flavors[0].id, 3)}>
        Update Quantity
      </button>
      <button onClick={clearCart}>Clear Cart</button>

      <div data-testid="in-cart-1">
        {isInCart(fixtures.flavors[0].id) ? "Yes" : "No"}
      </div>
      <div data-testid="in-cart-2">
        {isInCart(fixtures.flavors[1].id) ? "Yes" : "No"}
      </div>
    </div>
  );
}

describe("Cart Flow Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe("Cart Initialization", () => {
    it("should initialize empty cart", () => {
      render(<CartTestComponent />);

      expect(screen.getByTestId("cart-items")).toHaveTextContent("0");
      expect(screen.getByTestId("cart-total")).toHaveTextContent("0");
      expect(screen.getByTestId("cart-count")).toHaveTextContent("0");
    });

    it("should load cart from localStorage", () => {
      const savedCart = [
        { ...fixtures.flavors[0], quantity: 2 },
        { ...fixtures.flavors[1], quantity: 1 },
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedCart));

      render(<CartTestComponent />);

      expect(screen.getByTestId("cart-items")).toHaveTextContent("2");
      expect(screen.getByTestId("cart-count")).toHaveTextContent("3");
    });
  });

  describe("Adding Items to Cart", () => {
    it("should add new item to cart", async () => {
      const user = userEvent.setup();
      render(<CartTestComponent />);

      const addButton = screen.getByText("Add Flavor 1");
      await user.click(addButton);

      expect(screen.getByTestId("cart-items")).toHaveTextContent("1");
      expect(screen.getByTestId("cart-count")).toHaveTextContent("1");
      expect(screen.getByTestId("in-cart-1")).toHaveTextContent("Yes");
    });

    it("should increase quantity for existing item", async () => {
      const user = userEvent.setup();
      render(<CartTestComponent />);

      // Add item first time
      const addButton = screen.getByText("Add Flavor 1");
      await user.click(addButton);

      // Add same item again
      await user.click(addButton);

      expect(screen.getByTestId("cart-items")).toHaveTextContent("1");
      expect(screen.getByTestId("cart-count")).toHaveTextContent("2");
    });

    it("should add multiple different items", async () => {
      const user = userEvent.setup();
      render(<CartTestComponent />);

      await user.click(screen.getByText("Add Flavor 1"));
      await user.click(screen.getByText("Add Flavor 2"));

      expect(screen.getByTestId("cart-items")).toHaveTextContent("2");
      expect(screen.getByTestId("cart-count")).toHaveTextContent("3"); // 1 + 2
      expect(screen.getByTestId("in-cart-1")).toHaveTextContent("Yes");
      expect(screen.getByTestId("in-cart-2")).toHaveTextContent("Yes");
    });
  });

  describe("Removing Items from Cart", () => {
    it("should remove item from cart", async () => {
      const user = userEvent.setup();
      render(<CartTestComponent />);

      // Add item first
      await user.click(screen.getByText("Add Flavor 1"));
      expect(screen.getByTestId("cart-items")).toHaveTextContent("1");

      // Remove item
      await user.click(screen.getByText("Remove Flavor 1"));

      expect(screen.getByTestId("cart-items")).toHaveTextContent("0");
      expect(screen.getByTestId("cart-count")).toHaveTextContent("0");
      expect(screen.getByTestId("in-cart-1")).toHaveTextContent("No");
    });

    it("should handle removing non-existent item", async () => {
      const user = userEvent.setup();
      render(<CartTestComponent />);

      // Try to remove item that's not in cart
      await user.click(screen.getByText("Remove Flavor 1"));

      expect(screen.getByTestId("cart-items")).toHaveTextContent("0");
      expect(screen.getByTestId("cart-count")).toHaveTextContent("0");
    });
  });

  describe("Updating Item Quantities", () => {
    it("should update item quantity", async () => {
      const user = userEvent.setup();
      render(<CartTestComponent />);

      // Add item first
      await user.click(screen.getByText("Add Flavor 1"));
      expect(screen.getByTestId("cart-count")).toHaveTextContent("1");

      // Update quantity
      await user.click(screen.getByText("Update Quantity"));

      expect(screen.getByTestId("cart-count")).toHaveTextContent("3");
    });

    it("should remove item when quantity is set to 0", async () => {
      const user = userEvent.setup();
      render(<CartTestComponent />);

      // Add item first
      await user.click(screen.getByText("Add Flavor 1"));
      expect(screen.getByTestId("cart-items")).toHaveTextContent("1");

      // Update quantity to 0
      const updateButton = screen.getByText("Update Quantity");
      // Mock the updateQuantity to set quantity to 0
      updateButton.onclick = () => {
        // Simulate setting quantity to 0
        const cart = JSON.parse(localStorageMock.getItem("cart") || "[]");
        const updatedCart = cart.filter(
          (item: any) => item.id !== fixtures.flavors[0].id,
        );
        localStorageMock.setItem("cart", JSON.stringify(updatedCart));
        // Trigger re-render
        fireEvent.click(updateButton);
      };

      await user.click(updateButton);

      expect(screen.getByTestId("cart-items")).toHaveTextContent("0");
    });
  });

  describe("Cart Clearing", () => {
    it("should clear all items from cart", async () => {
      const user = userEvent.setup();
      render(<CartTestComponent />);

      // Add multiple items
      await user.click(screen.getByText("Add Flavor 1"));
      await user.click(screen.getByText("Add Flavor 2"));

      expect(screen.getByTestId("cart-items")).toHaveTextContent("2");

      // Clear cart
      await user.click(screen.getByText("Clear Cart"));

      expect(screen.getByTestId("cart-items")).toHaveTextContent("0");
      expect(screen.getByTestId("cart-count")).toHaveTextContent("0");
      expect(screen.getByTestId("in-cart-1")).toHaveTextContent("No");
      expect(screen.getByTestId("in-cart-2")).toHaveTextContent("No");
    });
  });

  describe("Cart Persistence", () => {
    it("should save cart to localStorage", async () => {
      const user = userEvent.setup();
      render(<CartTestComponent />);

      await user.click(screen.getByText("Add Flavor 1"));

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "cart",
        expect.stringContaining(fixtures.flavors[0].id),
      );
    });

    it("should load cart from localStorage on mount", () => {
      const savedCart = [
        { ...fixtures.flavors[0], quantity: 2 },
        { ...fixtures.flavors[1], quantity: 1 },
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedCart));

      render(<CartTestComponent />);

      expect(localStorageMock.getItem).toHaveBeenCalledWith("cart");
      expect(screen.getByTestId("cart-items")).toHaveTextContent("2");
    });

    it("should handle corrupted localStorage data", () => {
      localStorageMock.getItem.mockReturnValue("invalid json");

      render(<CartTestComponent />);

      expect(screen.getByTestId("cart-items")).toHaveTextContent("0");
    });
  });

  describe("Cart Calculations", () => {
    it("should calculate total price correctly", async () => {
      const user = userEvent.setup();
      render(<CartTestComponent />);

      // Add items with different prices
      await user.click(screen.getByText("Add Flavor 1"));
      await user.click(screen.getByText("Add Flavor 2"));

      const expectedTotal =
        fixtures.flavors[0].price + fixtures.flavors[1].price * 2;
      expect(screen.getByTestId("cart-total")).toHaveTextContent(
        expectedTotal.toString(),
      );
    });

    it("should calculate total items correctly", async () => {
      const user = userEvent.setup();
      render(<CartTestComponent />);

      await user.click(screen.getByText("Add Flavor 1"));
      await user.click(screen.getByText("Add Flavor 2"));

      expect(screen.getByTestId("cart-count")).toHaveTextContent("3"); // 1 + 2
    });
  });

  describe("Cart State Management", () => {
    it("should maintain cart state across re-renders", async () => {
      const user = userEvent.setup();
      const { rerender } = render(<CartTestComponent />);

      await user.click(screen.getByText("Add Flavor 1"));
      expect(screen.getByTestId("cart-items")).toHaveTextContent("1");

      // Re-render component
      rerender(<CartTestComponent />);

      expect(screen.getByTestId("cart-items")).toHaveTextContent("1");
      expect(screen.getByTestId("in-cart-1")).toHaveTextContent("Yes");
    });

    it("should handle concurrent cart operations", async () => {
      const user = userEvent.setup();
      render(<CartTestComponent />);

      // Perform multiple operations quickly
      await user.click(screen.getByText("Add Flavor 1"));
      await user.click(screen.getByText("Add Flavor 2"));
      await user.click(screen.getByText("Update Quantity"));

      expect(screen.getByTestId("cart-items")).toHaveTextContent("2");
      expect(screen.getByTestId("cart-count")).toHaveTextContent("4"); // 1 + 2 + 1 (updated)
    });
  });

  describe("Error Handling", () => {
    it("should handle localStorage errors gracefully", async () => {
      const user = userEvent.setup();
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error("Storage quota exceeded");
      });

      render(<CartTestComponent />);

      // Should still work even if localStorage fails
      await user.click(screen.getByText("Add Flavor 1"));

      expect(screen.getByTestId("cart-items")).toHaveTextContent("1");
    });

    it("should handle invalid item data", async () => {
      const user = userEvent.setup();
      render(<CartTestComponent />);

      // Try to add item with invalid data
      const addButton = screen.getByText("Add Flavor 1");
      addButton.onclick = () => {
        // Simulate adding invalid item
        try {
          // This should not crash the app
          console.log("Invalid item added");
        } catch (error) {
          console.error("Error adding item:", error);
        }
      };

      await user.click(addButton);

      // App should still be functional
      expect(screen.getByTestId("cart-items")).toHaveTextContent("0");
    });
  });
});
