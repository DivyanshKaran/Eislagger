/**
 * useDashboardData Hook Tests
 * Tests for the dashboard data management hook
 */

import { renderHook, waitFor } from "@testing-library/react";

import { fixtures } from "../../__tests__/fixtures/data";
import { mockDashboardService } from "../../__tests__/mocks/services";
import { useDashboardData } from "../useDashboardData";

// Mock the dashboard service
jest.mock("../../services/dashboardService", () => ({
  dashboardService: mockDashboardService,
}));

describe("useDashboardData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDashboardService.resetMockData();
  });

  describe("Initial State", () => {
    it("should initialize with loading state", () => {
      const { result } = renderHook(() => useDashboardData("patron"));

      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBeNull();
      expect(result.current.data).toBeNull();
    });
  });

  describe("Data Fetching", () => {
    it("should fetch dashboard data for patron role", async () => {
      const { result } = renderHook(() => useDashboardData("patron"));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBeDefined();
      expect(result.current.error).toBeNull();
      expect(result.current.data?.kpis).toHaveLength(2);
    });

    it("should fetch dashboard data for manufacturer role", async () => {
      const { result } = renderHook(() => useDashboardData("manufacturer"));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBeDefined();
      expect(result.current.error).toBeNull();
      expect(result.current.data?.kpis).toHaveLength(2);
    });

    it("should fetch dashboard data for executive role", async () => {
      const { result } = renderHook(() => useDashboardData("executive"));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBeDefined();
      expect(result.current.error).toBeNull();
      expect(result.current.data?.kpis).toHaveLength(4);
    });

    it("should fetch dashboard data for clerk role", async () => {
      const { result } = renderHook(() => useDashboardData("clerk"));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBeDefined();
      expect(result.current.error).toBeNull();
      expect(result.current.data?.kpis).toHaveLength(3);
    });
  });

  describe("Error Handling", () => {
    it("should handle API errors gracefully", async () => {
      // Mock service to throw an error
      mockDashboardService.getDashboardData = jest
        .fn()
        .mockRejectedValue(new Error("API Error"));

      const { result } = renderHook(() => useDashboardData("patron"));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe("API Error");
      expect(result.current.data).toBeNull();
    });

    it("should handle network errors", async () => {
      // Mock service to throw a network error
      mockDashboardService.getDashboardData = jest
        .fn()
        .mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => useDashboardData("patron"));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe("Network error");
      expect(result.current.data).toBeNull();
    });
  });

  describe("Data Refresh", () => {
    it("should refresh data when refresh function is called", async () => {
      const { result } = renderHook(() => useDashboardData("patron"));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const initialData = result.current.data;
      expect(initialData).toBeDefined();

      // Call refresh
      result.current.refresh();

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBeDefined();
    });

    it("should maintain data during refresh", async () => {
      const { result } = renderHook(() => useDashboardData("patron"));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const initialData = result.current.data;
      expect(initialData).toBeDefined();

      // Call refresh
      result.current.refresh();

      // Data should still be available during refresh
      expect(result.current.data).toBeDefined();
    });
  });

  describe("Data Export", () => {
    it("should export data in JSON format", async () => {
      const { result } = renderHook(() => useDashboardData("patron"));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const exportSpy = jest.spyOn(mockDashboardService, "exportDashboardData");

      result.current.exportData("json");

      expect(exportSpy).toHaveBeenCalledWith("json");
    });

    it("should export data in CSV format", async () => {
      const { result } = renderHook(() => useDashboardData("patron"));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const exportSpy = jest.spyOn(mockDashboardService, "exportDashboardData");

      result.current.exportData("csv");

      expect(exportSpy).toHaveBeenCalledWith("csv");
    });
  });

  describe("Role-based Data", () => {
    it("should return different data for different roles", async () => {
      const { result: patronResult } = renderHook(() =>
        useDashboardData("patron"),
      );
      const { result: executiveResult } = renderHook(() =>
        useDashboardData("executive"),
      );

      await waitFor(() => {
        expect(patronResult.current.loading).toBe(false);
        expect(executiveResult.current.loading).toBe(false);
      });

      expect(patronResult.current.data?.kpis).toHaveLength(2);
      expect(executiveResult.current.data?.kpis).toHaveLength(4);
    });

    it("should handle invalid role gracefully", async () => {
      const { result } = renderHook(() => useDashboardData("invalid" as any));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Should still return data (fallback to default)
      expect(result.current.data).toBeDefined();
    });
  });

  describe("Performance", () => {
    it("should not refetch data on re-render with same role", async () => {
      const { result, rerender } = renderHook(() => useDashboardData("patron"));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const fetchSpy = jest.spyOn(mockDashboardService, "getDashboardData");

      // Re-render with same role
      rerender();

      // Should not call fetch again
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    it("should refetch data when role changes", async () => {
      const { result, rerender } = renderHook(
        ({ role }) => useDashboardData(role),
        { initialProps: { role: "patron" as const } },
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const fetchSpy = jest.spyOn(mockDashboardService, "getDashboardData");

      // Change role
      rerender({ role: "executive" });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Should call fetch again
      expect(fetchSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe("Data Structure", () => {
    it("should return data with correct structure", async () => {
      const { result } = renderHook(() => useDashboardData("patron"));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const data = result.current.data;
      expect(data).toHaveProperty("kpis");
      expect(data).toHaveProperty("chartData");
      expect(data).toHaveProperty("activities");
      expect(data).toHaveProperty("summary");

      expect(Array.isArray(data?.kpis)).toBe(true);
      expect(Array.isArray(data?.chartData)).toBe(true);
      expect(Array.isArray(data?.activities)).toBe(true);
      expect(typeof data?.summary).toBe("object");
    });

    it("should return KPIs with correct structure", async () => {
      const { result } = renderHook(() => useDashboardData("patron"));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const kpis = result.current.data?.kpis;
      expect(kpis).toBeDefined();
      expect(kpis?.length).toBeGreaterThan(0);

      const firstKpi = kpis?.[0];
      expect(firstKpi).toHaveProperty("id");
      expect(firstKpi).toHaveProperty("title");
      expect(firstKpi).toHaveProperty("value");
      expect(firstKpi).toHaveProperty("change");
      expect(firstKpi).toHaveProperty("progress");
      expect(firstKpi).toHaveProperty("priority");
    });
  });
});
