"use client";

import { logout } from "@/actions";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Sidebar as SidebarUI,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";
import {
  ChevronUp,
  FileText,
  FolderTree,
  Home,
  MessageSquare,
  Plus,
  User2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarMenuGroup {
  label: string;
  action?: React.ReactNode;
  items: { icon: React.ComponentType; label: string; href: string }[];
}

export default function Sidebar({ user }: { user: User }) {
  const pathname = usePathname();

  const menuGroups: SidebarMenuGroup[] = [
    {
      label: "Posts",
      action: (
        <SidebarGroupAction asChild>
          <Link href="/admin/posts/new">
            <Plus /> <span className="sr-only">Add Post</span>
          </Link>
        </SidebarGroupAction>
      ),
      items: [{ icon: FileText, label: "All Posts", href: "/admin/posts" }],
    },
    {
      label: "All Categories",
      items: [
        {
          icon: FolderTree,
          label: "All Categories",
          href: "/admin/categories",
        },
      ],
    },
    {
      label: "Users",
      items: [{ icon: Users, label: "All Users", href: "/admin/users" }],
    },
    {
      label: "Comments",
      items: [
        { icon: MessageSquare, label: "All Comments", href: "/admin/comments" },
      ],
    },
  ];

  return (
    <SidebarUI>
      <SidebarHeader className="h-16 flex items-center justify-center">
        <Link href="/admin" className="text-xl font-bold">
          Blog App
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <Link
              href="/"
              target="_blank"
              className={cn(buttonVariants({ size: "sm" }), "w-full")}
            >
              <Home />
              <span>View Site</span>
            </Link>
          </SidebarGroupContent>
        </SidebarGroup>
        {menuGroups.map((group, i) => (
          <SidebarGroup key={i}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            {group.action}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item, i) => (
                  <SidebarMenuItem key={i}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {user.name}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem onClick={logout}>
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarUI>
  );
}
