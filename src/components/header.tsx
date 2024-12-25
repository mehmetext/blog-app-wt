import { currentUser, getCategories } from "@/actions";
import { cn } from "@/lib/utils";
import AdminToolbar from "./admin-toolbar";
import HeaderClient from "./header-client";

export default async function Header() {
  const categories = await getCategories();
  const user = await currentUser();

  return (
    <div
      className={cn("sticky z-10 top-0", {
        "-top-12": user?.role === "ADMIN",
      })}
    >
      {user?.role === "ADMIN" && <AdminToolbar user={user} />}
      <HeaderClient categories={categories} />
    </div>
  );
}
