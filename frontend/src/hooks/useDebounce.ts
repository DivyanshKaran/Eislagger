import { useState, useEffect, useCallback } from "react";

// Custom hook for debouncing values
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Custom hook for debouncing callbacks
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number,
): T {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null,
  );

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      const newTimer = setTimeout(() => {
        callback(...args);
      }, delay);

      setDebounceTimer(newTimer);
    },
    [callback, delay, debounceTimer],
  ) as T;

  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return debouncedCallback;
}

// Custom hook for debouncing async operations
export function useDebouncedAsyncCallback<
  T extends (...args: unknown[]) => Promise<unknown>,
>(callback: T, delay: number): T {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null,
  );

  const debouncedCallback = useCallback(
    async (...args: Parameters<T>) => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      const newTimer = setTimeout(async () => {
        try {
          await callback(...args);
        } catch (error) {
          console.error("Debounced async callback error:", error);
        }
      }, delay);

      setDebounceTimer(newTimer);
    },
    [callback, delay, debounceTimer],
  ) as T;

  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return debouncedCallback;
}

// Custom hook for debouncing with immediate execution option
export function useDebounceWithImmediate<
  T extends (...args: unknown[]) => unknown,
>(callback: T, delay: number, immediate: boolean = false): T {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [hasExecuted, setHasExecuted] = useState(false);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (immediate && !hasExecuted) {
        callback(...args);
        setHasExecuted(true);
        return;
      }

      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      const newTimer = setTimeout(() => {
        callback(...args);
        setHasExecuted(true);
      }, delay);

      setDebounceTimer(newTimer);
    },
    [callback, delay, debounceTimer, immediate, hasExecuted],
  ) as T;

  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return debouncedCallback;
}

// Custom hook for debouncing with cancel functionality
export function useDebounceWithCancel<
  T extends (...args: unknown[]) => unknown,
>(callback: T, delay: number) {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null,
  );

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      const newTimer = setTimeout(() => {
        callback(...args);
      }, delay);

      setDebounceTimer(newTimer);
    },
    [callback, delay, debounceTimer],
  );

  const cancel = useCallback(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      setDebounceTimer(null);
    }
  }, [debounceTimer]);

  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return [debouncedCallback, cancel] as const;
}
