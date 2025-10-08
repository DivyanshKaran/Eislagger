"use client";

import React, { Suspense, lazy } from "react";

import { LazyWrapper } from "@/components/loading/LazyWrapper";

// Lazy load the largest pages
const ManufacturerAnalyticsPage = lazy(
  () => import("./ManufacturerAnalyticsPage"),
);
const ExecutiveReportsPage = lazy(() => import("./ExecutiveReportsPage"));
const InventoryStockPage = lazy(() => import("./InventoryStockPage"));
const ExecutiveMapPage = lazy(() => import("./ExecutiveMapPage"));
const PatronStoresPage = lazy(() => import("./PatronStoresPage"));

// Lazy load the original large pages - using static imports to avoid build issues

// Lazy load other large pages
const OriginalManufacturerAnalyticsPage = lazy(
  () => import("@/app/manufacturer/analytics/page"),
);
const OriginalInventoryStockPage = lazy(
  () => import("@/app/manufacturer/inventory-stock/page"),
);
const OriginalExecutiveMapPage = lazy(
  () => import("@/app/executive/map/page"),
);
const OriginalPatronStoresPage = lazy(
  () => import("@/app/patron/stores/page"),
);
const OriginalPatronFavoritesPage = lazy(
  () => import("@/app/patron/favorites/page"),
);
const OriginalPatronOrdersPage = lazy(() => import("@/app/patron/orders/page"));
const OriginalExecutiveEmailPage = lazy(
  () => import("@/app/executive/email/page"),
);
const OriginalPatronBrowsePage = lazy(() => import("@/app/patron/browse/page"));
const OriginalPatronReviewsPage = lazy(
  () => import("@/app/patron/reviews/page"),
);
const OriginalClerkPosPage = lazy(() => import("@/app/clerk/pos/page"));
const OriginalClerkChatPage = lazy(() => import("@/app/clerk/chat/page"));
const OriginalExecutiveChatPage = lazy(
  () => import("@/app/executive/chat/page"),
);
const OriginalClerkEmailPage = lazy(() => import("@/app/clerk/email/page"));
const OriginalClerkStockPage = lazy(() => import("@/app/clerk/stock/page"));
const OriginalClerkDashboardPage = lazy(
  () => import("@/app/clerk/dashboard/page"),
);
const OriginalExecutiveAnalyticsPage = lazy(
  () => import("@/app/executive/analytics/page"),
);
const OriginalExecutiveBudgetPage = lazy(
  () => import("@/app/executive/budget/page"),
);
const OriginalManufacturerEmailPage = lazy(
  () => import("@/app/manufacturer/email/page"),
);
const OriginalManufacturerRegisterStockPage = lazy(
  () => import("@/app/manufacturer/register-stock/page"),
);
const OriginalManufacturerChatPage = lazy(
  () => import("@/app/manufacturer/chat/page"),
);
const OriginalClerkAnalyticsPage = lazy(
  () => import("@/app/clerk/analytics/page"),
);

interface LazyPageWrapperProps {
  page: string;
  useOptimized?: boolean;
}

export function LazyPageWrapper({
  page,
  useOptimized = false,
}: LazyPageWrapperProps) {
  const getPageComponent = () => {
    if (useOptimized) {
      switch (page) {
        case "manufacturer-analytics":
          return <ManufacturerAnalyticsPage />;
        case "executive-reports":
          return <ExecutiveReportsPage />;
        case "inventory-stock":
          return <InventoryStockPage />;
        case "executive-map":
          return <ExecutiveMapPage />;
        case "patron-stores":
          return <PatronStoresPage />;
        default:
          break;
      }
    }

    // Fallback to original pages
    switch (page) {
      case "manufacturer-analytics":
        return <OriginalManufacturerAnalyticsPage />;
      case "inventory-stock":
        return <OriginalInventoryStockPage />;
      case "executive-map":
        return <OriginalExecutiveMapPage />;
      case "patron-stores":
        return <OriginalPatronStoresPage />;
      case "patron-favorites":
        return <OriginalPatronFavoritesPage />;
      case "patron-orders":
        return <OriginalPatronOrdersPage />;
      case "executive-email":
        return <OriginalExecutiveEmailPage />;
      case "patron-browse":
        return <OriginalPatronBrowsePage />;
      case "patron-reviews":
        return <OriginalPatronReviewsPage />;
      case "clerk-pos":
        return <OriginalClerkPosPage />;
      case "clerk-chat":
        return <OriginalClerkChatPage />;
      case "executive-chat":
        return <OriginalExecutiveChatPage />;
      case "clerk-email":
        return <OriginalClerkEmailPage />;
      case "clerk-stock":
        return <OriginalClerkStockPage />;
      case "clerk-dashboard":
        return <OriginalClerkDashboardPage />;
      case "executive-analytics":
        return <OriginalExecutiveAnalyticsPage />;
      case "executive-budget":
        return <OriginalExecutiveBudgetPage />;
      case "manufacturer-email":
        return <OriginalManufacturerEmailPage />;
      case "manufacturer-register-stock":
        return <OriginalManufacturerRegisterStockPage />;
      case "manufacturer-chat":
        return <OriginalManufacturerChatPage />;
      case "clerk-analytics":
        return <OriginalClerkAnalyticsPage />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <LazyWrapper
      loadingType="skeleton-card"
      loadingText="Loading page..."
      loadingSize="lg"
    >
      {getPageComponent()}
    </LazyWrapper>
  );
}

// Default export for lazy loading
export default LazyPageWrapper;

// Hook for preloading pages
export function usePagePreloader() {
  const preloadPage = React.useCallback((page: string) => {
    switch (page) {
      case "manufacturer-analytics":
        import("./ManufacturerAnalyticsPage");
        break;
      case "inventory-stock":
        import("./InventoryStockPage");
        break;
      case "executive-map":
        import("./ExecutiveMapPage");
        break;
      case "patron-stores":
        import("./PatronStoresPage");
        break;
      default:
        break;
    }
  }, []);

  return { preloadPage };
}
