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
        { label: "Admin Panel", href: "/admin" },
        { label: "Users", href: "/admin/users" },
      ]}
    >
      <div className="flex justify-between items-center">
        <H3>Users</H3>
      </div>
      <DataTable columns={columns} data={users} />
    </AdminContainer>
  );
}
