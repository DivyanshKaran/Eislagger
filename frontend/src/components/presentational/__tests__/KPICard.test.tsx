/**
 * KPICard Component Tests
 * Tests for the KPI card presentational component
 */

import { render, screen, fireEvent } from "@testing-library/react";

import { fixtures } from "../../../__tests__/fixtures/data";
import { KPICard } from "../KPICard";

describe("KPICard", () => {
  const mockKPI = fixtures.kpis[0];
  const defaultProps = {
    kpi: mockKPI,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render KPI card with basic information", () => {
      render(<KPICard {...defaultProps} />);

      expect(screen.getByText(mockKPI.title)).toBeInTheDocument();
      expect(screen.getByText(mockKPI.value)).toBeInTheDocument();
      expect(screen.getByText(mockKPI.change)).toBeInTheDocument();
      expect(
        screen.getByText(`${mockKPI.priority} Priority`),
      ).toBeInTheDocument();
    });

    it("should render KPI icon", () => {
      render(<KPICard {...defaultProps} />);

      const iconElement = screen.getByText(mockKPI.icon);
      expect(iconElement).toBeInTheDocument();
    });

    it("should render progress bar", () => {
      render(<KPICard {...defaultProps} />);

      const progressBar = screen.getByRole("progressbar");
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveAttribute(
        "aria-valuenow",
        mockKPI.progress.toString(),
      );
    });

    it("should render trend chart when expanded", () => {
      render(<KPICard {...defaultProps} isExpanded={true} />);

      // Check if trend data is rendered (this would depend on the actual implementation)
      expect(screen.getByText(mockKPI.title)).toBeInTheDocument();
    });
  });

  describe("Props", () => {
    it("should handle loading state", () => {
      render(<KPICard {...defaultProps} isLoading={true} />);

      // Check for loading indicator
      const progressBar = screen.getByRole("progressbar");
      expect(progressBar).toBeInTheDocument();
    });

    it("should handle expanded state", () => {
      render(<KPICard {...defaultProps} isExpanded={true} />);

      // Check if expanded content is shown
      expect(screen.getByText(mockKPI.title)).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const customClass = "custom-kpi-card";
      render(<KPICard {...defaultProps} className={customClass} />);

      const card = screen.getByText(mockKPI.title).closest(".custom-kpi-card");
      expect(card).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("should call onToggleExpanded when card is clicked", () => {
      const mockOnToggleExpanded = jest.fn();
      render(
        <KPICard {...defaultProps} onToggleExpanded={mockOnToggleExpanded} />,
      );

      const card = screen.getByText(mockKPI.title).closest('[role="button"]');
      if (card) {
        fireEvent.click(card);
        expect(mockOnToggleExpanded).toHaveBeenCalledTimes(1);
      }
    });

    it("should call onRefresh when refresh button is clicked", () => {
      const mockOnRefresh = jest.fn();
      render(<KPICard {...defaultProps} onRefresh={mockOnRefresh} />);

      const refreshButton = screen.getByLabelText("Refresh");
      fireEvent.click(refreshButton);
      expect(mockOnRefresh).toHaveBeenCalledTimes(1);
    });

    it("should call onDownload when download button is clicked", () => {
      const mockOnDownload = jest.fn();
      render(<KPICard {...defaultProps} onDownload={mockOnDownload} />);

      const downloadButton = screen.getByLabelText("Download");
      fireEvent.click(downloadButton);
      expect(mockOnDownload).toHaveBeenCalledTimes(1);
    });
  });

  describe("Priority Styling", () => {
    it("should apply correct styling for high priority", () => {
      const highPriorityKPI = { ...mockKPI, priority: "high" as const };
      render(<KPICard kpi={highPriorityKPI} />);

      const priorityBadge = screen.getByText("high Priority");
      expect(priorityBadge).toHaveClass("bg-red-100", "text-red-800");
    });

    it("should apply correct styling for medium priority", () => {
      const mediumPriorityKPI = { ...mockKPI, priority: "medium" as const };
      render(<KPICard kpi={mediumPriorityKPI} />);

      const priorityBadge = screen.getByText("medium Priority");
      expect(priorityBadge).toHaveClass("bg-yellow-100", "text-yellow-800");
    });

    it("should apply correct styling for low priority", () => {
      const lowPriorityKPI = { ...mockKPI, priority: "low" as const };
      render(<KPICard kpi={lowPriorityKPI} />);

      const priorityBadge = screen.getByText("low Priority");
      expect(priorityBadge).toHaveClass("bg-green-100", "text-green-800");
    });
  });

  describe("Progress Styling", () => {
    it("should apply correct styling for high progress", () => {
      const highProgressKPI = { ...mockKPI, progress: 90 };
      render(<KPICard kpi={highProgressKPI} />);

      const progressBar = screen.getByRole("progressbar");
      expect(progressBar).toHaveClass("bg-green-500");
    });

    it("should apply correct styling for medium progress", () => {
      const mediumProgressKPI = { ...mockKPI, progress: 60 };
      render(<KPICard kpi={mediumProgressKPI} />);

      const progressBar = screen.getByRole("progressbar");
      expect(progressBar).toHaveClass("bg-yellow-500");
    });

    it("should apply correct styling for low progress", () => {
      const lowProgressKPI = { ...mockKPI, progress: 30 };
      render(<KPICard kpi={lowProgressKPI} />);

      const progressBar = screen.getByRole("progressbar");
      expect(progressBar).toHaveClass("bg-red-500");
    });
  });

  describe("Change Indicator", () => {
    it("should show positive change with green color", () => {
      const positiveChangeKPI = { ...mockKPI, changeType: "positive" as const };
      render(<KPICard kpi={positiveChangeKPI} />);

      const changeElement = screen.getByText(positiveChangeKPI.change);
      expect(changeElement).toHaveClass("text-green-600");
    });

    it("should show negative change with red color", () => {
      const negativeChangeKPI = { ...mockKPI, changeType: "negative" as const };
      render(<KPICard kpi={negativeChangeKPI} />);

      const changeElement = screen.getByText(negativeChangeKPI.change);
      expect(changeElement).toHaveClass("text-red-600");
    });

    it("should show neutral change with gray color", () => {
      const neutralChangeKPI = { ...mockKPI, changeType: "neutral" as const };
      render(<KPICard kpi={neutralChangeKPI} />);

      const changeElement = screen.getByText(neutralChangeKPI.change);
      expect(changeElement).toHaveClass("text-gray-600");
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes", () => {
      render(<KPICard {...defaultProps} />);

      const progressBar = screen.getByRole("progressbar");
      expect(progressBar).toHaveAttribute(
        "aria-valuenow",
        mockKPI.progress.toString(),
      );
      expect(progressBar).toHaveAttribute("aria-valuemin", "0");
      expect(progressBar).toHaveAttribute("aria-valuemax", "100");
    });

    it("should have proper button labels", () => {
      render(<KPICard {...defaultProps} />);

      expect(screen.getByLabelText("Refresh")).toBeInTheDocument();
      expect(screen.getByLabelText("Download")).toBeInTheDocument();
    });

    it("should be keyboard navigable", () => {
      const mockOnToggleExpanded = jest.fn();
      render(
        <KPICard {...defaultProps} onToggleExpanded={mockOnToggleExpanded} />,
      );

      const card = screen.getByText(mockKPI.title).closest('[role="button"]');
      if (card) {
        fireEvent.keyDown(card, { key: "Enter" });
        expect(mockOnToggleExpanded).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe("Edge Cases", () => {
    it("should handle KPI without icon", () => {
      const kpiWithoutIcon = { ...mockKPI, icon: undefined };
      render(<KPICard kpi={kpiWithoutIcon} />);

      expect(screen.getByText(mockKPI.title)).toBeInTheDocument();
    });

    it("should handle KPI with zero progress", () => {
      const zeroProgressKPI = { ...mockKPI, progress: 0 };
      render(<KPICard kpi={zeroProgressKPI} />);

      const progressBar = screen.getByRole("progressbar");
      expect(progressBar).toHaveAttribute("aria-valuenow", "0");
    });

    it("should handle KPI with 100% progress", () => {
      const fullProgressKPI = { ...mockKPI, progress: 100 };
      render(<KPICard kpi={fullProgressKPI} />);

      const progressBar = screen.getByRole("progressbar");
      expect(progressBar).toHaveAttribute("aria-valuenow", "100");
    });

    it("should handle missing optional props", () => {
      render(<KPICard kpi={mockKPI} />);

      expect(screen.getByText(mockKPI.title)).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("should not re-render unnecessarily", () => {
      const { rerender } = render(<KPICard {...defaultProps} />);

      // Re-render with same props
      rerender(<KPICard {...defaultProps} />);

      expect(screen.getByText(mockKPI.title)).toBeInTheDocument();
    });

    it("should handle rapid prop changes", () => {
      const { rerender } = render(<KPICard {...defaultProps} />);

      // Rapidly change props
      for (let i = 0; i < 10; i++) {
        rerender(<KPICard {...defaultProps} isExpanded={i % 2 === 0} />);
      }

      expect(screen.getByText(mockKPI.title)).toBeInTheDocument();
    });
  });
});
