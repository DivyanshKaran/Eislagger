/**
 * Analytics Flow Integration Tests
 * Tests for the complete analytics dashboard user flow
 */

import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ChartContainer } from "../../containers/ChartContainer";
import { fixtures } from "../fixtures/data";
import { mockAnalyticsService } from "../mocks/services";

// Mock the analytics service
jest.mock("../../services/analyticsService", () => ({
  analyticsService: mockAnalyticsService,
}));

// Mock Next.js router
jest.mock("next/navigation", () => ({
  usePathname: () => "/manufacturer/analytics",
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

describe("Analytics Flow Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAnalyticsService.resetMockData();
  });

  describe("Analytics Dashboard Loading", () => {
    it("should load and display analytics data", async () => {
      render(<ChartContainer type="line" title="Revenue Trends" />);

      // Check for loading state
      expect(screen.getByText("Loading chart data...")).toBeInTheDocument();

      // Wait for data to load
      await waitFor(() => {
        expect(
          screen.queryByText("Loading chart data..."),
        ).not.toBeInTheDocument();
      });

      // Check for chart title
      expect(screen.getByText("Revenue Trends")).toBeInTheDocument();

      // Check if chart is rendered
      expect(screen.getByRole("img", { name: /chart/i })).toBeInTheDocument();
    });

    it("should load different chart types", async () => {
      const { rerender } = render(
        <ChartContainer type="bar" title="Sales Volume" />,
      );

      await waitFor(() => {
        expect(
          screen.queryByText("Loading chart data..."),
        ).not.toBeInDocument();
      });

      expect(screen.getByText("Sales Volume")).toBeInTheDocument();

      // Test different chart type
      rerender(<ChartContainer type="pie" title="Market Share" />);

      await waitFor(() => {
        expect(screen.getByText("Market Share")).toBeInTheDocument();
      });
    });
  });

  describe("Chart Data Filtering", () => {
    it("should filter data by time range", async () => {
      const user = userEvent.setup();
      render(<ChartContainer type="line" title="Revenue Trends" />);

      await waitFor(() => {
        expect(
          screen.queryByText("Loading chart data..."),
        ).not.toBeInTheDocument();
      });

      // Find and click time range selector
      const timeRangeSelector = screen.getByRole("button", {
        name: /time range/i,
      });
      await user.click(timeRangeSelector);

      // Select different time range
      const option = screen.getByText("30 days");
      await user.click(option);

      // Check if chart data was updated
      await waitFor(() => {
        expect(mockAnalyticsService.getChartData).toHaveBeenCalledWith(
          expect.objectContaining({
            timeRange: "30d",
          }),
        );
      });
    });

    it("should filter data by category", async () => {
      const user = userEvent.setup();
      render(<ChartContainer type="bar" title="Sales by Category" />);

      await waitFor(() => {
        expect(
          screen.queryByText("Loading chart data..."),
        ).not.toBeInTheDocument();
      });

      // Find and click category filter
      const categoryFilter = screen.getByRole("button", { name: /category/i });
      await user.click(categoryFilter);

      // Select category
      const option = screen.getByText("Flavors");
      await user.click(option);

      // Check if chart data was updated
      await waitFor(() => {
        expect(mockAnalyticsService.getChartData).toHaveBeenCalledWith(
          expect.objectContaining({
            category: "flavors",
          }),
        );
      });
    });

    it("should filter data by region", async () => {
      const user = userEvent.setup();
      render(<ChartContainer type="line" title="Regional Performance" />);

      await waitFor(() => {
        expect(
          screen.queryByText("Loading chart data..."),
        ).not.toBeInTheDocument();
      });

      // Find and click region filter
      const regionFilter = screen.getByRole("button", { name: /region/i });
      await user.click(regionFilter);

      // Select region
      const option = screen.getByText("North America");
      await user.click(option);

      // Check if chart data was updated
      await waitFor(() => {
        expect(mockAnalyticsService.getChartData).toHaveBeenCalledWith(
          expect.objectContaining({
            region: "north-america",
          }),
        );
      });
    });
  });

  describe("Chart Interactions", () => {
    it("should handle chart hover events", async () => {
      const user = userEvent.setup();
      render(<ChartContainer type="line" title="Revenue Trends" />);

      await waitFor(() => {
        expect(
          screen.queryByText("Loading chart data..."),
        ).not.toBeInTheDocument();
      });

      const chart = screen.getByRole("img", { name: /chart/i });

      // Simulate hover event
      fireEvent.mouseEnter(chart);

      // Check if tooltip is shown
      await waitFor(() => {
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
      });

      // Simulate mouse leave
      fireEvent.mouseLeave(chart);

      // Check if tooltip is hidden
      await waitFor(() => {
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      });
    });

    it("should handle chart click events", async () => {
      const user = userEvent.setup();
      render(<ChartContainer type="bar" title="Sales Volume" />);

      await waitFor(() => {
        expect(
          screen.queryByText("Loading chart data..."),
        ).not.toBeInTheDocument();
      });

      const chart = screen.getByRole("img", { name: /chart/i });

      // Simulate click event
      await user.click(chart);

      // Check if detailed view is shown
      await waitFor(() => {
        expect(screen.getByText("Chart Details")).toBeInTheDocument();
      });
    });

    it("should handle chart zoom", async () => {
      const user = userEvent.setup();
      render(<ChartContainer type="line" title="Revenue Trends" />);

      await waitFor(() => {
        expect(
          screen.queryByText("Loading chart data..."),
        ).not.toBeInTheDocument();
      });

      const chart = screen.getByRole("img", { name: /chart/i });

      // Simulate zoom in
      fireEvent.wheel(chart, { deltaY: -100 });

      // Check if zoom controls are shown
      await waitFor(() => {
        expect(screen.getByText("Zoom In")).toBeInTheDocument();
        expect(screen.getByText("Zoom Out")).toBeInTheDocument();
        expect(screen.getByText("Reset Zoom")).toBeInTheDocument();
      });
    });
  });

  describe("Chart Export and Sharing", () => {
    it("should export chart as image", async () => {
      const user = userEvent.setup();
      render(<ChartContainer type="line" title="Revenue Trends" />);

      await waitFor(() => {
        expect(
          screen.queryByText("Loading chart data..."),
        ).not.toBeInTheDocument();
      });

      const exportButton = screen.getByLabelText("Export Chart");
      await user.click(exportButton);

      // Check if export options are shown
      await waitFor(() => {
        expect(screen.getByText("Export as PNG")).toBeInTheDocument();
        expect(screen.getByText("Export as SVG")).toBeInTheDocument();
        expect(screen.getByText("Export as PDF")).toBeInTheDocument();
      });

      // Click PNG export
      const pngOption = screen.getByText("Export as PNG");
      await user.click(pngOption);

      // Check if export was called
      expect(mockAnalyticsService.exportChart).toHaveBeenCalledWith("png");
    });

    it("should share chart via email", async () => {
      const user = userEvent.setup();
      render(<ChartContainer type="bar" title="Sales Volume" />);

      await waitFor(() => {
        expect(
          screen.queryByText("Loading chart data..."),
        ).not.toBeInTheDocument();
      });

      const shareButton = screen.getByLabelText("Share Chart");
      await user.click(shareButton);

      // Check if share options are shown
      await waitFor(() => {
        expect(screen.getByText("Share via Email")).toBeInTheDocument();
        expect(screen.getByText("Share via Link")).toBeInTheDocument();
      });

      // Click email share
      const emailOption = screen.getByText("Share via Email");
      await user.click(emailOption);

      // Check if email modal is shown
      await waitFor(() => {
        expect(screen.getByText("Share Chart via Email")).toBeInTheDocument();
      });
    });

    it("should generate shareable link", async () => {
      const user = userEvent.setup();
      render(<ChartContainer type="pie" title="Market Share" />);

      await waitFor(() => {
        expect(
          screen.queryByText("Loading chart data..."),
        ).not.toBeInTheDocument();
      });

      const shareButton = screen.getByLabelText("Share Chart");
      await user.click(shareButton);

      const linkOption = screen.getByText("Share via Link");
      await user.click(linkOption);

      // Check if link is generated
      await waitFor(() => {
        expect(
          screen.getByDisplayValue(/https:\/\/.*chart/),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Real-time Data Updates", () => {
    it("should update chart data in real-time", async () => {
      render(<ChartContainer type="line" title="Live Revenue" />);

      await waitFor(() => {
        expect(
          screen.queryByText("Loading chart data..."),
        ).not.toBeInTheDocument();
      });

      // Simulate real-time data update
      mockAnalyticsService.getChartData = jest.fn().mockResolvedValue({
        data: fixtures.analytics.updated,
        success: true,
        message: "Updated",
        timestamp: new Date().toISOString(),
      });

      // Trigger data refresh
      const refreshButton = screen.getByLabelText("Refresh Data");
      fireEvent.click(refreshButton);

      // Check if chart is updated
      await waitFor(() => {
        expect(mockAnalyticsService.getChartData).toHaveBeenCalledTimes(2);
      });
    });

    it("should handle real-time data errors", async () => {
      render(<ChartContainer type="line" title="Live Revenue" />);

      await waitFor(() => {
        expect(
          screen.queryByText("Loading chart data..."),
        ).not.toBeInTheDocument();
      });

      // Simulate real-time data error
      mockAnalyticsService.getChartData = jest
        .fn()
        .mockRejectedValue(new Error("Real-time data unavailable"));

      // Trigger data refresh
      const refreshButton = screen.getByLabelText("Refresh Data");
      fireEvent.click(refreshButton);

      // Check if error is handled
      await waitFor(() => {
        expect(
          screen.getByText("Unable to update chart data"),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Chart Performance", () => {
    it("should handle large datasets efficiently", async () => {
      // Mock large dataset
      const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
        x: i,
        y: Math.random() * 1000,
        label: `Data Point ${i}`,
      }));

      mockAnalyticsService.getChartData = jest.fn().mockResolvedValue({
        data: largeDataset,
        success: true,
        message: "Success",
        timestamp: new Date().toISOString(),
      });

      render(<ChartContainer type="line" title="Large Dataset" />);

      await waitFor(() => {
        expect(
          screen.queryByText("Loading chart data..."),
        ).not.toBeInTheDocument();
      });

      // Chart should render without performance issues
      expect(screen.getByRole("img", { name: /chart/i })).toBeInTheDocument();
    });

    it("should debounce rapid filter changes", async () => {
      const user = userEvent.setup();
      render(<ChartContainer type="line" title="Revenue Trends" />);

      await waitFor(() => {
        expect(
          screen.queryByText("Loading chart data..."),
        ).not.toBeInTheDocument();
      });

      const timeRangeSelector = screen.getByRole("button", {
        name: /time range/i,
      });

      // Rapidly change time range
      await user.click(timeRangeSelector);
      await user.click(screen.getByText("7 days"));

      await user.click(timeRangeSelector);
      await user.click(screen.getByText("30 days"));

      await user.click(timeRangeSelector);
      await user.click(screen.getByText("90 days"));

      // Should only call API once after debounce
      await waitFor(() => {
        expect(mockAnalyticsService.getChartData).toHaveBeenCalledTimes(2); // Initial + debounced
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle API errors gracefully", async () => {
      mockAnalyticsService.getChartData = jest
        .fn()
        .mockRejectedValue(new Error("API Error"));

      render(<ChartContainer type="line" title="Revenue Trends" />);

      await waitFor(() => {
        expect(
          screen.getByText("Error loading chart data"),
        ).toBeInTheDocument();
      });

      // Check if retry button is available
      const retryButton = screen.getByText("Retry");
      expect(retryButton).toBeInTheDocument();
    });

    it("should retry after error", async () => {
      const user = userEvent.setup();

      // Mock service to throw error first, then succeed
      mockAnalyticsService.getChartData = jest
        .fn()
        .mockRejectedValueOnce(new Error("API Error"))
        .mockResolvedValueOnce({
          data: fixtures.analytics.line,
          success: true,
          message: "Success",
          timestamp: new Date().toISOString(),
        });

      render(<ChartContainer type="line" title="Revenue Trends" />);

      await waitFor(() => {
        expect(
          screen.getByText("Error loading chart data"),
        ).toBeInTheDocument();
      });

      const retryButton = screen.getByText("Retry");
      await user.click(retryButton);

      await waitFor(() => {
        expect(screen.getByRole("img", { name: /chart/i })).toBeInTheDocument();
      });
    });

    it("should handle network timeouts", async () => {
      mockAnalyticsService.getChartData = jest
        .fn()
        .mockImplementation(
          () =>
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Network timeout")), 100),
            ),
        );

      render(<ChartContainer type="line" title="Revenue Trends" />);

      await waitFor(() => {
        expect(screen.getByText("Request timed out")).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("should be keyboard navigable", async () => {
      const user = userEvent.setup();
      render(<ChartContainer type="line" title="Revenue Trends" />);

      await waitFor(() => {
        expect(
          screen.queryByText("Loading chart data..."),
        ).not.toBeInTheDocument();
      });

      // Tab through interactive elements
      await user.tab();
      expect(document.activeElement).toBeInTheDocument();

      // Check if focus is visible
      expect(document.activeElement).toHaveClass("focus-visible");
    });

    it("should have proper ARIA labels", async () => {
      render(<ChartContainer type="line" title="Revenue Trends" />);

      await waitFor(() => {
        expect(
          screen.queryByText("Loading chart data..."),
        ).not.toBeInTheDocument();
      });

      // Check for ARIA labels
      expect(screen.getByLabelText("Chart")).toBeInTheDocument();
      expect(screen.getByLabelText("Export Chart")).toBeInTheDocument();
      expect(screen.getByLabelText("Share Chart")).toBeInTheDocument();
      expect(screen.getByLabelText("Refresh Data")).toBeInTheDocument();
    });

    it("should support screen readers", async () => {
      render(<ChartContainer type="line" title="Revenue Trends" />);

      await waitFor(() => {
        expect(
          screen.queryByText("Loading chart data..."),
        ).not.toBeInTheDocument();
      });

      // Check for screen reader text
      expect(screen.getByText("Chart loaded successfully")).toBeInTheDocument();
    });
  });
});
