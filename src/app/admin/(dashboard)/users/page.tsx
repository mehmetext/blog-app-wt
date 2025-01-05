import { getUsers } from "@/actions";
import { DataTable } from "@/components/ui/data-table";
import { H3 } from "@/components/ui/typography";
import AdminContainer from "../components/admin-container";
import columns from "./columns";

export default async function AdminCategoriesPage() {
  const users = await getUsers();

  return (
    <AdminContainer
      breadcrumb={[
        { label: "Admin Paneli", href: "/admin" },
        { label: "Kullanıcılar", href: "/admin/users" },
      ]}
    >
      <div className="flex justify-between items-center">
        <H3>Kullanıcılar</H3>
      </div>
      <DataTable columns={columns} data={users} />
    </AdminContainer>
  );
}
