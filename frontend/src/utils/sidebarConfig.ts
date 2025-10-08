export interface NavigationItem {
  href: string;
  iconName: string;
  label: string;
  badge?: string;
  disabled?: boolean;
}

export interface SidebarConfig {
  role: string;
  title: string;
  icon: string;
  gradient: string;
  navigationItems: NavigationItem[];
}

export const getSidebarConfig = (role: string): SidebarConfig => {
  switch (role) {
    case "executive":
      return {
        role: "executive",
        title: "Executive",
        icon: "👔",
        gradient: "from-indigo-400 to-purple-500",
        navigationItems: [
          {
            href: "/executive/dashboard",
            iconName: "Home",
            label: "Dashboard",
          },
          {
            href: "/executive/analytics",
            iconName: "BarChart3",
            label: "Analytics",
          },
          {
            href: "/executive/budget",
            iconName: "DollarSign",
            label: "Budget",
          },
          {
            href: "/executive/chat",
            iconName: "MessageSquare",
            label: "Chat",
          },
          {
            href: "/executive/email",
            iconName: "Mail",
            label: "Email",
          },
          {
            href: "/executive/map",
            iconName: "MapPin",
            label: "Map",
          },
        ],
      };

    case "manufacturer":
      return {
        role: "manufacturer",
        title: "Manufacturer",
        icon: "🏭",
        gradient: "from-orange-400 to-red-500",
        navigationItems: [
          {
            href: "/manufacturer/dashboard",
            iconName: "Home",
            label: "Dashboard",
          },
          {
            href: "/manufacturer/analytics",
            iconName: "BarChart3",
            label: "Analytics",
          },
          {
            href: "/manufacturer/inventory-stock",
            iconName: "Package",
            label: "Inventory",
          },
          {
            href: "/manufacturer/register-stock",
            iconName: "Factory",
            label: "Register Stock",
          },
          {
            href: "/manufacturer/chat",
            iconName: "MessageSquare",
            label: "Chat",
          },
          {
            href: "/manufacturer/email",
            iconName: "Mail",
            label: "Email",
          },
        ],
      };

    case "clerk":
      return {
        role: "clerk",
        title: "Clerk",
        icon: "🏪",
        gradient: "from-pink-400 to-purple-500",
        navigationItems: [
          {
            href: "/clerk/dashboard",
            iconName: "Store",
            label: "Dashboard",
          },
          {
            href: "/clerk/pos",
            iconName: "CreditCard",
            label: "POS",
          },
          {
            href: "/clerk/stock",
            iconName: "Package",
            label: "Stock",
          },
          {
            href: "/clerk/chat",
            iconName: "MessageSquare",
            label: "Chat",
          },
          {
            href: "/clerk/email",
            iconName: "Mail",
            label: "Email",
          },
          {
            href: "/clerk/analytics",
            iconName: "BarChart3",
            label: "Analytics",
          },
        ],
      };

    case "patron":
      return {
        role: "patron",
        title: "Patron",
        icon: "🛒",
        gradient: "from-purple-400 to-pink-500",
        navigationItems: [
          {
            href: "/patron/dashboard",
            iconName: "Home",
            label: "Dashboard",
          },
          {
            href: "/patron/browse",
            iconName: "Search",
            label: "Browse",
          },
          {
            href: "/patron/orders",
            iconName: "ShoppingBag",
            label: "Orders",
          },
          {
            href: "/patron/favorites",
            iconName: "Heart",
            label: "Favorites",
          },
          {
            href: "/patron/reviews",
            iconName: "Star",
            label: "Reviews",
          },
          {
            href: "/patron/stores",
            iconName: "MapPin",
            label: "Map",
          },
        ],
      };

    default:
      return {
        role: "default",
        title: "User",
        icon: "👤",
        gradient: "from-gray-400 to-gray-500",
        navigationItems: [],
      };
  }
};
