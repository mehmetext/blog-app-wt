import { getUsers } from "@/actions";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { H3 } from "@/components/ui/typography";
import { Plus } from "lucide-react";
import Link from "next/link";
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
        <Button asChild>
          <Link href="/admin/users/new">
            <Plus className="w-4 h-4 mr-2" />
            Yeni Kullanıcı
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={users} />
    </AdminContainer>
  );
}
