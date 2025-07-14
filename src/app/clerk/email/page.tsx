import AppShell from "@/components/layout/app-shell";
import { Mail } from "@/app/mail/page";

export default function ClerkEmailPage() {
  return (
    <AppShell role="clerk" sidebarCollapsed={true}>
      <Mail />
    </AppShell>
  );
}
