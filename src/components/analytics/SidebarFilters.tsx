import {
  Filter,
  Factory,
  Store,
  IceCream,
  Globe,
  Archive,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SidebarFilters() {
  return (
    <aside className="sticky top-0 h-[calc(100vh-4rem)] bg-white/80 dark:bg-slate-800/80 border-r border-slate-200/50 dark:border-slate-700/50 p-6 w-72 flex flex-col gap-6 shadow-xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
          <Filter className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-slate-800 dark:text-white">
            Analytics Filters
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Refine your data view
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="space-y-6 flex-1">
        {/* Factory Filter */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Factory className="w-4 h-4" />
            Factory
          </label>
          <select className="w-full rounded-xl border border-slate-200 dark:border-slate-600 px-4 py-3 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/50 transition-all duration-300">
            <option>All Factories</option>
            <option>Berlin Factory</option>
            <option>Mumbai Factory</option>
            <option>Pune Factory</option>
          </select>
        </div>

        {/* Shop Filter */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Store className="w-4 h-4" />
            Shop
          </label>
          <select className="w-full rounded-xl border border-slate-200 dark:border-slate-600 px-4 py-3 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/50 transition-all duration-300">
            <option>All Shops</option>
            <option>Berlin Central</option>
            <option>Pune HQ</option>
            <option>Mumbai Downtown</option>
          </select>
        </div>

        {/* Flavor Search */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <IceCream className="w-4 h-4" />
            Flavor
          </label>
          <div className="relative">
            <Input
              placeholder="Search flavors..."
              className="rounded-xl pl-10 pr-4 py-3 bg-white/70 dark:bg-slate-700/70 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500/50"
            />
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Region Filter */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Globe className="w-4 h-4" />
            Region
          </label>
          <select className="w-full rounded-xl border border-slate-200 dark:border-slate-600 px-4 py-3 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/50 transition-all duration-300">
            <option>All Regions</option>
            <option>North America</option>
            <option>Europe</option>
            <option>Asia Pacific</option>
            <option>South America</option>
          </select>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Search className="w-4 h-4" />
            Date Range
          </label>
          <select className="w-full rounded-xl border border-slate-200 dark:border-slate-600 px-4 py-3 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/50 transition-all duration-300">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
            <option>Last Year</option>
            <option>Custom Range</option>
          </select>
        </div>

        {/* Archived Toggle */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50">
          <input
            type="checkbox"
            id="archived"
            className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label
            htmlFor="archived"
            className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"
          >
            <Archive className="w-4 h-4" />
            Include Archived Data
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
        <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl py-3 transition-all duration-300 shadow-lg hover:shadow-xl">
          Apply Filters
        </Button>
        <Button
          variant="outline"
          className="w-full rounded-xl py-3 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300"
        >
          Reset All
        </Button>
      </div>
    </aside>
  );
}
