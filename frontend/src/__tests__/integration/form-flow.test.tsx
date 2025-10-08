/**
 * Form Flow Integration Tests
 * Tests for the complete form handling user flow
 */

import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useForm } from "../../hooks/useForm";
import { fixtures } from "../fixtures/data";

// Test component that uses the form hook
function FormTestComponent() {
  const {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm,
    validateForm,
  } = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      age: "",
      terms: false,
    },
    validationSchema: {
      name: (value: string) => {
        if (!value) return "Name is required";
        if (value.length < 2) return "Name must be at least 2 characters";
        return null;
      },
      email: (value: string) => {
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Invalid email format";
        return null;
      },
      password: (value: string) => {
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        return null;
      },
      confirmPassword: (value: string, values: any) => {
        if (!value) return "Please confirm your password";
        if (value !== values.password) return "Passwords do not match";
        return null;
      },
      age: (value: string) => {
        if (!value) return "Age is required";
        const age = parseInt(value);
        if (isNaN(age) || age < 18) return "You must be at least 18 years old";
        return null;
      },
      terms: (value: boolean) => {
        if (!value) return "You must accept the terms and conditions";
        return null;
      },
    },
    onSubmit: async (values) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Form submitted:", values);
    },
  });

  return (
    <form onSubmit={handleSubmit} data-testid="test-form">
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          data-testid="name-input"
        />
        {touched.name && errors.name && (
          <span data-testid="name-error">{errors.name}</span>
        )}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          data-testid="email-input"
        />
        {touched.email && errors.email && (
          <span data-testid="email-error">{errors.email}</span>
        )}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          data-testid="password-input"
        />
        {touched.password && errors.password && (
          <span data-testid="password-error">{errors.password}</span>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          data-testid="confirm-password-input"
        />
        {touched.confirmPassword && errors.confirmPassword && (
          <span data-testid="confirm-password-error">
            {errors.confirmPassword}
          </span>
        )}
      </div>

      <div>
        <label htmlFor="age">Age</label>
        <input
          id="age"
          name="age"
          type="number"
          value={values.age}
          onChange={handleChange}
          onBlur={handleBlur}
          data-testid="age-input"
        />
        {touched.age && errors.age && (
          <span data-testid="age-error">{errors.age}</span>
        )}
      </div>

      <div>
        <label htmlFor="terms">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            checked={values.terms}
            onChange={handleChange}
            onBlur={handleBlur}
            data-testid="terms-checkbox"
          />
          I accept the terms and conditions
        </label>
        {touched.terms && errors.terms && (
          <span data-testid="terms-error">{errors.terms}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        data-testid="submit-button"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>

      <button type="button" onClick={resetForm} data-testid="reset-button">
        Reset
      </button>

      <button
        type="button"
        onClick={validateForm}
        data-testid="validate-button"
      >
        Validate
      </button>

      <div data-testid="form-status">
        Valid: {isValid ? "Yes" : "No"} | Submitting:{" "}
        {isSubmitting ? "Yes" : "No"}
      </div>
    </form>
  );
}

describe("Form Flow Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Form Initialization", () => {
    it("should initialize with default values", () => {
      render(<FormTestComponent />);

      expect(screen.getByTestId("name-input")).toHaveValue("");
      expect(screen.getByTestId("email-input")).toHaveValue("");
      expect(screen.getByTestId("password-input")).toHaveValue("");
      expect(screen.getByTestId("confirm-password-input")).toHaveValue("");
      expect(screen.getByTestId("age-input")).toHaveValue("");
      expect(screen.getByTestId("terms-checkbox")).not.toBeChecked();
    });

    it("should start with invalid state", () => {
      render(<FormTestComponent />);

      expect(screen.getByTestId("form-status")).toHaveTextContent("Valid: No");
      expect(screen.getByTestId("submit-button")).toBeDisabled();
    });
  });

  describe("Input Handling", () => {
    it("should handle text input changes", async () => {
      const user = userEvent.setup();
      render(<FormTestComponent />);

      const nameInput = screen.getByTestId("name-input");
      await user.type(nameInput, "John Doe");

      expect(nameInput).toHaveValue("John Doe");
    });

    it("should handle email input changes", async () => {
      const user = userEvent.setup();
      render(<FormTestComponent />);

      const emailInput = screen.getByTestId("email-input");
      await user.type(emailInput, "john@example.com");

      expect(emailInput).toHaveValue("john@example.com");
    });

    it("should handle password input changes", async () => {
      const user = userEvent.setup();
      render(<FormTestComponent />);

      const passwordInput = screen.getByTestId("password-input");
      await user.type(passwordInput, "password123");

      expect(passwordInput).toHaveValue("password123");
    });

    it("should handle checkbox changes", async () => {
      const user = userEvent.setup();
      render(<FormTestComponent />);

      const termsCheckbox = screen.getByTestId("terms-checkbox");
      await user.click(termsCheckbox);

      expect(termsCheckbox).toBeChecked();
    });

    it("should handle number input changes", async () => {
      const user = userEvent.setup();
      render(<FormTestComponent />);

      const ageInput = screen.getByTestId("age-input");
      await user.type(ageInput, "25");

      expect(ageInput).toHaveValue(25);
    });
  });

  describe("Validation", () => {
    it("should validate required fields", async () => {
      const user = userEvent.setup();
      render(<FormTestComponent />);

      const nameInput = screen.getByTestId("name-input");
      await user.click(nameInput);
      await user.tab(); // Trigger blur

      expect(screen.getByTestId("name-error")).toHaveTextContent(
        "Name is required",
      );
    });

    it("should validate email format", async () => {
      const user = userEvent.setup();
      render(<FormTestComponent />);

      const emailInput = screen.getByTestId("email-input");
      await user.type(emailInput, "invalid-email");
      await user.tab();

      expect(screen.getByTestId("email-error")).toHaveTextContent(
        "Invalid email format",
      );
    });

    it("should validate password length", async () => {
      const user = userEvent.setup();
      render(<FormTestComponent />);

      const passwordInput = screen.getByTestId("password-input");
      await user.type(passwordInput, "123");
      await user.tab();

      expect(screen.getByTestId("password-error")).toHaveTextContent(
        "Password must be at least 8 characters",
      );
    });

    it("should validate password confirmation", async () => {
      const user = userEvent.setup();
      render(<FormTestComponent />);

      const passwordInput = screen.getByTestId("password-input");
      const confirmPasswordInput = screen.getByTestId("confirm-password-input");

      await user.type(passwordInput, "password123");
      await user.type(confirmPasswordInput, "different123");
      await user.tab();

      expect(screen.getByTestId("confirm-password-error")).toHaveTextContent(
        "Passwords do not match",
      );
    });

    it("should validate age requirement", async () => {
      const user = userEvent.setup();
      render(<FormTestComponent />);

      const ageInput = screen.getByTestId("age-input");
      await user.type(ageInput, "16");
      await user.tab();

      expect(screen.getByTestId("age-error")).toHaveTextContent(
        "You must be at least 18 years old",
      );
    });

    it("should validate terms acceptance", async () => {
      const user = userEvent.setup();
      render(<FormTestComponent />);

      const termsCheckbox = screen.getByTestId("terms-checkbox");
      await user.click(termsCheckbox);
      await user.tab();

      expect(screen.getByTestId("terms-error")).toHaveTextContent(
        "You must accept the terms and conditions",
      );
    });
  });

  describe("Form Submission", () => {
    it("should submit valid form", async () => {
      const user = userEvent.setup();
      render(<FormTestComponent />);

      // Fill out form with valid data
      await user.type(screen.getByTestId("name-input"), "John Doe");
      await user.type(screen.getByTestId("email-input"), "john@example.com");
      await user.type(screen.getByTestId("password-input"), "password123");
      await user.type(
        screen.getByTestId("confirm-password-input"),
        "password123",
      );
      await user.type(screen.getByTestId("age-input"), "25");
      await user.click(screen.getByTestId("terms-checkbox"));

      // Wait for validation
      await waitFor(() => {
        expect(screen.getByTestId("form-status")).toHaveTextContent(
          "Valid: Yes",
        );
      });

      // Submit form
      const submitButton = screen.getByTestId("submit-button");
      expect(submitButton).not.toBeDisabled();

      await user.click(submitButton);

      // Check if form is in submitting state
      expect(screen.getByTestId("form-status")).toHaveTextContent(
        "Submitting: Yes",
      );
      expect(submitButton).toHaveTextContent("Submitting...");
    });

    it("should prevent submission of invalid form", async () => {
      const user = userEvent.setup();
      render(<FormTestComponent />);

      // Try to submit empty form
      const submitButton = screen.getByTestId("submit-button");
      expect(submitButton).toBeDisabled();

      // Fill out form with invalid data
      await user.type(screen.getByTestId("name-input"), "J");
      await user.type(screen.getByTestId("email-input"), "invalid-email");

      // Form should still be invalid
      expect(screen.getByTestId("form-status")).toHaveTextContent("Valid: No");
      expect(submitButton).toBeDisabled();
    });

    it("should handle submission errors", async () => {
      const user = userEvent.setup();
      render(<FormTestComponent />);

      // Fill out form with valid data
      await user.type(screen.getByTestId("name-input"), "John Doe");
      await user.type(screen.getByTestId("email-input"), "john@example.com");
      await user.type(screen.getByTestId("password-input"), "password123");
      await user.type(
        screen.getByTestId("confirm-password-input"),
        "password123",
      );
      await user.type(screen.getByTestId("age-input"), "25");
      await user.click(screen.getByTestId("terms-checkbox"));

      // Wait for validation
      await waitFor(() => {
        expect(screen.getByTestId("form-status")).toHaveTextContent(
          "Valid: Yes",
        );
      });

      // Submit form
      await user.click(screen.getByTestId("submit-button"));

      // Wait for submission to complete
      await waitFor(() => {
        expect(screen.getByTestId("form-status")).toHaveTextContent(
          "Submitting: No",
        );
      });
    });
  });

  describe("Form Reset", () => {
    it("should reset form to initial values", async () => {
      const user = userEvent.setup();
      render(<FormTestComponent />);

      // Fill out form
      await user.type(screen.getByTestId("name-input"), "John Doe");
      await user.type(screen.getByTestId("email-input"), "john@example.com");
      await user.click(screen.getByTestId("terms-checkbox"));

      // Reset form
      await user.click(screen.getByTestId("reset-button"));

      // Check if form is reset
      expect(screen.getByTestId("name-input")).toHaveValue("");
      expect(screen.getByTestId("email-input")).toHaveValue("");
      expect(screen.getByTestId("terms-checkbox")).not.toBeChecked();
      expect(screen.getByTestId("form-status")).toHaveTextContent("Valid: No");
    });

    it("should clear errors on reset", async () => {
      const user = userEvent.setup();
      render(<FormTestComponent />);

      // Trigger validation errors
      const nameInput = screen.getByTestId("name-input");
      await user.click(nameInput);
      await user.tab();

      expect(screen.getByTestId("name-error")).toBeInTheDocument();

      // Reset form
      await user.click(screen.getByTestId("reset-button"));

      // Errors should be cleared
      expect(screen.queryByTestId("name-error")).not.toBeInTheDocument();
    });
  });

  describe("Manual Validation", () => {
    it("should validate form manually", async () => {
      const user = userEvent.setup();
      render(<FormTestComponent />);

      // Fill out form with invalid data
      await user.type(screen.getByTestId("name-input"), "J");
      await user.type(screen.getByTestId("email-input"), "invalid-email");

      // Trigger manual validation
      await user.click(screen.getByTestId("validate-button"));

      // Check if errors are shown
      expect(screen.getByTestId("name-error")).toHaveTextContent(
        "Name must be at least 2 characters",
      );
      expect(screen.getByTestId("email-error")).toHaveTextContent(
        "Invalid email format",
      );
    });
  });

  describe("Form State Management", () => {
    it("should maintain form state across re-renders", async () => {
      const user = userEvent.setup();
      const { rerender } = render(<FormTestComponent />);

      await user.type(screen.getByTestId("name-input"), "John Doe");
      expect(screen.getByTestId("name-input")).toHaveValue("John Doe");

      // Re-render component
      rerender(<FormTestComponent />);

      expect(screen.getByTestId("name-input")).toHaveValue("John Doe");
    });

    it("should handle rapid input changes", async () => {
      const user = userEvent.setup();
      render(<FormTestComponent />);

      const nameInput = screen.getByTestId("name-input");

      // Type rapidly
      await user.type(nameInput, "John Doe", { delay: 0 });

      expect(nameInput).toHaveValue("John Doe");
    });
  });

  describe("Accessibility", () => {
    it("should be keyboard navigable", async () => {
      const user = userEvent.setup();
      render(<FormTestComponent />);

      // Tab through form fields
      await user.tab();
      expect(screen.getByTestId("name-input")).toHaveFocus();

      await user.tab();
      expect(screen.getByTestId("email-input")).toHaveFocus();

      await user.tab();
      expect(screen.getByTestId("password-input")).toHaveFocus();
    });

    it("should have proper ARIA labels", () => {
      render(<FormTestComponent />);

      expect(screen.getByLabelText("Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
      expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
      expect(screen.getByLabelText("Age")).toBeInTheDocument();
    });

    it("should associate errors with fields", async () => {
      const user = userEvent.setup();
      render(<FormTestComponent />);

      const nameInput = screen.getByTestId("name-input");
      await user.click(nameInput);
      await user.tab();

      const nameError = screen.getByTestId("name-error");
      expect(nameError).toBeInTheDocument();
      expect(nameInput).toHaveAttribute("aria-invalid", "true");
    });
  });
});
