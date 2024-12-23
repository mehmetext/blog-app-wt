import { BreadcrumbItem, BreadcrumbNav } from "@/components/breadcrumb-nav";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function AdminHeader({
  breadcrumb,
}: {
  breadcrumb: BreadcrumbItem[];
}) {
  return (
    <header className="flex items-center h-16 px-4 bg-background fixed z-10 top-0 w-full">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-4 ml-2 mr-4" />
      <BreadcrumbNav items={breadcrumb} />
    </header>
  );
}
