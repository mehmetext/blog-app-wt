import { getCategories } from "@/actions";
import { cn } from "@/lib/utils";
import HeaderClient from "./header-client";

export default async function Header() {
  const categories = await getCategories();
  const isAdmin = false;

  return (
    <div className={cn("sticky z-10 top-0", { "-top-12": isAdmin })}>
      {/* {isAdmin && <AdminToolbar user={user} />} */}
      <HeaderClient categories={categories} />
    </div>
  );
}
