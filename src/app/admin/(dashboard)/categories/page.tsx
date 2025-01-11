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
        { label: "Admin Panel", href: "/admin" },
        { label: "Categories", href: "/admin/categories" },
      ]}
    >
      <div className="flex justify-between items-center">
        <H3>Categories</H3>
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
