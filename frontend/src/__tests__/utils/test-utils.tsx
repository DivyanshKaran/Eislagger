/**
 * Test Utilities
 * Reusable utilities for testing React components
 */

import React, { ReactElement } from "react";

import { render, RenderOptions } from "@testing-library/react";
import { ThemeProvider } from "next-themes";

// Mock providers for testing
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {children}
    </ThemeProvider>
  );
};

// Custom render function that includes providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from "@testing-library/react";
export { customRender as render };

// Mock data generators
export const mockUser = {
  id: "1",
  name: "Test User",
  email: "test@example.com",
  role: "patron" as const,
  avatar: "/avatars/test.png",
};

export const mockKPIData = {
  id: "1",
  title: "Test KPI",
  value: "100",
  change: "+5%",
  changeType: "positive" as const,
  progress: 75,
  priority: "high" as const,
  category: "sales",
  trend: [10, 20, 30, 40, 50],
  lastUpdated: new Date().toISOString(),
  description: "Test KPI description",
  icon: "📊",
  bgColor: "bg-blue-100",
};

export const mockChartData = [
  { name: "Jan", value: 100, revenue: 1000 },
  { name: "Feb", value: 200, revenue: 2000 },
  { name: "Mar", value: 300, revenue: 3000 },
  { name: "Apr", value: 400, revenue: 4000 },
  { name: "May", value: 500, revenue: 5000 },
];

export const mockFlavor = {
  id: "1",
  name: "Test Flavor",
  description: "Test flavor description",
  price: 9.99,
  image: "/images/test-flavor.jpg",
  category: "fruity",
  rating: 4.5,
  reviewCount: 100,
  inStock: true,
  tags: ["popular", "fruity"],
  ingredients: ["sugar", "natural flavors"],
  nutritionInfo: {
    calories: 150,
    sugar: 25,
    fat: 0,
  },
};

export const mockOrder = {
  id: "1",
  userId: "1",
  items: [
    {
      id: "1",
      flavor: mockFlavor,
      quantity: 2,
      size: "regular" as const,
      price: 9.99,
    },
  ],
  total: 19.98,
  status: "pending" as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockEmail = {
  id: "1",
  from: "sender@example.com",
  to: "recipient@example.com",
  subject: "Test Email",
  body: "Test email body",
  isRead: false,
  priority: "medium" as const,
  category: "general",
  receivedAt: new Date().toISOString(),
  attachments: [],
};

// Mock functions
export const mockFetch = (data: any, status = 200) => {
  return jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: jest.fn().mockResolvedValue(data),
    text: jest.fn().mockResolvedValue(JSON.stringify(data)),
  });
};

export const mockFetchError = (message = "Network error") => {
  return jest.fn().mockRejectedValue(new Error(message));
};

// Wait for async operations
export const waitFor = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Mock localStorage
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach((key) => delete store[key]);
    }),
  };
};

// Mock sessionStorage
export const mockSessionStorage = () => {
  const store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach((key) => delete store[key]);
    }),
  };
};

// Mock IntersectionObserver
export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;
  window.IntersectionObserverEntry = jest.fn();
};

// Mock ResizeObserver
export const mockResizeObserver = () => {
  const mockResizeObserver = jest.fn();
  mockResizeObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.ResizeObserver = mockResizeObserver;
};

// Mock window.matchMedia
export const mockMatchMedia = (matches = false) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

// Test data factories
export const createMockUser = (overrides = {}) => ({
  ...mockUser,
  ...overrides,
});

export const createMockKPI = (overrides = {}) => ({
  ...mockKPIData,
  ...overrides,
});

export const createMockChartData = (overrides = {}) => ({
  ...mockChartData,
  ...overrides,
});

export const createMockFlavor = (overrides = {}) => ({
  ...mockFlavor,
  ...overrides,
});

export const createMockOrder = (overrides = {}) => ({
  ...mockOrder,
  ...overrides,
});

export const createMockEmail = (overrides = {}) => ({
  ...mockEmail,
  ...overrides,
});

// Assertion helpers
export const expectToBeInTheDocument = (element: HTMLElement) => {
  expect(element).toBeInTheDocument();
};

export const expectToHaveTextContent = (element: HTMLElement, text: string) => {
  expect(element).toHaveTextContent(text);
};

export const expectToHaveClass = (element: HTMLElement, className: string) => {
  expect(element).toHaveClass(className);
};

export const expectToHaveAttribute = (
  element: HTMLElement,
  attribute: string,
  value?: string,
) => {
  if (value) {
    expect(element).toHaveAttribute(attribute, value);
  } else {
    expect(element).toHaveAttribute(attribute);
  }
};

// Event simulation helpers
export const simulateClick = (element: HTMLElement) => {
  element.click();
};

export const simulateChange = (element: HTMLInputElement, value: string) => {
  element.value = value;
  element.dispatchEvent(new Event("change", { bubbles: true }));
};

export const simulateSubmit = (form: HTMLFormElement) => {
  form.dispatchEvent(new Event("submit", { bubbles: true }));
};

// Async testing helpers
export const waitForElementToBeRemoved = async (element: HTMLElement) => {
  const { waitForElementToBeRemoved: rtlWaitForElementToBeRemoved } =
    await import("@testing-library/react");
  return rtlWaitForElementToBeRemoved(element);
};

export const waitForAsync = async (
  callback: () => Promise<void>,
  timeout = 1000,
) => {
  const { waitFor: rtlWaitFor } = await import("@testing-library/react");
  return rtlWaitFor(callback, { timeout });
};

// Mock context providers
export const MockAppProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {children}
    </ThemeProvider>
  );
};

export const MockCartProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const mockCartContext = {
    state: {
      items: [],
      total: 0,
      itemCount: 0,
      isOpen: false,
    },
    addItem: jest.fn(),
    removeItem: jest.fn(),
    updateQuantity: jest.fn(),
    clearCart: jest.fn(),
    toggleCart: jest.fn(),
    openCart: jest.fn(),
    closeCart: jest.fn(),
    getItemQuantity: jest.fn(),
    getItemTotal: jest.fn(),
  };

  return <div data-testid="mock-cart-provider">{children}</div>;
};

export const MockSearchProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const mockSearchContext = {
    state: {
      query: "",
      results: [],
      loading: false,
      error: null,
      history: [],
      suggestions: [],
      filters: {},
      sort: { by: "relevance", order: "desc" as const },
    },
    search: jest.fn(),
    setQuery: jest.fn(),
    setFilters: jest.fn(),
    setSort: jest.fn(),
    clearSearch: jest.fn(),
  };

  return <div data-testid="mock-search-provider">{children}</div>;
};
