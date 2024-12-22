import { getPost, getPosts } from "@/actions";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import PageContainer from "@/components/page-container";
import Posts from "@/components/posts";
import homepageNuqs from "@/lib/nuqs/homepage";
import { SearchParams } from "nuqs";
import { FeaturedPost } from "./components/featured-post";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page, q } = await homepageNuqs.cache.parse(searchParams);
  const featuredPost = await getPost("asian-fusion-cooking-guide-10");
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
