import { currentUser } from "@/actions";
import { SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import Sidebar from "./components/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (user?.role !== "ADMIN") {
    return redirect("/");
  }

  return (
    <SidebarProvider className="mb-4">
      <Sidebar />
      {children}
    </SidebarProvider>
  );
}
