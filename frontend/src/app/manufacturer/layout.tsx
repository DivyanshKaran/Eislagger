"use client";

import Sidebar from "@/components/layout/sidebar";

export default function ManufacturerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 dark:from-blue-950/30 dark:via-sky-950/30 dark:to-indigo-950/30 overflow-hidden">
      <Sidebar role="manufacturer" collapsible={true} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-transparent">
          {children}
        </main>
      </div>
    </div>
  );
}
