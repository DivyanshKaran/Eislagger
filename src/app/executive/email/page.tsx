import AppShell from "@/components/layout/app-shell";
import { Mail } from "@/app/mail/page";

export default function ExecutiveEmailPage() {
  return (
    <AppShell role="executive" sidebarCollapsed={true}>
      <Mail />
    </AppShell>
  );
}
