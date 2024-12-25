import { getPosts } from "@/actions";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import PageContainer from "@/components/page-container";
import Posts from "@/components/posts";
import postsNuqs from "@/lib/nuqs/posts";
import { SearchParams } from "nuqs";
import { FeaturedPost } from "./components/featured-post";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page, q } = await postsNuqs.cache.parse(searchParams);
  const featuredPosts = await getPosts({ featured: true });
  const posts = await getPosts({ page, q });

  return (
    <PageContainer>
      <BreadcrumbNav />
      {featuredPosts.items.length > 0 && (
        <FeaturedPost post={featuredPosts.items[0]} />
      )}
      <Posts
        page={page}
        q={q}
        posts={posts.items}
        pageCount={posts.pageCount}
      />
    </PageContainer>
  );
}
