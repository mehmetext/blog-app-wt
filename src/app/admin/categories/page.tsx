import { getCategories } from "@/actions";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { H3 } from "@/components/ui/typography";
import { Plus } from "lucide-react";
import Link from "next/link";
import AdminContainer from "../components/admin-container";
import categoriesColumns from "./categories-columns";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <AdminContainer
      breadcrumb={[
        { label: "Admin Paneli", href: "/admin" },
        { label: "Kategoriler", href: "/admin/categories" },
      ]}
    >
      <div className="flex justify-between items-center">
        <H3>Kategoriler</H3>
        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus className="w-4 h-4 mr-2" />
            Yeni Kategori
          </Link>
        </Button>
      </div>
      <DataTable columns={categoriesColumns} data={categories} />
    </AdminContainer>
  );
}
