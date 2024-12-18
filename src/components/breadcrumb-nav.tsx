"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbNavProps {
  items?: BreadcrumbItem[];
}

export function BreadcrumbNav({ items = [] }: BreadcrumbNavProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          {isHome ? (
            <BreadcrumbPage className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span>Ana Sayfa</span>
            </BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span>Ana Sayfa</span>
              </Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>

        {items.length > 0 && <BreadcrumbSeparator />}

        {items.map((item, index) => (
          <BreadcrumbItem key={item.href}>
            {index === items.length - 1 ? (
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link href={item.href}>{item.label}</Link>
              </BreadcrumbLink>
            )}
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
