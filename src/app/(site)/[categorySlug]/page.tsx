import { getCategory } from "@/actions";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import PageContainer from "@/components/page-container";
import { notFound } from "next/navigation";

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
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;
  const category = await getCategory(categorySlug);

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
    </PageContainer>
  );
}
