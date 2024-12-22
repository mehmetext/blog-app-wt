import { getCategories } from "@/actions";
import HeaderClient from "./header-client";

export default async function Header() {
  const categories = await getCategories();
  return <HeaderClient categories={categories} />;
}
