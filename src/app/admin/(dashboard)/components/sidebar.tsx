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
  Settings,
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
      label: "Gönderiler",
      action: (
        <SidebarGroupAction asChild>
          <Link href="/admin/posts/new">
            <Plus /> <span className="sr-only">Gönderi Ekle</span>
          </Link>
        </SidebarGroupAction>
      ),
      items: [
        { icon: FileText, label: "Tüm Gönderiler", href: "/admin/posts" },
      ],
    },
    {
      label: "Kategoriler",
      action: (
        <SidebarGroupAction>
          <Plus /> <span className="sr-only">Kategori Ekle</span>
        </SidebarGroupAction>
      ),
      items: [
        {
          icon: FolderTree,
          label: "Tüm Kategoriler",
          href: "/admin/categories",
        },
      ],
    },
    {
      label: "Kullanıcılar",
      items: [{ icon: Users, label: "Tüm Kullanıcılar", href: "/admin/users" }],
    },
    {
      label: "Yorumlar",
      items: [
        { icon: MessageSquare, label: "Tüm Yorumlar", href: "/admin/comments" },
      ],
    },
    {
      label: "Ayarlar",
      items: [
        { icon: Settings, label: "Site Ayarları", href: "/admin/settings" },
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
              <span>Siteyi Görüntüle</span>
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
                  <span>Çıkış Yap</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarUI>
  );
}
