import { useCallback, useMemo, useEffect } from "react";

import { useSearch as useSearchContext } from "@/contexts/SearchContext";

// Custom hook for search operations with memoization and debouncing
export function useSearch() {
  const searchContext = useSearchContext();

  // Memoized search operations
  const performSearch = useCallback(
    async (query: string, filters: Record<string, unknown> = {}) => {
      await searchContext.search(query, filters);
    },
    [searchContext],
  );

  const setQuery = useCallback(
    (query: string) => {
      searchContext.setQuery(query);
    },
    [searchContext],
  );

  const setFilters = useCallback(
    (filters: Record<string, unknown>) => {
      searchContext.setFilters(filters);
    },
    [searchContext],
  );

  const setSort = useCallback(
    (sortBy: string, sortOrder: "asc" | "desc") => {
      searchContext.setSort(sortBy, sortOrder);
    },
    [searchContext],
  );

  const clearSearch = useCallback(() => {
    searchContext.clearSearch();
  }, [searchContext]);

  // Memoized computed values
  const searchState = useMemo(
    () => ({
      query: searchContext.state.query,
      results: searchContext.state.results,
      loading: searchContext.state.loading,
      error: searchContext.state.error,
      hasResults: searchContext.state.results.length > 0,
      isEmpty:
        searchContext.state.results.length === 0 &&
        !searchContext.state.loading,
    }),
    [
      searchContext.state.query,
      searchContext.state.results,
      searchContext.state.loading,
      searchContext.state.error,
    ],
  );

  const searchHistory = useMemo(
    () => searchContext.state.history,
    [searchContext.state.history],
  );

  const searchSuggestions = useMemo(
    () => searchContext.state.suggestions,
    [searchContext.state.suggestions],
  );

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchContext.state.query.trim()) {
        performSearch(searchContext.state.query, searchContext.state.filters);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchContext.state.query, searchContext.state.filters, performSearch]);

  return {
    // State
    ...searchState,
    history: searchHistory,
    suggestions: searchSuggestions,

    // Actions
    search: performSearch,
    setQuery,
    setFilters,
    setSort,
    clearSearch,

    // Context actions
    addToHistory: searchContext.addToHistory,
    clearHistory: searchContext.clearHistory,
    setSuggestions: searchContext.setSuggestions,
  };
}

// Hook for search with specific filters
export function useSearchWithFilters<T = unknown>(
  searchFunction: (
    query: string,
    filters: Record<string, unknown>,
  ) => Promise<T[]>,
) {
  const searchContext = useSearchContext();

  const searchWithFilters = useCallback(
    async (query: string, filters: Record<string, unknown>) => {
      searchContext.setLoading(true);
      searchContext.setQuery(query);
      searchContext.setFilters(filters);

      try {
        const results = await searchFunction(query, filters);
        searchContext.setResults(results);
        searchContext.addToHistory(query);
      } catch (error) {
        searchContext.setError(
          error instanceof Error ? error.message : "Search failed",
        );
      } finally {
        searchContext.setLoading(false);
      }
    },
    [searchContext, searchFunction],
  );

  return {
    search: searchWithFilters,
    query: searchContext.state.query,
    filters: searchContext.state.filters,
    results: searchContext.state.results as T[],
    loading: searchContext.state.loading,
    error: searchContext.state.error,
  };
}

// Hook for search suggestions
export function useSearchSuggestions() {
  const searchContext = useSearchContext();

  const updateSuggestions = useCallback(
    (suggestions: string[]) => {
      searchContext.setSuggestions(suggestions);
    },
    [searchContext],
  );

  const clearSuggestions = useCallback(() => {
    searchContext.setSuggestions([]);
  }, [searchContext]);

  return {
    suggestions: searchContext.state.suggestions,
    updateSuggestions,
    clearSuggestions,
  };
}
