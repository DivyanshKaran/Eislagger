/**
 * Mock Services
 * Mock implementations of service classes for testing
 */

import { mockKPIData, mockChartData, mockUser } from "../utils/test-utils";

// Mock Dashboard Service
export class MockDashboardService {
  private mockData: any = {
    kpis: [mockKPIData],
    chartData: mockChartData,
    activities: [],
    summary: {
      totalRevenue: 10000,
      totalOrders: 100,
      totalCustomers: 50,
      growthRate: 5.2,
    },
  };

  async getDashboardData(role: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: this.mockData,
          success: true,
          message: "Data retrieved successfully",
          timestamp: new Date().toISOString(),
        });
      }, 100);
    });
  }

  async exportDashboardData(format: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: { downloadUrl: "/downloads/dashboard-data.json" },
          success: true,
          message: "Data exported successfully",
          timestamp: new Date().toISOString(),
        });
      }, 100);
    });
  }

  setMockData(data: any) {
    this.mockData = data;
  }

  resetMockData() {
    this.mockData = {
      kpis: [mockKPIData],
      chartData: mockChartData,
      activities: [],
      summary: {
        totalRevenue: 10000,
        totalOrders: 100,
        totalCustomers: 50,
        growthRate: 5.2,
      },
    };
  }
}

// Mock Analytics Service
export class MockAnalyticsService {
  private mockData: any = {
    kpiMetrics: [mockKPIData],
    chartData: mockChartData,
    insights: [],
    trends: {
      revenue: { direction: "up", percentage: 5.2 },
      orders: { direction: "up", percentage: 3.1 },
      customers: { direction: "down", percentage: -1.2 },
    },
  };

  private cache = new Map();

  async getKPIMetrics(role: string, timeRange: string = "30d") {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.mockData.kpiMetrics);
      }, 100);
    });
  }

  async getChartData(chartType: string, timeRange: string = "30d") {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.mockData.chartData);
      }, 100);
    });
  }

  async getInsights(role: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.mockData.insights);
      }, 100);
    });
  }

  async getTrends(role: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.mockData.trends);
      }, 100);
    });
  }

  setMockData(data: any) {
    this.mockData = data;
  }

  resetMockData() {
    this.mockData = {
      kpiMetrics: [mockKPIData],
      chartData: mockChartData,
      insights: [],
      trends: {
        revenue: { direction: "up", percentage: 5.2 },
        orders: { direction: "up", percentage: 3.1 },
        customers: { direction: "down", percentage: -1.2 },
      },
    };
  }

  clearCache() {
    this.cache.clear();
  }
}

// Mock API Response
export const createMockApiResponse = <T>(
  data: T,
  success = true,
  message = "Success",
) => ({
  data,
  success,
  message,
  timestamp: new Date().toISOString(),
});

// Mock API Error
export const createMockApiError = (message = "API Error", status = 500) => ({
  message,
  status,
  timestamp: new Date().toISOString(),
});

// Mock Fetch Implementation
export const mockFetch = (
  responses: Array<{ data: any; status?: number; delay?: number }>,
) => {
  let callCount = 0;

  return jest.fn().mockImplementation((url: string, options?: RequestInit) => {
    const response = responses[callCount] || responses[responses.length - 1];
    callCount++;

    return new Promise((resolve, reject) => {
      const delay = response.delay || 0;

      setTimeout(() => {
        if (response.status && response.status >= 400) {
          reject(
            new Error(
              `HTTP ${response.status}: ${response.message || "Error"}`,
            ),
          );
        } else {
          resolve({
            ok: true,
            status: response.status || 200,
            json: () => Promise.resolve(response.data),
            text: () => Promise.resolve(JSON.stringify(response.data)),
          });
        }
      }, delay);
    });
  });
};

// Mock Fetch with Error
export const mockFetchError = (message = "Network error", status = 500) => {
  return jest.fn().mockRejectedValue(new Error(message));
};

// Mock Fetch with Success
export const mockFetchSuccess = (data: any, status = 200, delay = 0) => {
  return jest.fn().mockImplementation(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ok: true,
          status,
          json: () => Promise.resolve(data),
          text: () => Promise.resolve(JSON.stringify(data)),
        });
      }, delay);
    });
  });
};

// Mock Service Instances
export const mockDashboardService = new MockDashboardService();
export const mockAnalyticsService = new MockAnalyticsService();

// Service Mock Factory
export const createServiceMock = (
  serviceName: string,
  methods: Record<string, jest.Mock>,
) => {
  const mock = {
    [serviceName]: methods,
  };

  return mock;
};

// Mock Context Values
export const mockAppContextValue = {
  state: {
    user: mockUser,
    theme: "light",
    notifications: [],
    sidebar: { collapsed: false },
    loading: false,
    error: null,
  },
  dispatch: jest.fn(),
  actions: {
    setUser: jest.fn(),
    setTheme: jest.fn(),
    addNotification: jest.fn(),
    removeNotification: jest.fn(),
    toggleSidebar: jest.fn(),
    setLoading: jest.fn(),
    setError: jest.fn(),
  },
};

export const mockCartContextValue = {
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

export const mockSearchContextValue = {
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

// Mock Hook Return Values
export const mockUseDashboardData = {
  data: {
    kpis: [mockKPIData],
    chartData: mockChartData,
    activities: [],
    summary: {
      totalRevenue: 10000,
      totalOrders: 100,
      totalCustomers: 50,
      growthRate: 5.2,
    },
  },
  loading: false,
  error: null,
  refresh: jest.fn(),
  exportData: jest.fn(),
};

export const mockUseCart = {
  cartItems: [],
  cartSummary: {
    total: 0,
    itemCount: 0,
    isEmpty: true,
    hasItems: false,
  },
  isCartOpen: false,
  addToCart: jest.fn(),
  removeFromCart: jest.fn(),
  updateCartItemQuantity: jest.fn(),
  clearCart: jest.fn(),
  toggleCart: jest.fn(),
  openCart: jest.fn(),
  closeCart: jest.fn(),
  getItemQuantity: jest.fn(),
  getItemTotal: jest.fn(),
};

export const mockUseSearch = {
  searchState: {
    query: "",
    results: [],
    loading: false,
    error: null,
    hasResults: false,
    isEmpty: true,
  },
  searchHistory: [],
  searchSuggestions: [],
  performSearch: jest.fn(),
  setQuery: jest.fn(),
  setFilters: jest.fn(),
  setSort: jest.fn(),
  clearSearch: jest.fn(),
};

export const mockUseForm = {
  values: {},
  errors: {},
  touched: {},
  dirty: {},
  isSubmitting: false,
  isValid: true,
  isDirty: false,
  setValue: jest.fn(),
  setError: jest.fn(),
  setTouched: jest.fn(),
  setDirty: jest.fn(),
  handleSubmit: jest.fn(),
  reset: jest.fn(),
  validateField: jest.fn(),
  validateForm: jest.fn(),
};

// Mock Local Storage
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

// Mock Session Storage
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
