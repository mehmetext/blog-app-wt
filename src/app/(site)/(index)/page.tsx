import { getPost, getPosts } from "@/actions";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import PageContainer from "@/components/page-container";
import Posts from "@/components/posts";
import postsNuqs from "@/lib/nuqs/posts";
import { SearchParams } from "nuqs";
import { FeaturedPost } from "./components/featured-post";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page, q } = await postsNuqs.cache.parse(searchParams);
  const featuredPost = await getPost("zaman-yonetimi-stratejileri-10");
  const posts = await getPosts({ page, q });

  return (
    <PageContainer>
      <BreadcrumbNav />
      {featuredPost && <FeaturedPost post={featuredPost} />}
      <Posts
        page={page}
        q={q}
        posts={posts.items}
        pageCount={posts.pageCount}
      />
    </PageContainer>
  );
}
