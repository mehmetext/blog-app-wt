import Footer from "@/components/footer";
import Header from "@/components/header";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col gap-y-10 min-h-screen">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
