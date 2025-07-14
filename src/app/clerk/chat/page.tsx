import AppShell from "@/components/layout/app-shell";
import { Chat } from "@/app/chat/page";

export default function ClerkChatPage() {
  return (
    <AppShell role="clerk" sidebarCollapsed={true}>
      <Chat />
    </AppShell>
  );
}
