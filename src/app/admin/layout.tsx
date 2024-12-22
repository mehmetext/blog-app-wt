import { SidebarProvider } from "@/components/ui/sidebar";
import AdminHeader from "./components/header";
import Sidebar from "./components/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <AdminHeader />
        <div className="flex-1 flex flex-col gap-4 px-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}
