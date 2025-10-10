// Custom Hooks
export { useDashboardData } from "./useDashboardData";
export { useKPICard } from "./useKPICard";
export { useChartData } from "./useChartData";
export { useTableData } from "./useTableData";
export { useEmailData } from "./useEmailData";
export { useCart } from "./useCart";
export { useSearch } from "./useSearch";
export { useForm } from "./useForm";
export { useLocalStorage } from "./useLocalStorage";
export { useDebounce } from "./useDebounce";

// Backend Integration Hooks
export * from "./useAuth";
export * from "./useEmails";
export * from "./useNotifications";
export * from "./useFlavors";
export * from "./useOrders";
export * from "./useStores";
export * from "./useAnalytics";
export * from "./useInventory";
export * from "./useMessages";
export * from "./useStoreData";

// Dashboard hooks (avoiding conflicts with analytics)
export {
  useKPIs as useKPIData,
  useChartData as useChartDataHook,
  useAnalyticsReports,
  usePatronDashboard,
  useClerkDashboard,
  useManufacturerDashboard,
  useExecutiveDashboard,
  useRecentActivity,
  useDashboardSummary,
  useSalesTrends as useSalesTrendsData,
  useInventoryStatus,
  useUserActivity,
} from "./useDashboardData";

// Sales hooks (avoiding conflicts with existing exports)
export {
  useSalesRevenue,
  useSalesTrends,
  useSalesReports,
  useCreateOrder as useCreateOrderMutation,
  useUpdateOrderStatus as useUpdateOrderStatusMutation,
  useCancelOrder as useCancelOrderMutation,
  useCreateStore as useCreateStoreMutation,
  useUpdateStore as useUpdateStoreMutation,
  useDeleteStore as useDeleteStoreMutation,
  useStoreAnalytics,
  useStoreMenu,
  useStoreInventory,
} from "./useSales";

// Re-export types
export type { DashboardData } from "@/types/api/index";
export type { ChartConfig } from "./useChartData";
export type {
  TableFilter,
  TableSort,
  UseTableDataOptions,
} from "./useTableData";
export type { UseEmailDataOptions } from "./useEmailData";
