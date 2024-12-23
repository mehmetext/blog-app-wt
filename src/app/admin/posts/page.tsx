import { getPosts } from "@/actions";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { H3 } from "@/components/ui/typography";
import homepageNuqs from "@/lib/nuqs/homepage";
import { Plus } from "lucide-react";
import Link from "next/link";
import { SearchParams } from "nuqs";
import AdminContainer from "../components/admin-container";
import postsColumns from "./posts-columns";

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page, q, category } = await homepageNuqs.cache.parse(searchParams);
  const posts = await getPosts({ page, q, category });

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
      <DataTable columns={postsColumns} data={posts.items} />
    </AdminContainer>
  );
}
