import { getPost, getPosts } from "@/actions";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import PageContainer from "@/components/page-container";
import homepageNuqs from "@/lib/nuqs/homepage";
import { SearchParams } from "nuqs";
import { FeaturedPost } from "./components/featured-post";
import Posts from "./components/posts";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page, q } = await homepageNuqs.cache.parse(searchParams);
  const featuredPost = await getPost("sample-post-10");
  const posts = await getPosts({ page, q });

  console.log(posts);

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
