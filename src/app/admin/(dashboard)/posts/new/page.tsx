import { getCategories } from "@/actions";
import { H3 } from "@/components/ui/typography";
import AdminContainer from "../../components/admin-container";
import PostForm from "../components/post-form";

export default async function NewPostPage() {
  const categories = await getCategories();

  return (
    <AdminContainer
      breadcrumb={[
        { label: "Admin Panel", href: "/admin" },
        { label: "Posts", href: "/admin/posts" },
        { label: "New Post", href: "/admin/posts/new" },
      ]}
    >
      <div className="space-y-6">
        <H3>New Post</H3>
        <PostForm categories={categories} />
      </div>
    </AdminContainer>
  );
}
