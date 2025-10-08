import React, { useMemo, useCallback } from "react";

import { useDebounce } from "@/hooks/useDebounce";
import { useSearch } from "@/hooks/useSearch";

// Search Container Component
interface SearchContainerProps {
  children: (searchProps: {
    query: string;
    results: unknown[];
    loading: boolean;
    error: string | null;
    hasResults: boolean;
    isEmpty: boolean;
    history: string[];
    suggestions: string[];
    setQuery: (query: string) => void;
    search: (query: string, filters?: Record<string, unknown>) => Promise<void>;
    clearSearch: () => void;
    addToHistory: (query: string) => void;
    clearHistory: () => void;
    setSuggestions: (suggestions: string[]) => void;
  }) => React.ReactNode;
  searchFunction?: (
    query: string,
    filters: Record<string, unknown>,
  ) => Promise<unknown[]>;
}

export function SearchContainer({
  children,
  searchFunction,
}: SearchContainerProps) {
  const search = useSearch();

  const searchProps = useMemo(
    () => ({
      query: search.query,
      results: search.results,
      loading: search.loading,
      error: search.error,
      hasResults: search.hasResults,
      isEmpty: search.isEmpty,
      history: search.history,
      suggestions: search.suggestions,
      setQuery: search.setQuery,
      search: search.search,
      clearSearch: search.clearSearch,
      addToHistory: search.addToHistory,
      clearHistory: search.clearHistory,
      setSuggestions: search.setSuggestions,
    }),
    [search],
  );

  return <>{children(searchProps)}</>;
}

// Search UI Component
interface SearchUIProps {
  placeholder?: string;
  showHistory?: boolean;
  showSuggestions?: boolean;
  onResultSelect?: (result: unknown) => void;
}

export function SearchUI({
  placeholder = "Search...",
  showHistory = true,
  showSuggestions = true,
  onResultSelect,
}: SearchUIProps) {
  const search = useSearch();
  const debouncedQuery = useDebounce(search.query, 300);

  const handleSearch = useCallback(
    async (query: string) => {
      if (query.trim()) {
        await search.search(query);
      }
    },
    [search],
  );

  const handleResultClick = useCallback(
    (result: unknown) => {
      onResultSelect?.(result);
      search.clearSearch();
    },
    [onResultSelect, search],
  );

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={search.query}
          onChange={(e) => search.setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {search.loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {/* Search Results */}
      {search.query && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {search.loading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : search.error ? (
            <div className="p-4 text-center text-red-500">{search.error}</div>
          ) : search.isEmpty ? (
            <div className="p-4 text-center text-gray-500">
              No results found
            </div>
          ) : (
            <div className="py-2">
              {search.results.map((result, index) => (
                <div
                  key={index}
                  onClick={() => handleResultClick(result)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {typeof result === "string" ? result : JSON.stringify(result)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Search History */}
      {showHistory && search.history.length > 0 && !search.query && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          <div className="p-2">
            <div className="text-xs text-gray-500 mb-2">Recent searches</div>
            {search.history.slice(0, 5).map((item, index) => (
              <div
                key={index}
                onClick={() => search.setQuery(item)}
                className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {item}
              </div>
            ))}
            <button
              onClick={search.clearHistory}
              className="w-full text-left px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
            >
              Clear history
            </button>
          </div>
        </div>
      )}

      {/* Search Suggestions */}
      {showSuggestions && search.suggestions.length > 0 && !search.query && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          <div className="p-2">
            <div className="text-xs text-gray-500 mb-2">Suggestions</div>
            {search.suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => search.setQuery(suggestion)}
                className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {suggestion}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
