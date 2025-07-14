import AppShell from "@/components/layout/app-shell";
import { Mail } from "@/app/mail/page";

export default function ManufacturerEmailPage() {
  return (
    <AppShell role="manufacturer" sidebarCollapsed={true}>
      <Mail />
    </AppShell>
  );
}
