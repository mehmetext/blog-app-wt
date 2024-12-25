import { LogOut } from "lucide-react";

import { Button } from "./ui/button";

import { User } from "@prisma/client";
import { Small } from "./ui/typography";

import { cn } from "@/lib/utils";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

export default function AdminToolbar({ user }: { user: User }) {
  return (
    <div className="bg-secondary text-secondary-foreground h-12 flex items-center">
      <div className="container flex items-center gap-2">
        <Small>Hoş geldin, {user.name}:</Small>
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
  );
}
