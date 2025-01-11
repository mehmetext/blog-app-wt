import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import PageContainer from "@/components/page-container";

export const dynamic = "force-dynamic";

export default function About() {
  return (
    <PageContainer>
      <BreadcrumbNav items={[{ label: "About", href: "/about" }]} />
      About
    </PageContainer>
  );
}
