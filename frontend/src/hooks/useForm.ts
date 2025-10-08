import { useState, useCallback, useMemo } from "react";

// Form Types - removed unused interface

interface FormState<T extends Record<string, unknown>> {
  values: T;
  errors: Record<keyof T, string | null>;
  touched: Record<keyof T, boolean>;
  dirty: Record<keyof T, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

interface ValidationRule<T = unknown> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null;
}

interface FormConfig<T extends Record<string, unknown>> {
  initialValues: T;
  validationRules?: Partial<Record<keyof T, ValidationRule<T[keyof T]>>>;
  onSubmit: (values: T) => Promise<void> | void;
}

// Custom hook for form management with validation
export function useForm<T extends Record<string, unknown>>({
  initialValues,
  validationRules = {},
  onSubmit,
}: FormConfig<T>) {
  const [state, setState] = useState<FormState<T>>(() => ({
    values: initialValues,
    errors: {} as Record<keyof T, string | null>,
    touched: {} as Record<keyof T, boolean>,
    dirty: {} as Record<keyof T, boolean>,
    isSubmitting: false,
    isValid: true,
    isDirty: false,
  }));

  // Validation function
  const validateField = useCallback(
    (name: keyof T, value: T[keyof T]): string | null => {
      const rules = validationRules[name];
      if (!rules) return null;

      if (
        rules.required &&
        (!value || (typeof value === "string" && !value.trim()))
      ) {
        return "This field is required";
      }

      if (typeof value === "string") {
        if (rules.minLength && value.length < rules.minLength) {
          return `Minimum length is ${rules.minLength}`;
        }
        if (rules.maxLength && value.length > rules.maxLength) {
          return `Maximum length is ${rules.maxLength}`;
        }
        if (rules.pattern && !rules.pattern.test(value)) {
          return "Invalid format";
        }
      }

      if (rules.custom) {
        return rules.custom(value);
      }

      return null;
    },
    [validationRules],
  );

  // Validate all fields
  const validateForm = useCallback((): boolean => {
    const errors: Record<keyof T, string | null> = {} as Record<
      keyof T,
      string | null
    >;
    let isValid = true;

    Object.keys(initialValues).forEach((key) => {
      const fieldName = key as keyof T;
      const error = validateField(fieldName, state.values[fieldName]);
      errors[fieldName] = error;
      if (error) isValid = false;
    });

    setState((prev) => ({
      ...prev,
      errors,
      isValid,
    }));

    return isValid;
  }, [initialValues, state.values, validateField]);

  // Set field value
  const setValue = useCallback(
    (name: keyof T, value: T[keyof T]) => {
      setState((prev) => {
        const newValues = { ...prev.values, [name]: value };
        const error = validateField(name, value);
        const isDirty =
          JSON.stringify(newValues) !== JSON.stringify(initialValues);

        return {
          ...prev,
          values: newValues,
          errors: { ...prev.errors, [name]: error },
          dirty: { ...prev.dirty, [name]: true },
          isDirty,
          isValid: error ? false : prev.isValid,
        };
      });
    },
    [initialValues, validateField],
  );

  // Set field error
  const setError = useCallback((name: keyof T, error: string | null) => {
    setState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [name]: error },
      isValid: error ? false : prev.isValid,
    }));
  }, []);

  // Clear field error
  const clearError = useCallback((name: keyof T) => {
    setState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [name]: null },
    }));
  }, []);

  // Touch field
  const touchField = useCallback((name: keyof T) => {
    setState((prev) => ({
      ...prev,
      touched: { ...prev.touched, [name]: true },
    }));
  }, []);

  // Reset form
  const reset = useCallback(() => {
    setState({
      values: initialValues,
      errors: {} as Record<keyof T, string | null>,
      touched: {} as Record<keyof T, boolean>,
      dirty: {} as Record<keyof T, boolean>,
      isSubmitting: false,
      isValid: true,
      isDirty: false,
    });
  }, [initialValues]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      // Touch all fields
      const touchedFields = {} as Record<keyof T, boolean>;
      Object.keys(initialValues).forEach((key) => {
        touchedFields[key as keyof T] = true;
      });

      setState((prev) => ({
        ...prev,
        touched: touchedFields,
      }));

      // Validate form
      if (!validateForm()) {
        return;
      }

      setState((prev) => ({ ...prev, isSubmitting: true }));

      try {
        await onSubmit(state.values);
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setState((prev) => ({ ...prev, isSubmitting: false }));
      }
    },
    [initialValues, validateForm, onSubmit, state.values],
  );

  // Memoized computed values
  const formState = useMemo(
    () => ({
      values: state.values,
      errors: state.errors,
      touched: state.touched,
      dirty: state.dirty,
      isSubmitting: state.isSubmitting,
      isValid: state.isValid,
      isDirty: state.isDirty,
    }),
    [state],
  );

  // Field helpers
  const getFieldProps = useCallback(
    (name: keyof T) => ({
      value: state.values[name],
      error: state.errors[name],
      touched: state.touched[name],
      dirty: state.dirty[name],
      onChange: (value: T[keyof T]) => setValue(name, value),
      onBlur: () => touchField(name),
    }),
    [state, setValue, touchField],
  );

  return {
    // State
    ...formState,

    // Actions
    setValue,
    setError,
    clearError,
    touchField,
    reset,
    handleSubmit,

    // Helpers
    getFieldProps,
    validateForm,
  };
}

// Hook for simple form with minimal validation
export function useSimpleForm<T extends Record<string, unknown>>(
  initialValues: T,
  onSubmit: (values: T) => Promise<void> | void,
) {
  const [values, setValues] = useState<T>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback((name: keyof T, value: T[keyof T]) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
  }, [initialValues]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, onSubmit],
  );

  return {
    values,
    setValue,
    reset,
    handleSubmit,
    isSubmitting,
  };
}
