"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from "react";

// Direct imports to avoid circular dependency issues
import type { BaseEntity, UserRole, Status, Priority } from "@/types/common";

interface User extends BaseEntity {
  name: string;
  email: string;
  role: UserRole;
  status: Status;
  avatar?: string;
  phone?: string;
  address?: string;
  preferences?: {
    theme: "light" | "dark" | "system";
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
      marketing: boolean;
    };
    language: string;
    timezone: string;
  };
}

type Theme = "light" | "dark" | "system";

interface Notification extends BaseEntity {
  userId: string;
  type: "order_update" | "payment_received" | "system_alert" | "promotion";
  title: string;
  message: string;
  read: boolean;
  priority: Priority;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

// App State Types
interface AppState {
  user: {
    current: User | null;
    loading: boolean;
    error: string | null;
  };
  theme: {
    current: Theme;
    systemTheme: Theme;
  };
  notifications: {
    items: Notification[];
    unreadCount: number;
  };
  ui: {
    sidebarCollapsed: boolean;
    loading: Record<string, boolean>;
    errors: Record<string, string>;
  };
}

// Action Types
type AppAction =
  | { type: "SET_USER"; payload: User }
  | { type: "CLEAR_USER" }
  | { type: "SET_USER_LOADING"; payload: boolean }
  | { type: "SET_USER_ERROR"; payload: string | null }
  | { type: "SET_THEME"; payload: Theme }
  | { type: "SET_SYSTEM_THEME"; payload: Theme }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_LOADING"; payload: { key: string; loading: boolean } }
  | { type: "SET_ERROR"; payload: { key: string; error: string } }
  | { type: "CLEAR_ERROR"; payload: string }
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "REMOVE_NOTIFICATION"; payload: string | number }
  | { type: "MARK_NOTIFICATION_READ"; payload: string | number }
  | { type: "MARK_ALL_NOTIFICATIONS_READ" };

// Initial State
const initialState: AppState = {
  user: {
    current: null,
    loading: false,
    error: null,
  },
  theme: {
    current: "system",
    systemTheme: "light",
  },
  notifications: {
    items: [],
    unreadCount: 0,
  },
  ui: {
    sidebarCollapsed: false,
    loading: {},
    errors: {},
  },
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: {
          ...state.user,
          current: action.payload,
          loading: false,
          error: null,
        },
      };

    case "CLEAR_USER":
      return {
        ...state,
        user: {
          current: null,
          loading: false,
          error: null,
        },
      };

    case "SET_USER_LOADING":
      return {
        ...state,
        user: {
          ...state.user,
          loading: action.payload,
        },
      };

    case "SET_USER_ERROR":
      return {
        ...state,
        user: {
          ...state.user,
          error: action.payload,
          loading: false,
        },
      };

    case "SET_THEME":
      return {
        ...state,
        theme: {
          ...state.theme,
          current: action.payload,
        },
      };

    case "SET_SYSTEM_THEME":
      return {
        ...state,
        theme: {
          ...state.theme,
          systemTheme: action.payload,
        },
      };

    case "TOGGLE_SIDEBAR":
      return {
        ...state,
        ui: {
          ...state.ui,
          sidebarCollapsed: !state.ui.sidebarCollapsed,
        },
      };

    case "SET_LOADING":
      return {
        ...state,
        ui: {
          ...state.ui,
          loading: {
            ...state.ui.loading,
            [action.payload.key]: action.payload.loading,
          },
        },
      };

    case "SET_ERROR":
      return {
        ...state,
        ui: {
          ...state.ui,
          errors: {
            ...state.ui.errors,
            [action.payload.key]: action.payload.error,
          },
        },
      };

    case "CLEAR_ERROR":
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [action.payload]: _, ...remainingErrors } = state.ui.errors;
      return {
        ...state,
        ui: {
          ...state.ui,
          errors: remainingErrors,
        },
      };

    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: {
          items: [action.payload, ...state.notifications.items],
          unreadCount: state.notifications.unreadCount + 1,
        },
      };

    case "REMOVE_NOTIFICATION":
      const filteredNotifications = state.notifications.items.filter(
        (notification) => notification.id !== action.payload,
      );
      return {
        ...state,
        notifications: {
          items: filteredNotifications,
          unreadCount: Math.max(0, state.notifications.unreadCount - 1),
        },
      };

    case "MARK_NOTIFICATION_READ":
      const updatedNotifications = state.notifications.items.map(
        (notification) =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification,
      );
      const unreadCount = updatedNotifications.filter((n) => !n.read).length;
      return {
        ...state,
        notifications: {
          items: updatedNotifications,
          unreadCount,
        },
      };

    case "MARK_ALL_NOTIFICATIONS_READ":
      const allReadNotifications = state.notifications.items.map(
        (notification) => ({
          ...notification,
          read: true,
        }),
      );
      return {
        ...state,
        notifications: {
          items: allReadNotifications,
          unreadCount: 0,
        },
      };

    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // User actions
  setUser: (user: User) => void;
  clearUser: () => void;
  setUserLoading: (loading: boolean) => void;
  setUserError: (error: string | null) => void;
  // Theme actions
  setTheme: (theme: Theme) => void;
  setSystemTheme: (theme: Theme) => void;
  // UI actions
  toggleSidebar: () => void;
  setLoading: (key: string, loading: boolean) => void;
  setError: (key: string, error: string) => void;
  clearError: (key: string) => void;
  // Notification actions
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // User actions
  const setUser = useCallback((user: User) => {
    dispatch({ type: "SET_USER", payload: user });
  }, []);

  const clearUser = useCallback(() => {
    dispatch({ type: "CLEAR_USER" });
  }, []);

  const setUserLoading = useCallback((loading: boolean) => {
    dispatch({ type: "SET_USER_LOADING", payload: loading });
  }, []);

  const setUserError = useCallback((error: string | null) => {
    dispatch({ type: "SET_USER_ERROR", payload: error });
  }, []);

  // Theme actions
  const setTheme = useCallback((theme: Theme) => {
    dispatch({ type: "SET_THEME", payload: theme });
  }, []);

  const setSystemTheme = useCallback((theme: Theme) => {
    dispatch({ type: "SET_SYSTEM_THEME", payload: theme });
  }, []);

  // UI actions
  const toggleSidebar = useCallback(() => {
    dispatch({ type: "TOGGLE_SIDEBAR" });
  }, []);

  const setLoading = useCallback((key: string, loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: { key, loading } });
  }, []);

  const setError = useCallback((key: string, error: string) => {
    dispatch({ type: "SET_ERROR", payload: { key, error } });
  }, []);

  const clearError = useCallback((key: string) => {
    dispatch({ type: "CLEAR_ERROR", payload: key });
  }, []);

  // Notification actions
  const addNotification = useCallback((notification: Notification) => {
    dispatch({ type: "ADD_NOTIFICATION", payload: notification });
  }, []);

  const removeNotification = useCallback((id: string) => {
    dispatch({ type: "REMOVE_NOTIFICATION", payload: id });
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    dispatch({ type: "MARK_NOTIFICATION_READ", payload: id });
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    dispatch({ type: "MARK_ALL_NOTIFICATIONS_READ" });
  }, []);

  const value: AppContextType = {
    state,
    dispatch,
    setUser,
    clearUser,
    setUserLoading,
    setUserError,
    setTheme,
    setSystemTheme,
    toggleSidebar,
    setLoading,
    setError,
    clearError,
    addNotification,
    removeNotification,
    markNotificationRead,
    markAllNotificationsRead,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

// Selector hooks for better performance
export function useUser() {
  const { state, setUser, clearUser, setUserLoading, setUserError } = useApp();
  return {
    user: state.user.current,
    loading: state.user.loading,
    error: state.user.error,
    setUser,
    clearUser,
    setUserLoading,
    setUserError,
  };
}

export function useTheme() {
  const { state, setTheme, setSystemTheme } = useApp();
  return {
    theme: state.theme.current,
    systemTheme: state.theme.systemTheme,
    setTheme,
    setSystemTheme,
  };
}

export function useNotifications() {
  const {
    state,
    addNotification,
    removeNotification,
    markNotificationRead,
    markAllNotificationsRead,
  } = useApp();
  return {
    notifications: state.notifications.items,
    unreadCount: state.notifications.unreadCount,
    addNotification,
    removeNotification,
    markNotificationRead,
    markAllNotificationsRead,
  };
}

export function useUI() {
  const { state, toggleSidebar, setLoading, setError, clearError } = useApp();
  return {
    sidebarCollapsed: state.ui.sidebarCollapsed,
    loading: state.ui.loading,
    errors: state.ui.errors,
    toggleSidebar,
    setLoading,
    setError,
    clearError,
  };
}
