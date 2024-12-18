import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import PageContainer from "@/components/page-container";

export default function Home() {
  return (
    <PageContainer>
      <BreadcrumbNav />
      <h1>Home Page</h1>
    </PageContainer>
  );
}
