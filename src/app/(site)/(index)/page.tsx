import { getPosts } from "@/actions";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import PageContainer from "@/components/page-container";
import homepageNuqs from "@/lib/nuqs/homepage";
import { SearchParams } from "nuqs";
import Posts from "./components/posts";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page, q } = await homepageNuqs.cache.parse(searchParams);
  const posts = await getPosts();

  return (
    <PageContainer>
      <BreadcrumbNav />
      <Posts page={page} q={q} posts={posts} />
    </PageContainer>
  );
}
