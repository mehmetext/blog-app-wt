"use client";

import { logout } from "@/actions";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";
import { LogOut, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "./ui/button";
import { Small } from "./ui/typography";

export default function AdminToolbar({ user }: { user: User }) {
  const router = useRouter();
  return (
    <div className="bg-secondary text-secondary-foreground h-12 flex items-center">
      <div className="container flex items-center gap-2">
        <Small>Welcome, {user.name}:</Small>
        <Link
          href="/admin"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "hidden sm:flex"
          )}
        >
          <ShieldAlert />
          Admin Panel
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
          onClick={async () => {
            await logout();
            router.refresh();
          }}
        >
          <LogOut />
          Logout
        </Button>
        <Button
          onClick={async () => {
            await logout();
            router.refresh();
          }}
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
