import type { UserRole } from "@/types";

export type NavLink = {
  label: string;
  href: string;
  icon: string; // lucide icon name resolved in sidebar
  badge?: string | number;
};

export type NavGroup = {
  id: string;
  title: string;
  links: NavLink[];
};

export type RoleNavigationMap = Record<UserRole, NavGroup[]>;

// Centralized navigation model for all roles
export const ROLE_NAV: RoleNavigationMap = {
  executive: [
    {
      id: "main",
      title: "Dashboard",
      links: [
        { label: "Overview", href: "/executive/dashboard", icon: "Home" },
        { label: "Analytics", href: "/executive/analytics", icon: "BarChart3" },
        { label: "Reports", href: "/executive/reports", icon: "FileText" },
      ],
    },
    {
      id: "settings",
      title: "Settings",
      links: [
        { label: "Team", href: "/executive/team", icon: "Users" },
        { label: "Billing", href: "/executive/billing", icon: "CreditCard" },
      ],
    },
  ],
  manufacturer: [
    {
      id: "main",
      title: "Production",
      links: [
        { label: "Dashboard", href: "/manufacturer/dashboard", icon: "Home" },
        { label: "Factories", href: "/manufacturer/factories", icon: "Factory" },
        { label: "Inventory", href: "/manufacturer/inventory", icon: "Package" },
      ],
    },
    {
      id: "settings",
      title: "Settings",
      links: [
        { label: "Account", href: "/manufacturer/account", icon: "Settings" },
      ],
    },
  ],
  clerk: [
    {
      id: "main",
      title: "Store",
      links: [
        { label: "Dashboard", href: "/clerk/dashboard", icon: "Home" },
        { label: "Orders", href: "/clerk/orders", icon: "ShoppingBag" },
        { label: "Products", href: "/clerk/products", icon: "Store" },
      ],
    },
    {
      id: "settings",
      title: "Settings",
      links: [
        { label: "Profile", href: "/clerk/profile", icon: "User" },
      ],
    },
  ],
  patron: [
    {
      id: "main",
      title: "Discover",
      links: [
        { label: "Browse", href: "/patron/browse", icon: "Search" },
        { label: "Stores", href: "/patron/stores", icon: "MapPin" },
        { label: "Favorites", href: "/patron/favorites", icon: "Heart" },
      ],
    },
    {
      id: "account",
      title: "Account",
      links: [
        { label: "Orders", href: "/patron/orders", icon: "FileText" },
        { label: "Settings", href: "/patron/settings", icon: "Settings" },
      ],
    },
  ],
};


