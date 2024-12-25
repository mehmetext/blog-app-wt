import { getCategories } from "@/actions";
import { cn } from "@/lib/utils";
import { LogOut, ShieldAlert } from "lucide-react";
import Link from "next/link";
import HeaderClient from "./header-client";
import { Button, buttonVariants } from "./ui/button";
import { Small } from "./ui/typography";

export default async function Header() {
  const categories = await getCategories();
  const isAdmin = true;

  return (
    <>
      {isAdmin && (
        <div className="bg-secondary text-secondary-foreground p-2">
          <div className="container flex items-center gap-2">
            <Small>Hoş geldin, Admin:</Small>
            <Link
              href="/admin"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "hidden sm:flex"
              )}
            >
              <ShieldAlert />
              Admin Paneli
            </Link>
            <Link
              href="/admin"
              className={cn(
                buttonVariants({ variant: "outline", size: "icon" }),
                "flex sm:hidden"
              )}
            >
              <ShieldAlert />
            </Link>
            <Button
              className="ml-auto hidden sm:flex"
              variant="destructive"
              size="sm"
            >
              <LogOut />
              Çıkış Yap
            </Button>
            <Button
              className="ml-auto flex sm:hidden"
              variant="destructive"
              size="icon"
            >
              <LogOut />
            </Button>
          </div>
        </div>
      )}
      <HeaderClient categories={categories} />
    </>
  );
}
