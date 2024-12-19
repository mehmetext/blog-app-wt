import { getCategory } from "@/actions";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import PageContainer from "@/components/page-container";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;
  const category = await getCategory(categorySlug);
  return {
    title: `${category.name} - Blog App`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;
  const category = await getCategory(categorySlug);

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
    </PageContainer>
  );
}
