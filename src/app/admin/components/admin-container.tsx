import { BreadcrumbItem } from "@/components/breadcrumb-nav";
import AdminHeader from "./admin-header";
export default function AdminContainer({
  children,
  breadcrumb,
}: {
  children: React.ReactNode;
  breadcrumb: BreadcrumbItem[];
}) {
  return (
    <main className="flex-1 flex flex-col">
      <AdminHeader breadcrumb={breadcrumb} />
      <div className="flex-1 flex flex-col gap-4 px-4">{children}</div>
    </main>
  );
}
