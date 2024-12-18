import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import PageContainer from "@/components/page-container";

export default function About() {
  return (
    <PageContainer>
      <BreadcrumbNav items={[{ label: "Hakkımızda", href: "/about" }]} />
      About
    </PageContainer>
  );
}
