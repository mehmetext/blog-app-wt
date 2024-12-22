import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function AdminHeader() {
  return (
    <header className="flex items-center h-16 px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-4 ml-2 mr-4" />
      <BreadcrumbNav items={[{ label: "Admin Paneli", href: "/admin" }]} />
    </header>
  );
}
