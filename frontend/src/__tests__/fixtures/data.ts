/**
 * Test Data Fixtures
 * Comprehensive test data for all components and services
 */

import type { UserRole } from "@/hooks/useDashboardData";
import type { KPIData, ChartData, Flavor, Order, Email, User } from "@/types";

// User fixtures
export const userFixtures = {
  patron: {
    id: "1",
    name: "John Patron",
    email: "john@example.com",
    role: "patron" as UserRole,
    avatar: "/avatars/patron.png",
    preferences: {
      theme: "light",
      notifications: true,
    },
  },
  manufacturer: {
    id: "2",
    name: "Jane Manufacturer",
    email: "jane@example.com",
    role: "manufacturer" as UserRole,
    avatar: "/avatars/manufacturer.png",
    preferences: {
      theme: "dark",
      notifications: true,
    },
  },
  executive: {
    id: "3",
    name: "Bob Executive",
    email: "bob@example.com",
    role: "executive" as UserRole,
    avatar: "/avatars/executive.png",
    preferences: {
      theme: "system",
      notifications: false,
    },
  },
  clerk: {
    id: "4",
    name: "Alice Clerk",
    email: "alice@example.com",
    role: "clerk" as UserRole,
    avatar: "/avatars/clerk.png",
    preferences: {
      theme: "light",
      notifications: true,
    },
  },
};

// KPI fixtures
export const kpiFixtures: KPIData[] = [
  {
    id: "1",
    title: "Total Revenue",
    value: "$12,450",
    change: "+5.2%",
    changeType: "positive",
    progress: 85,
    priority: "high",
    category: "financial",
    trend: [10000, 11000, 12000, 11500, 12450],
    lastUpdated: "2024-01-15T10:00:00Z",
    description: "Monthly revenue performance",
    icon: "💰",
    bgColor: "bg-green-100",
  },
  {
    id: "2",
    title: "Order Volume",
    value: "1,234",
    change: "+12.3%",
    changeType: "positive",
    progress: 92,
    priority: "high",
    category: "operations",
    trend: [1000, 1100, 1200, 1150, 1234],
    lastUpdated: "2024-01-15T10:00:00Z",
    description: "Total orders processed",
    icon: "📦",
    bgColor: "bg-blue-100",
  },
  {
    id: "3",
    title: "Customer Satisfaction",
    value: "4.8/5",
    change: "-0.2%",
    changeType: "negative",
    progress: 96,
    priority: "medium",
    category: "quality",
    trend: [4.9, 4.8, 4.7, 4.8, 4.8],
    lastUpdated: "2024-01-15T10:00:00Z",
    description: "Average customer rating",
    icon: "⭐",
    bgColor: "bg-yellow-100",
  },
  {
    id: "4",
    title: "Production Efficiency",
    value: "87%",
    change: "+2.1%",
    changeType: "positive",
    progress: 87,
    priority: "medium",
    category: "operations",
    trend: [80, 82, 85, 86, 87],
    lastUpdated: "2024-01-15T10:00:00Z",
    description: "Manufacturing efficiency rate",
    icon: "🏭",
    bgColor: "bg-purple-100",
  },
];

// Chart data fixtures
export const chartDataFixtures: ChartData[] = [
  {
    name: "Jan",
    revenue: 10000,
    orders: 100,
    customers: 50,
    satisfaction: 4.5,
  },
  {
    name: "Feb",
    revenue: 11000,
    orders: 110,
    customers: 55,
    satisfaction: 4.6,
  },
  {
    name: "Mar",
    revenue: 12000,
    orders: 120,
    customers: 60,
    satisfaction: 4.7,
  },
  {
    name: "Apr",
    revenue: 11500,
    orders: 115,
    customers: 58,
    satisfaction: 4.6,
  },
  {
    name: "May",
    revenue: 12450,
    orders: 125,
    customers: 62,
    satisfaction: 4.8,
  },
];

// Flavor fixtures
export const flavorFixtures: Flavor[] = [
  {
    id: "1",
    name: "Strawberry Delight",
    description: "Sweet and tangy strawberry flavor with a creamy finish",
    price: 9.99,
    image: "/images/strawberry-delight.jpg",
    category: "fruity",
    rating: 4.8,
    reviewCount: 156,
    inStock: true,
    tags: ["popular", "fruity", "sweet"],
    ingredients: ["sugar", "natural strawberry flavor", "cream"],
    nutritionInfo: {
      calories: 150,
      sugar: 25,
      fat: 2,
    },
  },
  {
    id: "2",
    name: "Chocolate Dream",
    description: "Rich chocolate flavor with hints of vanilla",
    price: 11.99,
    image: "/images/chocolate-dream.jpg",
    category: "chocolate",
    rating: 4.6,
    reviewCount: 89,
    inStock: true,
    tags: ["chocolate", "rich", "indulgent"],
    ingredients: ["sugar", "cocoa powder", "vanilla extract"],
    nutritionInfo: {
      calories: 180,
      sugar: 30,
      fat: 5,
    },
  },
  {
    id: "3",
    name: "Mint Fresh",
    description: "Cool and refreshing mint flavor",
    price: 8.99,
    image: "/images/mint-fresh.jpg",
    category: "mint",
    rating: 4.4,
    reviewCount: 67,
    inStock: false,
    tags: ["mint", "fresh", "cooling"],
    ingredients: ["sugar", "natural mint flavor", "menthol"],
    nutritionInfo: {
      calories: 120,
      sugar: 20,
      fat: 1,
    },
  },
];

// Order fixtures
export const orderFixtures: Order[] = [
  {
    id: "1",
    userId: "1",
    items: [
      {
        id: "1",
        flavor: flavorFixtures[0],
        quantity: 2,
        size: "regular",
        price: 9.99,
      },
    ],
    total: 19.98,
    status: "pending",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    userId: "1",
    items: [
      {
        id: "2",
        flavor: flavorFixtures[1],
        quantity: 1,
        size: "large",
        price: 11.99,
      },
    ],
    total: 11.99,
    status: "completed",
    createdAt: "2024-01-14T15:30:00Z",
    updatedAt: "2024-01-14T16:00:00Z",
  },
];

// Email fixtures
export const emailFixtures: Email[] = [
  {
    id: "1",
    from: "support@eislagger.com",
    to: "john@example.com",
    subject: "Welcome to EisLagger!",
    body: "Thank you for joining EisLagger. We're excited to have you on board!",
    isRead: false,
    priority: "medium",
    category: "welcome",
    receivedAt: "2024-01-15T09:00:00Z",
    attachments: [],
  },
  {
    id: "2",
    from: "orders@eislagger.com",
    to: "john@example.com",
    subject: "Order Confirmation #12345",
    body: "Your order has been confirmed and is being processed.",
    isRead: true,
    priority: "high",
    category: "order",
    receivedAt: "2024-01-15T10:00:00Z",
    attachments: ["order-confirmation.pdf"],
  },
  {
    id: "3",
    from: "marketing@eislagger.com",
    to: "john@example.com",
    subject: "New Flavors Available!",
    body: "Check out our latest flavor additions to the menu.",
    isRead: false,
    priority: "low",
    category: "marketing",
    receivedAt: "2024-01-14T14:00:00Z",
    attachments: ["new-flavors.pdf"],
  },
];

// Dashboard data fixtures
export const dashboardDataFixtures = {
  patron: {
    kpis: kpiFixtures.slice(0, 2),
    chartData: chartDataFixtures,
    activities: [
      {
        id: "1",
        type: "order",
        message: "Order #12345 completed",
        timestamp: "2024-01-15T10:00:00Z",
      },
    ],
    summary: {
      totalRevenue: 12450,
      totalOrders: 1234,
      totalCustomers: 50,
      growthRate: 5.2,
    },
  },
  manufacturer: {
    kpis: kpiFixtures.slice(2, 4),
    chartData: chartDataFixtures,
    activities: [
      {
        id: "2",
        type: "production",
        message: "Production batch completed",
        timestamp: "2024-01-15T09:00:00Z",
      },
    ],
    summary: {
      totalRevenue: 12450,
      totalOrders: 1234,
      totalCustomers: 50,
      growthRate: 5.2,
    },
  },
  executive: {
    kpis: kpiFixtures,
    chartData: chartDataFixtures,
    activities: [
      {
        id: "3",
        type: "report",
        message: "Monthly report generated",
        timestamp: "2024-01-15T08:00:00Z",
      },
    ],
    summary: {
      totalRevenue: 12450,
      totalOrders: 1234,
      totalCustomers: 50,
      growthRate: 5.2,
    },
  },
  clerk: {
    kpis: kpiFixtures.slice(0, 3),
    chartData: chartDataFixtures,
    activities: [
      {
        id: "4",
        type: "sale",
        message: "New sale recorded",
        timestamp: "2024-01-15T11:00:00Z",
      },
    ],
    summary: {
      totalRevenue: 12450,
      totalOrders: 1234,
      totalCustomers: 50,
      growthRate: 5.2,
    },
  },
};

// Table data fixtures
export const tableDataFixtures = {
  orders: [
    {
      id: "1",
      customer: "John Doe",
      product: "Strawberry Delight",
      quantity: 2,
      total: 19.98,
      status: "pending",
      date: "2024-01-15",
    },
    {
      id: "2",
      customer: "Jane Smith",
      product: "Chocolate Dream",
      quantity: 1,
      total: 11.99,
      status: "completed",
      date: "2024-01-14",
    },
  ],
  customers: [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      orders: 5,
      totalSpent: 89.95,
      lastOrder: "2024-01-15",
      status: "active",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      orders: 3,
      totalSpent: 45.97,
      lastOrder: "2024-01-14",
      status: "active",
    },
  ],
  products: [
    {
      id: "1",
      name: "Strawberry Delight",
      category: "fruity",
      price: 9.99,
      stock: 100,
      sales: 156,
      rating: 4.8,
    },
    {
      id: "2",
      name: "Chocolate Dream",
      category: "chocolate",
      price: 11.99,
      stock: 50,
      sales: 89,
      rating: 4.6,
    },
  ],
};

// Form data fixtures
export const formDataFixtures = {
  login: {
    email: "test@example.com",
    password: "password123",
  },
  register: {
    name: "Test User",
    email: "test@example.com",
    password: "password123",
    confirmPassword: "password123",
  },
  contact: {
    name: "Test User",
    email: "test@example.com",
    subject: "Test Subject",
    message: "Test message content",
  },
  profile: {
    name: "Test User",
    email: "test@example.com",
    phone: "+1234567890",
    address: "123 Test Street",
    city: "Test City",
    state: "Test State",
    zipCode: "12345",
  },
};

// Search fixtures
export const searchFixtures = {
  flavors: [
    {
      id: "1",
      name: "Strawberry Delight",
      category: "fruity",
      rating: 4.8,
      price: 9.99,
    },
    {
      id: "2",
      name: "Chocolate Dream",
      category: "chocolate",
      rating: 4.6,
      price: 11.99,
    },
  ],
  suggestions: ["strawberry", "chocolate", "mint", "vanilla", "caramel"],
  history: ["strawberry", "chocolate", "mint"],
};

// Notification fixtures
export const notificationFixtures = [
  {
    id: "1",
    type: "success",
    title: "Order Completed",
    message: "Your order has been successfully processed.",
    timestamp: "2024-01-15T10:00:00Z",
    isRead: false,
  },
  {
    id: "2",
    type: "info",
    title: "New Feature",
    message: "Check out our new flavor customization options.",
    timestamp: "2024-01-15T09:00:00Z",
    isRead: true,
  },
  {
    id: "3",
    type: "warning",
    title: "Low Stock",
    message: "Mint Fresh is running low on stock.",
    timestamp: "2024-01-15T08:00:00Z",
    isRead: false,
  },
];

// Error fixtures
export const errorFixtures = {
  network: {
    message: "Network error",
    status: 500,
    timestamp: "2024-01-15T10:00:00Z",
  },
  validation: {
    message: "Validation failed",
    status: 400,
    timestamp: "2024-01-15T10:00:00Z",
    details: {
      email: "Invalid email format",
      password: "Password too short",
    },
  },
  notFound: {
    message: "Resource not found",
    status: 404,
    timestamp: "2024-01-15T10:00:00Z",
  },
  unauthorized: {
    message: "Unauthorized access",
    status: 401,
    timestamp: "2024-01-15T10:00:00Z",
  },
};

// Export all fixtures
export const fixtures = {
  users: userFixtures,
  kpis: kpiFixtures,
  charts: chartDataFixtures,
  flavors: flavorFixtures,
  orders: orderFixtures,
  emails: emailFixtures,
  dashboard: dashboardDataFixtures,
  tables: tableDataFixtures,
  forms: formDataFixtures,
  search: searchFixtures,
  notifications: notificationFixtures,
  errors: errorFixtures,
};
