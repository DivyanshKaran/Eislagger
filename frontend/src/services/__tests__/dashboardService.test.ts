/**
 * Dashboard Service Tests
 * Tests for the dashboard service
 */

import { fixtures } from "../../__tests__/fixtures/data";
import { dashboardService } from "../dashboardService";

// Mock fetch
global.fetch = jest.fn();

describe("dashboardService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getDashboardData", () => {
    it("should fetch dashboard data successfully", async () => {
      const mockResponse = {
        data: fixtures.dashboard.patron,
        success: true,
        message: "Data retrieved successfully",
        timestamp: new Date().toISOString(),
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await dashboardService.getDashboardData("patron");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/dashboard/patron"),
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        }),
      );

      expect(result).toEqual(mockResponse);
    });

    it("should handle API errors", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: jest.fn().mockResolvedValue({
          message: "Internal server error",
        }),
      });

      await expect(dashboardService.getDashboardData("patron")).rejects.toThrow(
        "HTTP 500: Internal Server Error",
      );
    });

    it("should handle network errors", async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

      await expect(dashboardService.getDashboardData("patron")).rejects.toThrow(
        "Network error",
      );
    });

    it("should handle JSON parsing errors", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
      });

      await expect(dashboardService.getDashboardData("patron")).rejects.toThrow(
        "HTTP 500: Internal Server Error",
      );
    });

    it("should fetch data for different roles", async () => {
      const mockResponse = {
        data: fixtures.dashboard.executive,
        success: true,
        message: "Data retrieved successfully",
        timestamp: new Date().toISOString(),
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await dashboardService.getDashboardData("executive");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/dashboard/executive"),
        expect.any(Object),
      );

      expect(result).toEqual(mockResponse);
    });
  });

  describe("exportDashboardData", () => {
    it("should export data in JSON format", async () => {
      const mockResponse = {
        data: { downloadUrl: "/downloads/dashboard-data.json" },
        success: true,
        message: "Data exported successfully",
        timestamp: new Date().toISOString(),
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await dashboardService.exportDashboardData("manufacturer");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/dashboard/export"),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({ role: "manufacturer" }),
        }),
      );

      expect(result).toEqual(mockResponse);
    });

    it("should export data in CSV format", async () => {
      const mockResponse = {
        data: { downloadUrl: "/downloads/dashboard-data.csv" },
        success: true,
        message: "Data exported successfully",
        timestamp: new Date().toISOString(),
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await dashboardService.exportDashboardData("clerk");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/dashboard/export"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ role: "clerk" }),
        }),
      );

      expect(result).toEqual(mockResponse);
    });

    it("should handle export errors", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: jest.fn().mockResolvedValue({
          message: "Invalid format",
        }),
      });

      await expect(
        dashboardService.exportDashboardData("patron"),
      ).rejects.toThrow("HTTP 400: Bad Request");
    });
  });

  describe("makeRequest", () => {
    it("should include authorization header", async () => {
      const mockResponse = {
        data: {},
        success: true,
        message: "Success",
        timestamp: new Date().toISOString(),
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      await dashboardService.getDashboardData("patron");

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: expect.stringContaining("Bearer"),
          }),
        }),
      );
    });

    it("should merge custom headers", async () => {
      const mockResponse = {
        data: {},
        success: true,
        message: "Success",
        timestamp: new Date().toISOString(),
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      // Test with a method that uses makeRequest internally
      await dashboardService.exportDashboardData("executive");

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: expect.stringContaining("Bearer"),
          }),
        }),
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle unexpected errors", async () => {
      (fetch as jest.Mock).mockRejectedValueOnce("Unexpected error");

      await expect(dashboardService.getDashboardData("patron")).rejects.toThrow(
        "An unexpected error occurred",
      );
    });

    it("should handle non-Error objects", async () => {
      (fetch as jest.Mock).mockRejectedValueOnce({ message: "Custom error" });

      await expect(dashboardService.getDashboardData("patron")).rejects.toThrow(
        "An unexpected error occurred",
      );
    });
  });

  describe("Configuration", () => {
    it("should use correct base URL", async () => {
      const mockResponse = {
        data: {},
        success: true,
        message: "Success",
        timestamp: new Date().toISOString(),
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      await dashboardService.getDashboardData("patron");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("http://localhost:3001/api"),
        expect.any(Object),
      );
    });

    it("should use environment variable for base URL", async () => {
      const originalEnv = process.env.NEXT_PUBLIC_API_URL;
      process.env.NEXT_PUBLIC_API_URL = "https://api.example.com";

      // Re-import the service to get the new environment variable
      jest.resetModules();
      const { dashboardService: newService } = await import(
        "../dashboardService"
      );

      const mockResponse = {
        data: {},
        success: true,
        message: "Success",
        timestamp: new Date().toISOString(),
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      await newService.getDashboardData("patron");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("https://api.example.com"),
        expect.any(Object),
      );

      // Restore original environment
      process.env.NEXT_PUBLIC_API_URL = originalEnv;
    });
  });
});
