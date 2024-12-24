import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "./components/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="mb-4">
      <Sidebar />
      {children}
    </SidebarProvider>
  );
}
