import { getPosts, updatePost } from "@/actions";
import { Button } from "@/components/ui/button";
import { H3 } from "@/components/ui/typography";
import postsNuqs from "@/lib/nuqs/posts";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SearchParams } from "nuqs";
import AdminContainer from "../components/admin-container";
import PostsDataTable from "./data-table";

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page, q, category, limit, sortBy, sortDesc } =
    await postsNuqs.cache.parse(searchParams);

  const posts = await getPosts({ page, q, category, limit, sortBy, sortDesc });

  return (
    <AdminContainer
      breadcrumb={[
        { label: "Admin Paneli", href: "/admin" },
        { label: "Gönderiler", href: "/admin/posts" },
      ]}
    >
      <div className="flex justify-between items-center">
        <H3>Gönderiler</H3>
        <Button asChild>
          <Link href="/admin/posts/new">
            <Plus className="w-4 h-4 mr-2" />
            Yeni Gönderi
          </Link>
        </Button>
      </div>
      <PostsDataTable
        posts={posts}
        page={page}
        limit={limit}
        onPaginationChange={async (pageIndex, pageSize) => {
          "use server";
          redirect(
            `/admin/posts${postsNuqs.serializer({
              page: pageIndex + 1,
              limit: pageSize as 10 | 20 | 30 | 40 | 50,
              q,
              category,
              sortBy,
              sortDesc,
            })}`
          );
        }}
        sorting={[{ id: sortBy, desc: sortDesc }]}
        onSortingChange={async (sorting) => {
          "use server";
          redirect(
            `/admin/posts${postsNuqs.serializer({
              sortBy: sorting[0]?.id,
              sortDesc: sorting[0]?.desc,
              page,
              limit,
              q,
              category,
            })}`
          );
        }}
        onFeaturedChange={async (id, isFeatured) => {
          "use server";
          await updatePost(id, { isFeatured });
          redirect(
            `/admin/posts${postsNuqs.serializer({
              sortBy,
              sortDesc,
              page,
              limit,
              q,
              category,
            })}`
          );
        }}
      />
    </AdminContainer>
  );
}
