import AppShell from "@/components/layout/app-shell";

export default function HelpPage() {
  return (
    <AppShell role="executive">
      <div className="space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Help & Support</h2>
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-muted-foreground">
              This page is under construction
            </h3>
            <p className="text-muted-foreground mt-2">
              Help documentation and support features coming soon.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
