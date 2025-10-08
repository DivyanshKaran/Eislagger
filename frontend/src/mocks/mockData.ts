// Mock data for API fallback when backend is unreachable
import type {
  User,
  Flavor,
  Order,
  Store,
  Message,
  Email,
  Notification,
  KPIData,
  ChartData,
  AnalyticsData,
} from '@/types/models';
import type { DashboardData } from '@/types/api';

// ============================================================================
// MOCK USERS
// ============================================================================
export const getMockUser = (): User => ({
  id: "mock-user-1",
  name: "John Doe",
  email: "john.doe@eislagger.com",
  role: "patron",
  status: "online",
  avatar: "/avatars/john-doe.jpg",
  phone: "+1 (555) 123-4567",
  address: "123 Ice Cream St, Sweet City, SC 12345",
  preferences: {
    theme: "light",
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: true,
    },
    language: "en",
    timezone: "America/New_York",
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const getMockUsers = (): User[] => [
  getMockUser(),
  {
    ...getMockUser(),
    id: "mock-user-2",
    name: "Jane Smith",
    email: "jane.smith@eislagger.com",
    role: "clerk",
  },
  {
    ...getMockUser(),
    id: "mock-user-3",
    name: "Bob Johnson",
    email: "bob.johnson@eislagger.com",
    role: "executive",
  },
];

// ============================================================================
// MOCK FLAVORS
// ============================================================================
export const getMockFlavor = (): Flavor => ({
  id: "mock-flavor-1",
  name: "Vanilla Dream",
  description: "Classic vanilla ice cream made with real vanilla beans and fresh cream. A timeless favorite that never goes out of style.",
  price: 4.99,
  category: "Classic",
  ingredients: ["Fresh Cream", "Real Vanilla Beans", "Sugar", "Egg Yolks", "Natural Vanilla Extract"],
  allergens: ["Dairy", "Eggs"],
  nutritionalInfo: {
    calories: 180,
    protein: 4,
    carbs: 20,
    fat: 10,
    sugar: 18,
    fiber: 0,
  },
  images: ["/flavors/vanilla-dream.jpg"],
  rating: 4.8,
  reviewCount: 127,
  isAvailable: true,
  stock: 50,
  tags: ["Classic", "Vanilla", "Creamy", "Popular"],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const getMockFlavors = (): Flavor[] => [
  getMockFlavor(),
  {
    ...getMockFlavor(),
    id: "mock-flavor-2",
    name: "Chocolate Fudge",
    description: "Rich chocolate ice cream with chunks of fudge and a velvety smooth texture.",
    price: 5.49,
    category: "Chocolate",
    ingredients: ["Fresh Cream", "Cocoa Powder", "Dark Chocolate", "Sugar", "Egg Yolks"],
    allergens: ["Dairy", "Eggs"],
    nutritionalInfo: {
      calories: 220,
      protein: 5,
      carbs: 25,
      fat: 12,
      sugar: 22,
      fiber: 2,
    },
    images: ["/flavors/chocolate-fudge.jpg"],
    rating: 4.9,
    reviewCount: 89,
    tags: ["Chocolate", "Rich", "Fudge", "Decadent"],
  },
  {
    ...getMockFlavor(),
    id: "mock-flavor-3",
    name: "Strawberry Fields",
    description: "Fresh strawberry ice cream made with real strawberries and a hint of cream.",
    price: 5.99,
    category: "Fruit",
    ingredients: ["Fresh Cream", "Real Strawberries", "Sugar", "Egg Yolks", "Natural Strawberry Extract"],
    allergens: ["Dairy", "Eggs"],
    nutritionalInfo: {
      calories: 160,
      protein: 3,
      carbs: 22,
      fat: 8,
      sugar: 20,
      fiber: 1,
    },
    images: ["/flavors/strawberry-fields.jpg"],
    rating: 4.7,
    reviewCount: 156,
    tags: ["Fruit", "Strawberry", "Fresh", "Light"],
  },
  {
    ...getMockFlavor(),
    id: "mock-flavor-4",
    name: "Mint Chocolate Chip",
    description: "Refreshing mint ice cream with dark chocolate chips throughout.",
    price: 5.29,
    category: "Mint",
    ingredients: ["Fresh Cream", "Peppermint Extract", "Dark Chocolate Chips", "Sugar", "Egg Yolks"],
    allergens: ["Dairy", "Eggs"],
    nutritionalInfo: {
      calories: 190,
      protein: 4,
      carbs: 21,
      fat: 11,
      sugar: 19,
      fiber: 1,
    },
    images: ["/flavors/mint-chocolate-chip.jpg"],
    rating: 4.6,
    reviewCount: 203,
    tags: ["Mint", "Chocolate", "Refreshing", "Chips"],
  },
];

// ============================================================================
// MOCK ORDERS
// ============================================================================
export const getMockOrder = (): Order => ({
  id: "mock-order-1",
  userId: "mock-user-1",
  items: [
    {
      flavorId: "mock-flavor-1",
      quantity: 2,
      price: 4.99,
      size: "regular",
      customizations: ["Extra sprinkles"],
    },
    {
      flavorId: "mock-flavor-2",
      quantity: 1,
      price: 5.49,
      size: "large",
      customizations: [],
    },
  ],
  total: 15.47,
  status: "confirmed",
  paymentMethod: "credit_card",
  shippingAddress: {
    street: "123 Ice Cream St",
    city: "Sweet City",
    state: "SC",
    zipCode: "12345",
    country: "USA",
    phone: "+1 (555) 123-4567",
  },
  notes: "Please deliver to the front door",
  estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const getMockOrders = (): Order[] => [
  getMockOrder(),
  {
    ...getMockOrder(),
    id: "mock-order-2",
    status: "preparing",
    items: [
      {
        flavorId: "mock-flavor-3",
        quantity: 3,
        price: 5.99,
        size: "regular",
        customizations: ["Extra fruit"],
      },
    ],
    total: 17.97,
  },
  {
    ...getMockOrder(),
    id: "mock-order-3",
    status: "ready",
    items: [
      {
        flavorId: "mock-flavor-4",
        quantity: 1,
        price: 5.29,
        size: "small",
        customizations: [],
      },
    ],
    total: 5.29,
  },
];

// ============================================================================
// MOCK STORES
// ============================================================================
export const getMockStore = (): Store => ({
  id: "mock-store-1",
  name: "EisLagger Downtown",
  address: {
    street: "456 Main Street",
    city: "Sweet City",
    state: "SC",
    zipCode: "12345",
    country: "USA",
  },
  phone: "+1 (555) 987-6543",
  email: "downtown@eislagger.com",
  managerId: "mock-user-2",
  hours: {
    monday: { open: "10:00", close: "22:00", isClosed: false },
    tuesday: { open: "10:00", close: "22:00", isClosed: false },
    wednesday: { open: "10:00", close: "22:00", isClosed: false },
    thursday: { open: "10:00", close: "22:00", isClosed: false },
    friday: { open: "10:00", close: "23:00", isClosed: false },
    saturday: { open: "09:00", close: "23:00", isClosed: false },
    sunday: { open: "11:00", close: "21:00", isClosed: false },
  },
  services: ["dine_in", "takeout", "delivery"],
  isActive: true,
  capacity: 50,
  currentOccupancy: 23,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const getMockStores = (): Store[] => [
  getMockStore(),
  {
    ...getMockStore(),
    id: "mock-store-2",
    name: "EisLagger Mall",
    address: {
      street: "789 Shopping Center Dr",
      city: "Mall City",
      state: "SC",
      zipCode: "12346",
      country: "USA",
    },
    phone: "+1 (555) 987-6544",
    email: "mall@eislagger.com",
    capacity: 30,
    currentOccupancy: 15,
  },
];

// ============================================================================
// MOCK MESSAGES
// ============================================================================
export const getMockMessages = (): Message[] => [
  {
    id: "mock-message-1",
    senderId: "mock-user-2",
    senderRole: "clerk",
    receiverId: "mock-user-1",
    receiverRole: "patron",
    text: "Your order is ready for pickup!",
    read: false,
    messageType: "text",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "mock-message-2",
    senderId: "mock-user-1",
    senderRole: "patron",
    receiverId: "mock-user-2",
    receiverRole: "clerk",
    text: "Thank you! I'll be there in 10 minutes.",
    read: true,
    messageType: "text",
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
];

// ============================================================================
// MOCK EMAILS
// ============================================================================
export const getMockEmails = (): Email[] => [
  {
    id: "mock-email-1",
    folder: "inbox",
    subject: "Welcome to EisLagger!",
    senderId: "system",
    receiverId: "mock-user-1",
    content: "Welcome to EisLagger! We're excited to have you as part of our ice cream family.",
    tags: ["welcome", "system"],
    unread: true,
    starred: false,
    important: false,
    priority: "medium",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// ============================================================================
// MOCK NOTIFICATIONS
// ============================================================================
export const getMockNotifications = (): Notification[] => [
  {
    id: "mock-notification-1",
    userId: "mock-user-1",
    type: "order_update",
    title: "Order Ready",
    message: "Your order #mock-order-1 is ready for pickup!",
    read: false,
    priority: "high",
    actionUrl: "/orders/mock-order-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// ============================================================================
// MOCK ANALYTICS DATA
// ============================================================================
export const getMockKPIs = (): KPIData[] => [
  {
    id: "kpi-1",
    title: "Total Revenue",
    value: 125000,
    change: 12.5,
    changeType: "increase",
    target: 150000,
    unit: "$",
    description: "Total revenue for the current month",
    category: "financial",
    priority: "high",
    lastUpdated: new Date().toISOString(),
    trend: [100000, 110000, 115000, 120000, 125000],
    period: "month",
    progress: 83.3,
  },
  {
    id: "kpi-2",
    title: "Orders Processed",
    value: 1250,
    change: 8.3,
    changeType: "increase",
    target: 1500,
    unit: "orders",
    description: "Number of orders processed this month",
    category: "operational",
    priority: "medium",
    lastUpdated: new Date().toISOString(),
    trend: [1000, 1100, 1150, 1200, 1250],
    period: "month",
    progress: 83.3,
  },
];

export const getMockChartData = (): ChartData => ({
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Revenue",
      data: [1200, 1900, 3000, 5000, 2000, 3000, 4500],
      backgroundColor: "rgba(59, 130, 246, 0.5)",
      borderColor: "rgba(59, 130, 246, 1)",
      borderWidth: 2,
      fill: true,
    },
  ],
});

export const getMockDashboardData = (): DashboardData => ({
  kpis: getMockKPIs(),
  charts: [getMockChartData()],
  recentActivity: [
    {
      id: "activity-1",
      type: "order",
      message: "New order #mock-order-1 placed",
      timestamp: new Date().toISOString(),
    },
    {
      id: "activity-2",
      type: "payment",
      message: "Payment received for order #mock-order-2",
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
  ],
  alerts: [
    {
      id: "alert-1",
      type: "warning",
      message: "Low stock alert: Vanilla Dream",
      action: "restock",
      timestamp: new Date().toISOString(),
    },
  ],
});

// ============================================================================
// MOCK ANALYTICS DATA
// ============================================================================
export const getMockAnalyticsData = (): AnalyticsData => ({
  period: "month",
  metrics: {
    revenue: 125000,
    orders: 1250,
    customers: 850,
    averageOrderValue: 100,
  },
  trends: [
    { date: "2024-01-01", value: 100000, label: "Revenue" },
    { date: "2024-01-02", value: 110000, label: "Revenue" },
    { date: "2024-01-03", value: 115000, label: "Revenue" },
  ],
  breakdown: {
    "Vanilla Dream": 25000,
    "Chocolate Fudge": 30000,
    "Strawberry Fields": 20000,
    "Mint Chocolate Chip": 15000,
  },
});

// ============================================================================
// MOCK RESPONSE HELPERS
// ============================================================================
export const createMockSuccessResponse = <T>(data: T) => ({
  success: true,
  data,
  message: "Mock data loaded successfully",
});

export const createMockPaginatedResponse = <T>(data: T[], page = 1, limit = 10) => ({
  success: true,
  data,
  pagination: {
    page,
    limit,
    total: data.length,
    totalPages: Math.ceil(data.length / limit),
    hasNext: page < Math.ceil(data.length / limit),
    hasPrev: page > 1,
  },
  message: "Mock data loaded successfully",
});
