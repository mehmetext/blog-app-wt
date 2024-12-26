import { createCategory, getCategories, updateCategory } from "@/actions";
import { H3 } from "@/components/ui/typography";
import AdminContainer from "../components/admin-container";
import CategoryDialog from "./components/category-dialog";
import CategoriesDataTable from "./data-table";

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
        <CategoryDialog
          onSubmit={async (data) => {
            "use server";
            await createCategory(data);
          }}
        />
      </div>
      <CategoriesDataTable
        categories={categories}
        onUpdate={async (id, data) => {
          "use server";
          await updateCategory(id, data);
        }}
      />
    </AdminContainer>
  );
}
