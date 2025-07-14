import AppShell from "@/components/layout/app-shell";
import { Chat } from "@/app/chat/page";

export default function ExecutiveChatPage() {
  return (
    <AppShell role="executive" sidebarCollapsed={true}>
      <Chat />
    </AppShell>
  );
}
