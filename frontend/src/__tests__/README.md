# Testing Documentation

This directory contains comprehensive tests for the application, including unit tests, integration tests, and testing utilities.

## Test Structure

```
src/__tests__/
├── utils/                 # Test utilities and helpers
│   └── test-utils.tsx    # Custom render function with providers
├── fixtures/              # Test data and fixtures
│   └── data.ts           # Mock data for tests
├── mocks/                 # Mock implementations
│   └── services.ts       # Mock service implementations
├── integration/           # Integration tests
│   ├── dashboard-flow.test.tsx
│   ├── cart-flow.test.tsx
│   ├── form-flow.test.tsx
│   └── analytics-flow.test.tsx
├── hooks/                 # Hook tests
│   ├── useDashboardData.test.ts
│   ├── useCart.test.ts
│   └── useForm.test.ts
├── utils/                 # Utility function tests
│   ├── dashboardUtils.test.ts
│   └── chartUtils.test.ts
├── services/              # Service tests
│   └── dashboardService.test.ts
├── components/            # Component tests
│   └── presentational/
│       ├── KPICard.test.tsx
│       └── DataTable.test.tsx
├── index.ts              # Test barrel exports
└── README.md             # This file
```

## Test Configuration

### Jest Configuration

- **Test Environment**: `jsdom` for DOM testing
- **Setup Files**: `jest.setup.js` for global test setup
- **Module Mapping**: TypeScript path aliases configured
- **Coverage**: 80%+ threshold for business logic

### Testing Libraries

- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing utilities
- **@testing-library/jest-dom**: Custom matchers for DOM testing
- **@testing-library/user-event**: User interaction simulation
- **MSW**: API mocking for integration tests

## Running Tests

### Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

### Test Categories

- **Unit Tests**: Individual functions, hooks, and components
- **Integration Tests**: Complete user flows and interactions
- **Service Tests**: API calls and data fetching
- **Component Tests**: UI rendering and user interactions

## Test Utilities

### Custom Render Function

```typescript
import { render } from '../utils/test-utils';

// Renders component with all necessary providers
render(<MyComponent />);
```

### Mock Data

```typescript
import { fixtures } from "../fixtures/data";

// Use predefined test data
const mockUser = fixtures.users[0];
const mockDashboard = fixtures.dashboard.patron;
```

### Mock Services

```typescript
import { mockDashboardService } from "../mocks/services";

// Mock API responses
mockDashboardService.getDashboardData.mockResolvedValue({
  data: fixtures.dashboard.patron,
  success: true,
  message: "Success",
  timestamp: new Date().toISOString(),
});
```

## Test Patterns

### Component Testing

```typescript
describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interactions', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);

    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked')).toBeInTheDocument();
  });
});
```

### Hook Testing

```typescript
describe("useMyHook", () => {
  it("should return initial state", () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current.value).toBe(initialValue);
  });

  it("should update state", () => {
    const { result } = renderHook(() => useMyHook());
    act(() => {
      result.current.setValue("new value");
    });
    expect(result.current.value).toBe("new value");
  });
});
```

### Integration Testing

```typescript
describe('User Flow', () => {
  it('should complete full user journey', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Step 1: Login
    await user.type(screen.getByLabelText('Email'), 'user@example.com');
    await user.type(screen.getByLabelText('Password'), 'password');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    // Step 2: Navigate to dashboard
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    // Step 3: Interact with dashboard
    await user.click(screen.getByText('Add Item'));
    expect(screen.getByText('Item Added')).toBeInTheDocument();
  });
});
```

## Coverage Goals

### Target Coverage

- **Business Logic**: 80%+ coverage
- **Critical Components**: 90%+ coverage
- **Utility Functions**: 95%+ coverage
- **Services**: 85%+ coverage

### Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# View coverage in browser
open coverage/lcov-report/index.html
```

## Best Practices

### Test Organization

1. **Group related tests** in `describe` blocks
2. **Use descriptive test names** that explain the behavior
3. **Follow AAA pattern**: Arrange, Act, Assert
4. **Keep tests focused** on single behavior
5. **Use proper cleanup** in `beforeEach`/`afterEach`

### Test Data

1. **Use fixtures** for consistent test data
2. **Mock external dependencies** (APIs, localStorage, etc.)
3. **Create realistic test scenarios**
4. **Avoid hardcoded values** in tests

### Assertions

1. **Use specific matchers** (`toBeInTheDocument()` vs `toBeTruthy()`)
2. **Test user-visible behavior** over implementation details
3. **Assert on final state** rather than intermediate steps
4. **Use async matchers** for dynamic content

### Performance

1. **Mock expensive operations** (API calls, file I/O)
2. **Use `waitFor`** for async operations
3. **Clean up timers** and event listeners
4. **Avoid testing implementation details**

## Debugging Tests

### Common Issues

1. **Async operations**: Use `waitFor` or `findBy` queries
2. **Component not found**: Check if component is actually rendered
3. **Mock not working**: Verify mock setup and imports
4. **Timing issues**: Use `act()` for state updates

### Debugging Tools

```typescript
// Debug component output
screen.debug();

// Debug specific element
screen.debug(screen.getByRole("button"));

// Log all queries
screen.logTestingPlaygroundURL();
```

## Continuous Integration

### CI Configuration

- Tests run on every pull request
- Coverage reports generated and uploaded
- Failed tests block deployment
- Performance tests run on schedule

### Quality Gates

- All tests must pass
- Coverage threshold must be met
- No linting errors
- No security vulnerabilities

## Contributing

### Adding New Tests

1. **Follow existing patterns** and structure
2. **Add tests for new features** before implementation
3. **Update fixtures** when adding new data types
4. **Document complex test scenarios**

### Test Review

1. **Check test coverage** for new code
2. **Verify test quality** and readability
3. **Ensure tests are maintainable**
4. **Review mock implementations**

## Resources

### Documentation

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [MSW Documentation](https://mswjs.io/docs/getting-started)

### Tools

- [Testing Playground](https://testing-playground.com/) - Query testing
- [Jest Coverage](https://jestjs.io/docs/cli#--coverage) - Coverage reports
- [React DevTools](https://reactjs.org/blog/2019/08/15/new-react-devtools.html) - Component debugging
