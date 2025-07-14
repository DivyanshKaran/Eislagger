import AppShell from "@/components/layout/app-shell";
import { Chat } from "@/app/chat/page";

export default function ManufacturerChatPage() {
  return (
    <AppShell role="manufacturer" sidebarCollapsed={true}>
      <Chat />
    </AppShell>
  );
}
