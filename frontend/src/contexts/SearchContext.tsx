"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from "react";

// Search Types
interface SearchState {
  query: string;
  filters: Record<string, unknown>;
  sortBy: string;
  sortOrder: "asc" | "desc";
  results: unknown[];
  loading: boolean;
  error: string | null;
  history: string[];
  suggestions: string[];
}

// Action Types
type SearchAction =
  | { type: "SET_QUERY"; payload: string }
  | { type: "SET_FILTERS"; payload: Record<string, unknown> }
  | { type: "SET_SORT"; payload: { sortBy: string; sortOrder: "asc" | "desc" } }
  | { type: "SET_RESULTS"; payload: unknown[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "ADD_TO_HISTORY"; payload: string }
  | { type: "CLEAR_HISTORY" }
  | { type: "SET_SUGGESTIONS"; payload: string[] }
  | { type: "CLEAR_SEARCH" };

// Initial State
const initialState: SearchState = {
  query: "",
  filters: {},
  sortBy: "relevance",
  sortOrder: "desc",
  results: [],
  loading: false,
  error: null,
  history: [],
  suggestions: [],
};

// Reducer
function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case "SET_QUERY":
      return {
        ...state,
        query: action.payload,
        error: null,
      };

    case "SET_FILTERS":
      return {
        ...state,
        filters: action.payload,
        error: null,
      };

    case "SET_SORT":
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortOrder: action.payload.sortOrder,
        error: null,
      };

    case "SET_RESULTS":
      return {
        ...state,
        results: action.payload,
        loading: false,
        error: null,
      };

    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
        error: action.payload ? null : state.error,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case "ADD_TO_HISTORY":
      if (action.payload.trim() && !state.history.includes(action.payload)) {
        return {
          ...state,
          history: [action.payload, ...state.history.slice(0, 9)], // Keep last 10
        };
      }
      return state;

    case "CLEAR_HISTORY":
      return {
        ...state,
        history: [],
      };

    case "SET_SUGGESTIONS":
      return {
        ...state,
        suggestions: action.payload,
      };

    case "CLEAR_SEARCH":
      return {
        ...state,
        query: "",
        filters: {},
        results: [],
        loading: false,
        error: null,
        suggestions: [],
      };

    default:
      return state;
  }
}

// Context
interface SearchContextType {
  state: SearchState;
  dispatch: React.Dispatch<SearchAction>;
  setQuery: (query: string) => void;
  setFilters: (filters: Record<string, unknown>) => void;
  setSort: (sortBy: string, sortOrder: "asc" | "desc") => void;
  setResults: (results: unknown[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addToHistory: (query: string) => void;
  clearHistory: () => void;
  setSuggestions: (suggestions: string[]) => void;
  clearSearch: () => void;
  search: (query: string, filters?: Record<string, unknown>) => Promise<void>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Provider
interface SearchProviderProps {
  children: ReactNode;
  searchFunction?: (
    query: string,
    filters: Record<string, unknown>,
  ) => Promise<unknown[]>;
}

export function SearchProvider({
  children,
  searchFunction,
}: SearchProviderProps) {
  const [state, dispatch] = useReducer(searchReducer, initialState);

  const setQuery = useCallback((query: string) => {
    dispatch({ type: "SET_QUERY", payload: query });
  }, []);

  const setFilters = useCallback((filters: Record<string, unknown>) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
  }, []);

  const setSort = useCallback((sortBy: string, sortOrder: "asc" | "desc") => {
    dispatch({ type: "SET_SORT", payload: { sortBy, sortOrder } });
  }, []);

  const setResults = useCallback((results: unknown[]) => {
    dispatch({ type: "SET_RESULTS", payload: results });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: "SET_ERROR", payload: error });
  }, []);

  const addToHistory = useCallback((query: string) => {
    dispatch({ type: "ADD_TO_HISTORY", payload: query });
  }, []);

  const clearHistory = useCallback(() => {
    dispatch({ type: "CLEAR_HISTORY" });
  }, []);

  const setSuggestions = useCallback((suggestions: string[]) => {
    dispatch({ type: "SET_SUGGESTIONS", payload: suggestions });
  }, []);

  const clearSearch = useCallback(() => {
    dispatch({ type: "CLEAR_SEARCH" });
  }, []);

  const search = useCallback(
    async (query: string, filters: Record<string, unknown> = {}) => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      setQuery(query);
      setFilters(filters);

      try {
        if (searchFunction) {
          const results = await searchFunction(query, filters);
          setResults(results);
          addToHistory(query);
        } else {
          // Default search implementation
          setResults([]);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Search failed");
      } finally {
        setLoading(false);
      }
    },
    [
      searchFunction,
      setLoading,
      setQuery,
      setFilters,
      setResults,
      addToHistory,
      setError,
    ],
  );

  const value: SearchContextType = {
    state,
    dispatch,
    setQuery,
    setFilters,
    setSort,
    setResults,
    setLoading,
    setError,
    addToHistory,
    clearHistory,
    setSuggestions,
    clearSearch,
    search,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

// Hook
export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}

// Selector hooks for better performance
export function useSearchQuery() {
  const { state, setQuery } = useSearch();
  return {
    query: state.query,
    setQuery,
  };
}

export function useSearchResults() {
  const { state } = useSearch();
  return {
    results: state.results,
    loading: state.loading,
    error: state.error,
  };
}

export function useSearchHistory() {
  const { state, addToHistory, clearHistory } = useSearch();
  return {
    history: state.history,
    addToHistory,
    clearHistory,
  };
}

export function useSearchSuggestions() {
  const { state, setSuggestions } = useSearch();
  return {
    suggestions: state.suggestions,
    setSuggestions,
  };
}
