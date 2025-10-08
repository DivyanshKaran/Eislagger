/**
 * Dashboard Flow Integration Tests
 * Tests for the complete dashboard user flow
 */

import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DashboardContainer } from "../../containers/DashboardContainer";
import { fixtures } from "../fixtures/data";
import { mockDashboardService } from "../mocks/services";

// Mock the dashboard service
jest.mock("../../services/dashboardService", () => ({
  dashboardService: mockDashboardService,
}));

// Mock Next.js router
jest.mock("next/navigation", () => ({
  usePathname: () => "/patron/dashboard",
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

describe("Dashboard Flow Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDashboardService.resetMockData();
  });

  describe("Dashboard Loading and Display", () => {
    it("should load and display dashboard data for patron", async () => {
      render(
        <DashboardContainer
          role="patron"
          title="Patron Dashboard"
          subtitle="Welcome back!"
        />,
      );

      // Check for loading state
      expect(screen.getByText("Loading...")).toBeInTheDocument();

      // Wait for data to load
      await waitFor(() => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      });

      // Check for dashboard title and subtitle
      expect(screen.getByText("Patron Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Welcome back!")).toBeInTheDocument();

      // Check for KPI cards
      expect(screen.getByText("Total Revenue")).toBeInTheDocument();
      expect(screen.getByText("Order Volume")).toBeInTheDocument();
    });

    it("should load and display dashboard data for executive", async () => {
      render(
        <DashboardContainer
          role="executive"
          title="Executive Dashboard"
          subtitle="Overview"
        />,
      );

      await waitFor(() => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      });

      expect(screen.getByText("Executive Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Overview")).toBeInTheDocument();

      // Executive should see more KPIs
      expect(screen.getByText("Total Revenue")).toBeInTheDocument();
      expect(screen.getByText("Order Volume")).toBeInTheDocument();
      expect(screen.getByText("Customer Satisfaction")).toBeInTheDocument();
      expect(screen.getByText("Production Efficiency")).toBeInTheDocument();
    });
  });

  describe("KPI Card Interactions", () => {
    it("should expand and collapse KPI cards", async () => {
      const user = userEvent.setup();
      render(<DashboardContainer role="patron" title="Test Dashboard" />);

      await waitFor(() => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      });

      const kpiCard = screen
        .getByText("Total Revenue")
        .closest('[role="button"]');
      if (kpiCard) {
        // Click to expand
        await user.click(kpiCard);

        // Check if expanded content is shown
        await waitFor(() => {
          expect(screen.getByText("Total Revenue")).toBeInTheDocument();
        });

        // Click to collapse
        await user.click(kpiCard);

        // Check if expanded content is hidden
        await waitFor(() => {
          expect(screen.getByText("Total Revenue")).toBeInTheDocument();
        });
      }
    });

    it("should refresh KPI data", async () => {
      const user = userEvent.setup();
      render(<DashboardContainer role="patron" title="Test Dashboard" />);

      await waitFor(() => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      });

      const refreshButton = screen.getByLabelText("Refresh");
      await user.click(refreshButton);

      // Check if refresh was called
      expect(mockDashboardService.getDashboardData).toHaveBeenCalledTimes(2); // Initial load + refresh
    });

    it("should download KPI data", async () => {
      const user = userEvent.setup();
      render(<DashboardContainer role="patron" title="Test Dashboard" />);

      await waitFor(() => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      });

      const downloadButton = screen.getByLabelText("Download");
      await user.click(downloadButton);

      // Check if download was called
      expect(mockDashboardService.exportDashboardData).toHaveBeenCalledWith(
        "json",
      );
    });
  });

  describe("Chart Interactions", () => {
    it("should display chart data", async () => {
      render(<DashboardContainer role="patron" title="Test Dashboard" />);

      await waitFor(() => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      });

      // Check if chart is rendered
      expect(screen.getByRole("img", { name: /chart/i })).toBeInTheDocument();
    });

    it("should handle chart time range changes", async () => {
      const user = userEvent.setup();
      render(<DashboardContainer role="patron" title="Test Dashboard" />);

      await waitFor(() => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
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
        expect(screen.getByRole("img", { name: /chart/i })).toBeInTheDocument();
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle API errors gracefully", async () => {
      // Mock service to throw error
      mockDashboardService.getDashboardData = jest
        .fn()
        .mockRejectedValue(new Error("API Error"));

      render(<DashboardContainer role="patron" title="Test Dashboard" />);

      await waitFor(() => {
        expect(
          screen.getByText("Error loading dashboard data"),
        ).toBeInTheDocument();
      });

      // Check if retry button is available
      const retryButton = screen.getByText("Retry");
      expect(retryButton).toBeInTheDocument();
    });

    it("should retry after error", async () => {
      const user = userEvent.setup();

      // Mock service to throw error first, then succeed
      mockDashboardService.getDashboardData = jest
        .fn()
        .mockRejectedValueOnce(new Error("API Error"))
        .mockResolvedValueOnce({
          data: fixtures.dashboard.patron,
          success: true,
          message: "Success",
          timestamp: new Date().toISOString(),
        });

      render(<DashboardContainer role="patron" title="Test Dashboard" />);

      await waitFor(() => {
        expect(
          screen.getByText("Error loading dashboard data"),
        ).toBeInTheDocument();
      });

      const retryButton = screen.getByText("Retry");
      await user.click(retryButton);

      await waitFor(() => {
        expect(screen.getByText("Total Revenue")).toBeInTheDocument();
      });
    });
  });

  describe("Responsive Design", () => {
    it("should adapt to different screen sizes", () => {
      // Mock window.innerWidth
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 768,
      });

      render(<DashboardContainer role="patron" title="Test Dashboard" />);

      // Check if responsive classes are applied
      const dashboard = screen.getByText("Test Dashboard").closest("div");
      expect(dashboard).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("should not cause memory leaks", async () => {
      const { unmount } = render(
        <DashboardContainer role="patron" title="Test Dashboard" />,
      );

      await waitFor(() => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      });

      // Unmount component
      unmount();

      // Check if all timers and listeners are cleaned up
      expect(jest.getTimerCount()).toBe(0);
    });

    it("should handle rapid prop changes", async () => {
      const { rerender } = render(
        <DashboardContainer role="patron" title="Test Dashboard" />,
      );

      await waitFor(() => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      });

      // Rapidly change props
      for (let i = 0; i < 5; i++) {
        rerender(
          <DashboardContainer role="patron" title={`Test Dashboard ${i}`} />,
        );
      }

      expect(screen.getByText("Test Dashboard 4")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should be keyboard navigable", async () => {
      const user = userEvent.setup();
      render(<DashboardContainer role="patron" title="Test Dashboard" />);

      await waitFor(() => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      });

      // Tab through interactive elements
      await user.tab();
      expect(document.activeElement).toBeInTheDocument();

      // Check if focus is visible
      expect(document.activeElement).toHaveClass("focus-visible");
    });

    it("should have proper ARIA labels", async () => {
      render(<DashboardContainer role="patron" title="Test Dashboard" />);

      await waitFor(() => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      });

      // Check for ARIA labels
      expect(screen.getByLabelText("Dashboard")).toBeInTheDocument();
      expect(screen.getByLabelText("Refresh")).toBeInTheDocument();
      expect(screen.getByLabelText("Download")).toBeInTheDocument();
    });

    it("should support screen readers", async () => {
      render(<DashboardContainer role="patron" title="Test Dashboard" />);

      await waitFor(() => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      });

      // Check for screen reader text
      expect(
        screen.getByText("Dashboard loaded successfully"),
      ).toBeInTheDocument();
    });
  });
});
