import { getCategory, getPosts } from "@/actions";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import PageContainer from "@/components/page-container";
import Posts from "@/components/posts";
import homepageNuqs from "@/lib/nuqs/homepage";
import { notFound } from "next/navigation";
import { SearchParams } from "nuqs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;
  const category = await getCategory(categorySlug);

  if (!category) {
    return notFound();
  }

  return {
    title: `${category.name} - Blog App`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { categorySlug } = await params;
  const { page, q } = await homepageNuqs.cache.parse(searchParams);
  const category = await getCategory(categorySlug);
  const posts = await getPosts({ page, q, category: categorySlug });

  if (!category) {
    return notFound();
  }

  return (
    <PageContainer>
      <BreadcrumbNav
        items={[
          {
            label: category.name,
            href: `/${category.slug}`,
          },
        ]}
      />
      <Posts
        category={category}
        page={page}
        q={q}
        posts={posts.items}
        pageCount={posts.pageCount}
      />
    </PageContainer>
  );
}
