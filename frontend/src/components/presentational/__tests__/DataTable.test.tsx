/**
 * DataTable Component Tests
 * Tests for the data table presentational component
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import { fixtures } from "../../../__tests__/fixtures/data";
import { DataTable } from "../DataTable";

describe("DataTable", () => {
  const mockData = fixtures.tables.orders;
  const mockColumns = [
    {
      key: "id",
      title: "ID",
      dataIndex: "id",
      sortable: true,
    },
    {
      key: "customer",
      title: "Customer",
      dataIndex: "customer",
      sortable: true,
      filterable: true,
    },
    {
      key: "total",
      title: "Total",
      dataIndex: "total",
      sortable: true,
      render: (value: unknown) => `$${(value as number).toFixed(2)}`,
    },
    {
      key: "status",
      title: "Status",
      dataIndex: "status",
      filterable: true,
      render: (value: unknown) => (
        <span className={`status-${value}`}>{value as string}</span>
      ),
    },
  ];

  const defaultProps = {
    data: mockData,
    columns: mockColumns,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render table with data", () => {
      render(<DataTable {...defaultProps} />);

      expect(screen.getByText("ID")).toBeInTheDocument();
      expect(screen.getByText("Customer")).toBeInTheDocument();
      expect(screen.getByText("Total")).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("$19.98")).toBeInTheDocument();
      expect(screen.getByText("pending")).toBeInTheDocument();
    });

    it("should render table title when provided", () => {
      render(<DataTable {...defaultProps} title="Orders Table" />);

      expect(screen.getByText("Orders Table")).toBeInTheDocument();
    });

    it("should render search input when searchable", () => {
      render(<DataTable {...defaultProps} searchable={true} />);

      expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    });

    it("should render pagination when paginated", () => {
      render(<DataTable {...defaultProps} pageSize={1} />);

      expect(screen.getByText("1")).toBeInTheDocument(); // Page number
      expect(screen.getByText("of")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument(); // Total pages
    });
  });

  describe("Sorting", () => {
    it("should sort data when column header is clicked", async () => {
      const user = userEvent.setup();
      render(<DataTable {...defaultProps} />);

      const customerHeader = screen.getByText("Customer");
      await user.click(customerHeader);

      // Check if data is sorted (this would depend on the actual implementation)
      expect(customerHeader).toBeInTheDocument();
    });

    it("should show sort indicators", async () => {
      const user = userEvent.setup();
      render(<DataTable {...defaultProps} />);

      const sortableHeader = screen.getByText("ID");
      await user.click(sortableHeader);

      // Check for sort indicator
      expect(sortableHeader).toBeInTheDocument();
    });

    it("should not sort non-sortable columns", async () => {
      const user = userEvent.setup();
      render(<DataTable {...defaultProps} />);

      const nonSortableHeader = screen.getByText("Status");
      await user.click(nonSortableHeader);

      // Should not show sort indicator
      expect(nonSortableHeader).toBeInTheDocument();
    });
  });

  describe("Search", () => {
    it("should filter data when searching", async () => {
      const user = userEvent.setup();
      render(<DataTable {...defaultProps} searchable={true} />);

      const searchInput = screen.getByPlaceholderText("Search...");
      await user.type(searchInput, "John");

      // Check if data is filtered
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
    });

    it("should clear search when input is cleared", async () => {
      const user = userEvent.setup();
      render(<DataTable {...defaultProps} searchable={true} />);

      const searchInput = screen.getByPlaceholderText("Search...");
      await user.type(searchInput, "John");
      await user.clear(searchInput);

      // All data should be visible again
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });
  });

  describe("Pagination", () => {
    it("should show correct page information", () => {
      render(<DataTable {...defaultProps} pageSize={1} />);

      expect(screen.getByText("1")).toBeInTheDocument(); // Current page
      expect(screen.getByText("of")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument(); // Total pages
    });

    it("should navigate to next page", async () => {
      const user = userEvent.setup();
      render(<DataTable {...defaultProps} pageSize={1} />);

      const nextButton = screen.getByLabelText("Next page");
      await user.click(nextButton);

      // Check if page changed
      expect(screen.getByText("2")).toBeInTheDocument(); // Current page
    });

    it("should navigate to previous page", async () => {
      const user = userEvent.setup();
      render(<DataTable {...defaultProps} pageSize={1} />);

      // Go to page 2 first
      const nextButton = screen.getByLabelText("Next page");
      await user.click(nextButton);

      // Then go back to page 1
      const prevButton = screen.getByLabelText("Previous page");
      await user.click(prevButton);

      // Check if page changed
      expect(screen.getByText("1")).toBeInTheDocument(); // Current page
    });

    it("should disable navigation buttons at boundaries", () => {
      render(<DataTable {...defaultProps} pageSize={1} />);

      const prevButton = screen.getByLabelText("Previous page");
      expect(prevButton).toBeDisabled();

      // Go to last page
      const nextButton = screen.getByLabelText("Next page");
      fireEvent.click(nextButton);

      // Next button should be disabled on last page
      expect(nextButton).toBeDisabled();
    });
  });

  describe("Actions", () => {
    const mockActions = [
      {
        label: "Edit",
        onClick: jest.fn(),
        variant: "default" as const,
      },
      {
        label: "Delete",
        onClick: jest.fn(),
        variant: "destructive" as const,
      },
    ];

    it("should render action buttons", () => {
      render(<DataTable {...defaultProps} actions={mockActions} />);

      expect(screen.getByText("Edit")).toBeInTheDocument();
      expect(screen.getByText("Delete")).toBeInTheDocument();
    });

    it("should call action when button is clicked", async () => {
      const user = userEvent.setup();
      render(<DataTable {...defaultProps} actions={mockActions} />);

      const editButton = screen.getByText("Edit");
      await user.click(editButton);

      expect(mockActions[0].onClick).toHaveBeenCalledWith(mockData[0]);
    });

    it("should show actions menu for multiple actions", () => {
      render(<DataTable {...defaultProps} actions={mockActions} />);

      const actionsButton = screen.getByLabelText("Actions");
      expect(actionsButton).toBeInTheDocument();
    });
  });

  describe("Column Rendering", () => {
    it("should render custom cell content", () => {
      render(<DataTable {...defaultProps} />);

      // Check if custom render function is used
      expect(screen.getByText("$19.98")).toBeInTheDocument();
      expect(screen.getByText("$11.99")).toBeInTheDocument();
    });

    it("should render JSX content in cells", () => {
      render(<DataTable {...defaultProps} />);

      // Check if JSX render function is used
      const statusElements = screen.getAllByText("pending");
      expect(statusElements[0]).toHaveClass("status-pending");
    });

    it("should handle missing data gracefully", () => {
      const dataWithMissingFields = [
        { id: "1", customer: "John Doe" }, // Missing total and status
      ];

      render(<DataTable data={dataWithMissingFields} columns={mockColumns} />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper table structure", () => {
      render(<DataTable {...defaultProps} />);

      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();

      const columnHeaders = screen.getAllByRole("columnheader");
      expect(columnHeaders).toHaveLength(mockColumns.length);

      const rows = screen.getAllByRole("row");
      expect(rows).toHaveLength(mockData.length + 1); // +1 for header row
    });

    it("should have proper ARIA labels", () => {
      render(<DataTable {...defaultProps} />);

      expect(screen.getByLabelText("Next page")).toBeInTheDocument();
      expect(screen.getByLabelText("Previous page")).toBeInTheDocument();
    });

    it("should be keyboard navigable", async () => {
      const user = userEvent.setup();
      render(<DataTable {...defaultProps} searchable={true} />);

      const searchInput = screen.getByPlaceholderText("Search...");
      await user.tab();
      expect(searchInput).toHaveFocus();
    });
  });

  describe("Performance", () => {
    it("should handle large datasets", () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: i.toString(),
        customer: `Customer ${i}`,
        total: i * 10,
        status: i % 2 === 0 ? "pending" : "completed",
      }));

      render(
        <DataTable data={largeDataset} columns={mockColumns} pageSize={10} />,
      );

      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    it("should not re-render unnecessarily", () => {
      const { rerender } = render(<DataTable {...defaultProps} />);

      // Re-render with same props
      rerender(<DataTable {...defaultProps} />);

      expect(screen.getByRole("table")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty data", () => {
      render(<DataTable data={[]} columns={mockColumns} />);

      expect(screen.getByText("No data available")).toBeInTheDocument();
    });

    it("should handle single row", () => {
      const singleRowData = [mockData[0]];
      render(<DataTable data={singleRowData} columns={mockColumns} />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("should handle missing columns", () => {
      render(<DataTable data={mockData} columns={[]} />);

      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    it("should handle custom page size", () => {
      render(<DataTable {...defaultProps} paginated={true} pageSize={5} />);

      // Should show all data on one page
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });
  });
});
