import React, { useMemo } from "react";

import { useForm } from "@/hooks/useForm";

// Form Container Component
interface FormContainerProps<T extends Record<string, unknown>> {
  children: (formProps: {
    values: T;
    errors: Record<keyof T, string | null>;
    touched: Record<keyof T, boolean>;
    dirty: Record<keyof T, boolean>;
    isSubmitting: boolean;
    isValid: boolean;
    isDirty: boolean;
    setValue: (name: keyof T, value: T[keyof T]) => void;
    setError: (name: keyof T, error: string | null) => void;
    clearError: (name: keyof T) => void;
    touchField: (name: keyof T) => void;
    reset: () => void;
    handleSubmit: (e?: React.FormEvent) => Promise<void>;
    getFieldProps: (name: keyof T) => {
      value: T[keyof T];
      error: string | null;
      touched: boolean;
      dirty: boolean;
      onChange: (value: T[keyof T]) => void;
      onBlur: () => void;
    };
  }) => React.ReactNode;
  initialValues: T;
  validationRules?: Partial<
    Record<
      keyof T,
      {
        required?: boolean;
        minLength?: number;
        maxLength?: number;
        pattern?: RegExp;
        custom?: (value: T[keyof T]) => string | null;
      }
    >
  >;
  onSubmit: (values: T) => Promise<void> | void;
}

export function FormContainer<T extends Record<string, unknown>>({
  children,
  initialValues,
  validationRules,
  onSubmit,
}: FormContainerProps<T>) {
  const form = useForm({
    initialValues,
    validationRules,
    onSubmit,
  });

  const formProps = useMemo(
    () => ({
      values: form.values,
      errors: form.errors,
      touched: form.touched,
      dirty: form.dirty,
      isSubmitting: form.isSubmitting,
      isValid: form.isValid,
      isDirty: form.isDirty,
      setValue: form.setValue,
      setError: form.setError,
      clearError: form.clearError,
      touchField: form.touchField,
      reset: form.reset,
      handleSubmit: form.handleSubmit,
      getFieldProps: form.getFieldProps,
    }),
    [form],
  );

  return <>{children(formProps)}</>;
}

// Form Field Component
interface FormFieldProps<T> {
  name: string;
  label?: string;
  type?: "text" | "email" | "password" | "number" | "textarea" | "select";
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  value: T;
  error: string | null;
  touched: boolean;
  dirty: boolean;
  onChange: (value: T) => void;
  onBlur: () => void;
  className?: string;
}

export function FormField<T>({
  name,
  label,
  type = "text",
  placeholder,
  required = false,
  options = [],
  value,
  error,
  touched,
  dirty,
  onChange,
  onBlur,
  className = "",
}: FormFieldProps<T>) {
  const hasError = touched && error;

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {type === "textarea" ? (
        <textarea
          id={name}
          value={value as string}
          onChange={(e) => onChange(e.target.value as T)}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            hasError ? "border-red-500" : "border-gray-300"
          }`}
          rows={4}
        />
      ) : type === "select" ? (
        <select
          id={name}
          value={value as string}
          onChange={(e) => onChange(e.target.value as T)}
          onBlur={onBlur}
          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            hasError ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          type={type}
          value={value as string}
          onChange={(e) => onChange(e.target.value as T)}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            hasError ? "border-red-500" : "border-gray-300"
          }`}
        />
      )}

      {hasError && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

// Form UI Component
interface FormUIProps<T extends Record<string, unknown>> {
  title?: string;
  submitText?: string;
  resetText?: string;
  showReset?: boolean;
  className?: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  onReset?: () => void;
  isSubmitting: boolean;
  isValid: boolean;
}

export function FormUI<T extends Record<string, unknown>>({
  title,
  submitText = "Submit",
  resetText = "Reset",
  showReset = true,
  className = "",
  children,
  onSubmit,
  onReset,
  isSubmitting,
  isValid,
}: FormUIProps<T>) {
  return (
    <form onSubmit={onSubmit} className={`space-y-6 ${className}`}>
      {title && <h2 className="text-2xl font-bold text-gray-900">{title}</h2>}

      <div className="space-y-4">{children}</div>

      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={`px-4 py-2 rounded-md font-medium ${
            isValid && !isSubmitting
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? "Submitting..." : submitText}
        </button>

        {showReset && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50"
          >
            {resetText}
          </button>
        )}
      </div>
    </form>
  );
}
