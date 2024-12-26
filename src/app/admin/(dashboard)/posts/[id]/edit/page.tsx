import { getCategories, getPostById } from "@/actions";
import { H3 } from "@/components/ui/typography";
import { notFound } from "next/navigation";
import AdminContainer from "../../../components/admin-container";
import PostForm from "../../components/post-form";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, categories] = await Promise.all([
    getPostById(id),
    getCategories(),
  ]);

  if (!post) {
    return notFound();
  }

  return (
    <AdminContainer
      breadcrumb={[
        { label: "Admin Paneli", href: "/admin" },
        { label: "Gönderiler", href: "/admin/posts" },
        { label: "Gönderi Düzenle", href: `/admin/posts/${id}/edit` },
      ]}
    >
      <div className="space-y-6">
        <H3>Gönderi Düzenle</H3>
        <PostForm categories={categories} post={post} />
      </div>
    </AdminContainer>
  );
}
