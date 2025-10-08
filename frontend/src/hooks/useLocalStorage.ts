import { useState, useCallback } from "react";

// Custom hook for localStorage with TypeScript support
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        // Save state
        setStoredValue(valueToStore);

        // Save to local storage
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue],
  );

  // Remove from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
}

// Hook for session storage
export function useSessionStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);

        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting sessionStorage key "${key}":`, error);
      }
    },
    [key, storedValue],
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing sessionStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
}

// Hook for managing multiple localStorage keys
export function useLocalStorageMulti<T extends Record<string, unknown>>(
  keys: T,
) {
  const [values, setValues] = useState<T>(() => {
    if (typeof window === "undefined") {
      return keys;
    }

    const result = {} as T;

    Object.keys(keys).forEach((key) => {
      try {
        const item = window.localStorage.getItem(key);
        result[key as keyof T] = item ? JSON.parse(item) : keys[key as keyof T];
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
        result[key as keyof T] = keys[key as keyof T];
      }
    });

    return result;
  });

  const setValue = useCallback((key: keyof T, value: T[keyof T]) => {
    try {
      setValues((prev) => ({ ...prev, [key]: value }));

      if (typeof window !== "undefined") {
        window.localStorage.setItem(key as string, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${String(key)}":`, error);
    }
  }, []);

  const setMultipleValues = useCallback((newValues: Partial<T>) => {
    try {
      setValues((prev) => ({ ...prev, ...newValues }));

      if (typeof window !== "undefined") {
        Object.entries(newValues).forEach(([key, value]) => {
          window.localStorage.setItem(key, JSON.stringify(value));
        });
      }
    } catch (error) {
      console.error("Error setting multiple localStorage keys:", error);
    }
  }, []);

  const removeValue = useCallback((key: keyof T) => {
    try {
      setValues((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [key]: _, ...rest } = prev;
        return rest as T;
      });

      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key as string);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${String(key)}":`, error);
    }
  }, []);

  const clearAll = useCallback(() => {
    try {
      setValues(keys);

      if (typeof window !== "undefined") {
        Object.keys(keys).forEach((key) => {
          window.localStorage.removeItem(key);
        });
      }
    } catch (error) {
      console.error("Error clearing localStorage keys:", error);
    }
  }, [keys]);

  return {
    values,
    setValue,
    setValues: setMultipleValues,
    removeValue,
    clearAll,
  };
}
