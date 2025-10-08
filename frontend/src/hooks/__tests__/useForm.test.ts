/**
 * useForm Hook Tests
 * Tests for the form management hook
 */

import { renderHook, act } from "@testing-library/react";

import { fixtures } from "../../__tests__/fixtures/data";
import { useForm } from "../useForm";

describe("useForm", () => {
  const initialValues = {
    name: "",
    email: "",
    age: 0,
  };

  const validationRules = {
    name: {
      required: true,
      minLength: 2,
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    age: {
      required: true,
      custom: (value: string | number) =>
        (typeof value === "number" ? value : Number(value)) >= 18
          ? null
          : "Must be 18 or older",
    },
  };

  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Initial State", () => {
    it("should initialize with provided values", () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
          onSubmit: mockOnSubmit,
        }),
      );

      expect(result.current.values).toEqual(initialValues);
      expect(result.current.errors).toEqual({});
      expect(result.current.touched).toEqual({});
      expect(result.current.dirty).toEqual({});
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.isValid).toBe(true);
      expect(result.current.isDirty).toBe(false);
    });

    it("should initialize without validation rules", () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          onSubmit: mockOnSubmit,
        }),
      );

      expect(result.current.values).toEqual(initialValues);
      expect(result.current.isValid).toBe(true);
    });
  });

  describe("Field Value Management", () => {
    it("should set field value", () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
          onSubmit: mockOnSubmit,
        }),
      );

      act(() => {
        result.current.setValue("name", "John Doe");
      });

      expect(result.current.values.name).toBe("John Doe");
      expect(result.current.dirty.name).toBe(true);
      expect(result.current.isDirty).toBe(true);
    });

    it("should set field value using function", () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
          onSubmit: mockOnSubmit,
        }),
      );

      act(() => {
        result.current.setValue("age", (prev) => prev + 1);
      });

      expect(result.current.values.age).toBe(1);
      expect(result.current.dirty.age).toBe(true);
    });

    it("should mark field as touched when setting value", () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
          onSubmit: mockOnSubmit,
        }),
      );

      act(() => {
        result.current.setValue("name", "John");
      });

      expect(result.current.touched.name).toBe(true);
    });
  });

  describe("Field Validation", () => {
    it("should validate required fields", () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
          onSubmit: mockOnSubmit,
        }),
      );

      act(() => {
        result.current.validateField("name", "");
      });

      expect(result.current.errors.name).toBe("This field is required");
    });

    it("should validate minimum length", () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
          onSubmit: mockOnSubmit,
        }),
      );

      act(() => {
        result.current.validateField("name", "A");
      });

      expect(result.current.errors.name).toBe("Minimum length is 2");
    });

    it("should validate email pattern", () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
          onSubmit: mockOnSubmit,
        }),
      );

      act(() => {
        result.current.validateField("email", "invalid-email");
      });

      expect(result.current.errors.email).toBe("Invalid format");
    });

    it("should validate custom rules", () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
          onSubmit: mockOnSubmit,
        }),
      );

      act(() => {
        result.current.validateField("age", 16);
      });

      expect(result.current.errors.age).toBe("Must be 18 or older");
    });

    it("should pass validation for valid values", () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
          onSubmit: mockOnSubmit,
        }),
      );

      act(() => {
        result.current.validateField("name", "John Doe");
        result.current.validateField("email", "john@example.com");
        result.current.validateField("age", 25);
      });

      expect(result.current.errors.name).toBeNull();
      expect(result.current.errors.email).toBeNull();
      expect(result.current.errors.age).toBeNull();
    });
  });

  describe("Form Validation", () => {
    it("should validate entire form", () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
          onSubmit: mockOnSubmit,
        }),
      );

      act(() => {
        result.current.validateForm();
      });

      expect(result.current.errors.name).toBe("This field is required");
      expect(result.current.errors.email).toBe("This field is required");
      expect(result.current.errors.age).toBe("This field is required");
      expect(result.current.isValid).toBe(false);
    });

    it("should return true for valid form", () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
          onSubmit: mockOnSubmit,
        }),
      );

      act(() => {
        result.current.setValue("name", "John Doe");
        result.current.setValue("email", "john@example.com");
        result.current.setValue("age", 25);
        result.current.validateForm();
      });

      expect(result.current.isValid).toBe(true);
      expect(result.current.errors).toEqual({});
    });
  });

  describe("Form Submission", () => {
    it("should submit valid form", async () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
          onSubmit: mockOnSubmit,
        }),
      );

      act(() => {
        result.current.setValue("name", "John Doe");
        result.current.setValue("email", "john@example.com");
        result.current.setValue("age", 25);
      });

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        age: 25,
      });
      expect(result.current.isSubmitting).toBe(false);
    });

    it("should not submit invalid form", async () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
          onSubmit: mockOnSubmit,
        }),
      );

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
      expect(result.current.isSubmitting).toBe(false);
    });

    it("should handle submission errors", async () => {
      const errorOnSubmit = jest
        .fn()
        .mockRejectedValue(new Error("Submission failed"));

      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
          onSubmit: errorOnSubmit,
        }),
      );

      act(() => {
        result.current.setValue("name", "John Doe");
        result.current.setValue("email", "john@example.com");
        result.current.setValue("age", 25);
      });

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(errorOnSubmit).toHaveBeenCalled();
      expect(result.current.isSubmitting).toBe(false);
    });

    it("should set submitting state during submission", async () => {
      const slowOnSubmit = jest
        .fn()
        .mockImplementation(
          () => new Promise((resolve) => setTimeout(resolve, 100)),
        );

      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
          onSubmit: slowOnSubmit,
        }),
      );

      act(() => {
        result.current.setValue("name", "John Doe");
        result.current.setValue("email", "john@example.com");
        result.current.setValue("age", 25);
      });

      const submitPromise = act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.isSubmitting).toBe(true);

      await submitPromise;

      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe("Form Reset", () => {
    it("should reset form to initial values", () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
          onSubmit: mockOnSubmit,
        }),
      );

      act(() => {
        result.current.setValue("name", "John Doe");
        result.current.setValue("email", "john@example.com");
        result.current.setValue("age", 25);
        result.current.setError("name", "Some error");
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.values).toEqual(initialValues);
      expect(result.current.errors).toEqual({});
      expect(result.current.touched).toEqual({});
      expect(result.current.dirty).toEqual({});
      expect(result.current.isDirty).toBe(false);
    });

    it("should reset to new values", () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
          onSubmit: mockOnSubmit,
        }),
      );

      const newValues = {
        name: "Jane Doe",
        email: "jane@example.com",
        age: 30,
      };

      act(() => {
        result.current.reset(newValues);
      });

      expect(result.current.values).toEqual(newValues);
      expect(result.current.errors).toEqual({});
      expect(result.current.touched).toEqual({});
      expect(result.current.dirty).toEqual({});
    });
  });

  describe("Error Management", () => {
    it("should set field error", () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
          onSubmit: mockOnSubmit,
        }),
      );

      act(() => {
        result.current.setError("name", "Custom error message");
      });

      expect(result.current.errors.name).toBe("Custom error message");
    });

    it("should clear field error", () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
          onSubmit: mockOnSubmit,
        }),
      );

      act(() => {
        result.current.setError("name", "Custom error message");
        result.current.setError("name", null);
      });

      expect(result.current.errors.name).toBeNull();
    });
  });

  describe("Touch Management", () => {
    it("should set field as touched", () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
          onSubmit: mockOnSubmit,
        }),
      );

      act(() => {
        result.current.touchField("name");
      });

      expect(result.current.touched.name).toBe(true);
    });

    it("should set multiple fields as touched", () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
          onSubmit: mockOnSubmit,
        }),
      );

      act(() => {
        result.current.touchField("name");
        result.current.touchField("email");
      });

      expect(result.current.touched.name).toBe(true);
      expect(result.current.touched.email).toBe(true);
    });
  });

  describe("Dirty State Management", () => {
    it("should set field as dirty", () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
          onSubmit: mockOnSubmit,
        }),
      );

      act(() => {
        result.current.setValue("name", "New Name");
      });

      expect(result.current.dirty.name).toBe(true);
      expect(result.current.isDirty).toBe(true);
    });

    it("should set multiple fields as dirty", () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          validationRules,
          onSubmit: mockOnSubmit,
        }),
      );

      act(() => {
        result.current.setValue("name", "New Name");
        result.current.setValue("email", "new@example.com");
      });

      expect(result.current.dirty.name).toBe(true);
      expect(result.current.dirty.email).toBe(true);
      expect(result.current.isDirty).toBe(true);
    });
  });
});
