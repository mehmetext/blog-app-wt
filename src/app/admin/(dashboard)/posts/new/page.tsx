import { getCategories } from "@/actions";
import { H3 } from "@/components/ui/typography";
import AdminContainer from "../../components/admin-container";
import NewPostForm from "./components/new-post-form";

export default async function NewPostPage() {
  const categories = await getCategories();

  return (
    <AdminContainer
      breadcrumb={[
        { label: "Admin Paneli", href: "/admin" },
        { label: "Gönderiler", href: "/admin/posts" },
        { label: "Yeni Gönderi", href: "/admin/posts/new" },
      ]}
    >
      <div className="space-y-6">
        <H3>Yeni Gönderi</H3>
        <NewPostForm categories={categories} />
      </div>
    </AdminContainer>
  );
}
