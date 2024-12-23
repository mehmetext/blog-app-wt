import { BreadcrumbItem, BreadcrumbNav } from "@/components/breadcrumb-nav";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function AdminHeader({
  breadcrumb,
}: {
  breadcrumb: BreadcrumbItem[];
}) {
  return (
    <header className="flex items-center h-16 px-4 sticky top-0 bg-background">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-4 ml-2 mr-4" />
      <BreadcrumbNav items={breadcrumb} />
    </header>
  );
}
