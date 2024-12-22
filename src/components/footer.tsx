import { getCategories } from "@/actions";
import FooterClient from "./footer-client";

export default async function Footer() {
  const categories = await getCategories();
  return <FooterClient categories={categories} />;
}
