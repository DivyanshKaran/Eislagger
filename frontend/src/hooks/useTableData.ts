import { useState, useMemo } from "react";

export interface TableFilter {
  key: string;
  value: unknown;
  operator?:
    | "equals"
    | "contains"
    | "startsWith"
    | "endsWith"
    | "greaterThan"
    | "lessThan";
}

export interface TableSort {
  key: string;
  direction: "asc" | "desc";
}

export interface UseTableDataOptions<T> {
  data: T[];
  initialSort?: TableSort;
  initialFilters?: TableFilter[];
  searchFields?: string[];
}

export function useTableData<T extends Record<string, unknown>>({
  data,
  initialSort,
  initialFilters = [],
  searchFields = [],
}: UseTableDataOptions<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState<TableSort | null>(initialSort || null);
  const [filters, setFilters] = useState<TableFilter[]>(initialFilters);

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Apply search filter
    if (searchTerm && searchFields.length > 0) {
      result = result.filter((item) =>
        searchFields.some((field) => {
          const value = item[field];
          return value
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        }),
      );
    }

    // Apply custom filters
    filters.forEach((filter) => {
      result = result.filter((item) => {
        const value = item[filter.key];
        const filterValue = filter.value;

        switch (filter.operator) {
          case "equals":
            return value === filterValue;
          case "contains":
            return value
              ?.toString()
              .toLowerCase()
              .includes(filterValue?.toString().toLowerCase() || "");
          case "startsWith":
            return value
              ?.toString()
              .toLowerCase()
              .startsWith(filterValue?.toString().toLowerCase() || "");
          case "endsWith":
            return value
              ?.toString()
              .toLowerCase()
              .endsWith(filterValue?.toString().toLowerCase() || "");
          case "greaterThan":
            return Number(value) > Number(filterValue);
          case "lessThan":
            return Number(value) < Number(filterValue);
          default:
            return value
              ?.toString()
              .toLowerCase()
              .includes(filterValue?.toString().toLowerCase() || "");
        }
      });
    });

    // Apply sorting
    if (sort) {
      result.sort((a, b) => {
        const aValue = a[sort.key];
        const bValue = b[sort.key];

        // Handle undefined/null values
        if ((aValue === undefined || aValue === null) && (bValue === undefined || bValue === null)) return 0;
        if (aValue === undefined || aValue === null) return sort.direction === "asc" ? 1 : -1;
        if (bValue === undefined || bValue === null) return sort.direction === "asc" ? -1 : 1;

        if (aValue < bValue) {
          return sort.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sort.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, filters, sort, searchFields]);

  const addFilter = (filter: TableFilter) => {
    setFilters((prev) => {
      const existingIndex = prev.findIndex((f) => f.key === filter.key);
      if (existingIndex >= 0) {
        const newFilters = [...prev];
        newFilters[existingIndex] = filter;
        return newFilters;
      }
      return [...prev, filter];
    });
  };

  const removeFilter = (key: string) => {
    setFilters((prev) => prev.filter((f) => f.key !== key));
  };

  const clearFilters = () => {
    setFilters([]);
  };

  const setSorting = (key: string) => {
    setSort((prev) => {
      if (prev?.key === key) {
        return prev.direction === "asc" ? { key, direction: "desc" } : null;
      }
      return { key, direction: "asc" };
    });
  };

  const clearSorting = () => {
    setSort(null);
  };

  return {
    data: filteredAndSortedData,
    searchTerm,
    setSearchTerm,
    sort,
    setSorting,
    clearSorting,
    filters,
    addFilter,
    removeFilter,
    clearFilters,
    totalCount: data.length,
    filteredCount: filteredAndSortedData.length,
  };
}
