/**
 * Dashboard Utils Tests
 * Tests for dashboard utility functions
 */

import { fixtures } from "../../__tests__/fixtures/data";
import {
  getDefaultDashboardConfig,
  calculateDashboardMetrics,
  getKPIPriorityColor,
  getProgressColor,
  getProgressBarColor,
  getKPIIconName,
  sortKPIs,
  filterKPIs,
  getKPICategories,
  calculateKPITrends,
  generateKPISummary,
  exportDashboardData,
} from "../dashboardUtils";

describe("dashboardUtils", () => {
  describe("getDefaultDashboardConfig", () => {
    it("should return default dashboard configuration", () => {
      const config = getDefaultDashboardConfig();

      expect(config).toEqual({
        refreshInterval: 5 * 60 * 1000, // 5 minutes
        autoRefresh: true,
        showAnimations: true,
      });
    });
  });

  describe("calculateDashboardMetrics", () => {
    it("should calculate metrics for empty KPIs", () => {
      const metrics = calculateDashboardMetrics([]);

      expect(metrics).toEqual({
        totalKPIs: 0,
        activeKPIs: 0,
        lastUpdated: expect.any(Date),
        dataQuality: "poor",
      });
    });

    it("should calculate metrics for KPIs with excellent data quality", () => {
      const kpis = fixtures.kpis.map((kpi) => ({ ...kpi, progress: 95 }));
      const metrics = calculateDashboardMetrics(kpis);

      expect(metrics.totalKPIs).toBe(4);
      expect(metrics.activeKPIs).toBe(4);
      expect(metrics.dataQuality).toBe("excellent");
    });

    it("should calculate metrics for KPIs with good data quality", () => {
      const kpis = fixtures.kpis.map((kpi) => ({ ...kpi, progress: 80 }));
      const metrics = calculateDashboardMetrics(kpis);

      expect(metrics.totalKPIs).toBe(4);
      expect(metrics.activeKPIs).toBe(4);
      expect(metrics.dataQuality).toBe("good");
    });

    it("should calculate metrics for KPIs with fair data quality", () => {
      const kpis = fixtures.kpis.map((kpi) => ({ ...kpi, progress: 60 }));
      const metrics = calculateDashboardMetrics(kpis);

      expect(metrics.totalKPIs).toBe(4);
      expect(metrics.activeKPIs).toBe(4);
      expect(metrics.dataQuality).toBe("fair");
    });

    it("should calculate metrics for KPIs with poor data quality", () => {
      const kpis = fixtures.kpis.map((kpi) => ({ ...kpi, progress: 30 }));
      const metrics = calculateDashboardMetrics(kpis);

      expect(metrics.totalKPIs).toBe(4);
      expect(metrics.activeKPIs).toBe(4);
      expect(metrics.dataQuality).toBe("poor");
    });

    it("should count only active KPIs", () => {
      const kpis = [
        { ...fixtures.kpis[0], progress: 80 },
        { ...fixtures.kpis[1], progress: 0 },
        { ...fixtures.kpis[2], progress: 50 },
      ];
      const metrics = calculateDashboardMetrics(kpis);

      expect(metrics.totalKPIs).toBe(3);
      expect(metrics.activeKPIs).toBe(2);
    });
  });

  describe("getKPIPriorityColor", () => {
    it("should return correct color for high priority", () => {
      expect(getKPIPriorityColor("high")).toBe(
        "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      );
    });

    it("should return correct color for medium priority", () => {
      expect(getKPIPriorityColor("medium")).toBe(
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      );
    });

    it("should return correct color for low priority", () => {
      expect(getKPIPriorityColor("low")).toBe(
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      );
    });
  });

  describe("getProgressColor", () => {
    it("should return correct color for high progress", () => {
      expect(getProgressColor(90)).toBe("text-green-600 dark:text-green-400");
    });

    it("should return correct color for medium progress", () => {
      expect(getProgressColor(60)).toBe("text-yellow-600 dark:text-yellow-400");
    });

    it("should return correct color for low progress", () => {
      expect(getProgressColor(30)).toBe("text-red-600 dark:text-red-400");
    });
  });

  describe("getProgressBarColor", () => {
    it("should return correct color for high progress", () => {
      expect(getProgressBarColor(90)).toBe("bg-green-500");
    });

    it("should return correct color for medium progress", () => {
      expect(getProgressBarColor(60)).toBe("bg-yellow-500");
    });

    it("should return correct color for low progress", () => {
      expect(getProgressBarColor(30)).toBe("bg-red-500");
    });
  });

  describe("getKPIIconName", () => {
    it("should return correct icon for known KPI types", () => {
      expect(getKPIIconName("orders")).toBe("📦");
      expect(getKPIIconName("revenue")).toBe("💰");
      expect(getKPIIconName("customers")).toBe("👥");
      expect(getKPIIconName("production")).toBe("🏭");
      expect(getKPIIconName("sales")).toBe("📈");
      expect(getKPIIconName("transactions")).toBe("💳");
      expect(getKPIIconName("market")).toBe("🌐");
      expect(getKPIIconName("favorites")).toBe("❤️");
    });

    it("should return default icon for unknown KPI types", () => {
      expect(getKPIIconName("unknown")).toBe("📊");
      expect(getKPIIconName("")).toBe("📊");
    });

    it("should be case insensitive", () => {
      expect(getKPIIconName("ORDERS")).toBe("📦");
      expect(getKPIIconName("Revenue")).toBe("💰");
    });
  });

  describe("sortKPIs", () => {
    it("should sort KPIs by priority", () => {
      const sorted = sortKPIs(fixtures.kpis, "priority");

      expect(sorted[0].priority).toBe("high");
      expect(sorted[1].priority).toBe("high");
      expect(sorted[2].priority).toBe("medium");
      expect(sorted[3].priority).toBe("medium");
    });

    it("should sort KPIs by progress", () => {
      const sorted = sortKPIs(fixtures.kpis, "progress");

      expect(sorted[0].progress).toBe(96);
      expect(sorted[1].progress).toBe(92);
      expect(sorted[2].progress).toBe(87);
      expect(sorted[3].progress).toBe(85);
    });

    it("should sort KPIs by title", () => {
      const sorted = sortKPIs(fixtures.kpis, "title");

      expect(sorted[0].title).toBe("Customer Satisfaction");
      expect(sorted[1].title).toBe("Order Volume");
      expect(sorted[2].title).toBe("Production Efficiency");
      expect(sorted[3].title).toBe("Total Revenue");
    });

    it("should default to priority sorting", () => {
      const sorted = sortKPIs(fixtures.kpis);

      expect(sorted[0].priority).toBe("high");
    });
  });

  describe("filterKPIs", () => {
    it("should filter KPIs by category", () => {
      const filtered = filterKPIs(fixtures.kpis, { category: "financial" });

      expect(filtered).toHaveLength(1);
      expect(filtered[0].category).toBe("financial");
    });

    it("should filter KPIs by priority", () => {
      const filtered = filterKPIs(fixtures.kpis, { priority: "high" });

      expect(filtered).toHaveLength(2);
      expect(filtered.every((kpi) => kpi.priority === "high")).toBe(true);
    });

    it("should filter KPIs by minimum progress", () => {
      const filtered = filterKPIs(fixtures.kpis, { minProgress: 90 });

      expect(filtered).toHaveLength(2);
      expect(filtered.every((kpi) => kpi.progress >= 90)).toBe(true);
    });

    it("should filter KPIs by maximum progress", () => {
      const filtered = filterKPIs(fixtures.kpis, { maxProgress: 90 });

      expect(filtered).toHaveLength(2);
      expect(filtered.every((kpi) => kpi.progress <= 90)).toBe(true);
    });

    it("should filter KPIs by multiple criteria", () => {
      const filtered = filterKPIs(fixtures.kpis, {
        priority: "high",
        minProgress: 85,
      });

      expect(filtered).toHaveLength(2);
      expect(
        filtered.every((kpi) => kpi.priority === "high" && kpi.progress >= 85),
      ).toBe(true);
    });

    it("should return all KPIs when no filters applied", () => {
      const filtered = filterKPIs(fixtures.kpis, {});

      expect(filtered).toHaveLength(4);
    });
  });

  describe("getKPICategories", () => {
    it("should return unique categories", () => {
      const categories = getKPICategories(fixtures.kpis);

      expect(categories).toEqual(["financial", "operations", "quality"]);
    });

    it("should return empty array for empty KPIs", () => {
      const categories = getKPICategories([]);

      expect(categories).toEqual([]);
    });
  });

  describe("calculateKPITrends", () => {
    it("should calculate trends correctly", () => {
      const trends = calculateKPITrends(fixtures.kpis);

      expect(trends.improving).toBe(2);
      expect(trends.declining).toBe(1);
      expect(trends.stable).toBe(1);
    });

    it("should handle KPIs with no trend data", () => {
      const kpisWithoutTrends = fixtures.kpis.map((kpi) => ({
        ...kpi,
        trend: [],
      }));
      const trends = calculateKPITrends(kpisWithoutTrends);

      expect(trends.improving).toBe(0);
      expect(trends.declining).toBe(0);
      expect(trends.stable).toBe(4);
    });

    it("should handle empty KPIs", () => {
      const trends = calculateKPITrends([]);

      expect(trends.improving).toBe(0);
      expect(trends.declining).toBe(0);
      expect(trends.stable).toBe(0);
    });
  });

  describe("generateKPISummary", () => {
    it("should generate summary for KPIs", () => {
      const summary = generateKPISummary(fixtures.kpis);

      expect(summary.totalValue).toBe("4");
      expect(summary.averageProgress).toBe(90);
      expect(summary.topPerformer).toEqual(fixtures.kpis[2]); // Customer Satisfaction with 96% progress
      expect(summary.needsAttention).toHaveLength(0); // All KPIs have progress >= 50
    });

    it("should identify KPIs needing attention", () => {
      const kpisWithLowProgress = [
        ...fixtures.kpis,
        { ...fixtures.kpis[0], id: "5", progress: 30 },
        { ...fixtures.kpis[1], id: "6", progress: 40 },
      ];
      const summary = generateKPISummary(kpisWithLowProgress);

      expect(summary.needsAttention).toHaveLength(2);
      expect(summary.needsAttention.every((kpi) => kpi.progress < 50)).toBe(
        true,
      );
    });

    it("should handle empty KPIs", () => {
      const summary = generateKPISummary([]);

      expect(summary.totalValue).toBe("0");
      expect(summary.averageProgress).toBe(0);
      expect(summary.topPerformer).toBeNull();
      expect(summary.needsAttention).toEqual([]);
    });
  });

  describe("exportDashboardData", () => {
    beforeEach(() => {
      // Mock URL.createObjectURL and URL.revokeObjectURL
      global.URL.createObjectURL = jest.fn(() => "mock-url");
      global.URL.revokeObjectURL = jest.fn();

      // Mock document.createElement and appendChild
      const mockLink = {
        href: "",
        download: "",
        click: jest.fn(),
      };
      global.document.createElement = jest.fn(() => mockLink as any);
      global.document.body.appendChild = jest.fn();
      global.document.body.removeChild = jest.fn();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should export data as JSON", () => {
      exportDashboardData(fixtures.kpis, "json", "test-dashboard");

      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(global.document.createElement).toHaveBeenCalledWith("a");
    });

    it("should export data as CSV", () => {
      exportDashboardData(fixtures.kpis, "csv", "test-dashboard");

      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(global.document.createElement).toHaveBeenCalledWith("a");
    });

    it("should use default filename when not provided", () => {
      exportDashboardData(fixtures.kpis, "json");

      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(global.document.createElement).toHaveBeenCalledWith("a");
    });

    it("should handle export errors gracefully", () => {
      // Mock URL.createObjectURL to throw error
      global.URL.createObjectURL = jest.fn(() => {
        throw new Error("Export failed");
      });

      expect(() => {
        exportDashboardData(fixtures.kpis, "json");
      }).toThrow("Export failed");
    });
  });
});
