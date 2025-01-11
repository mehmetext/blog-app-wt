"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import { ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function HeaderClient({
  categories,
}: {
  categories: Category[];
}) {
  const routes = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    {
      label: "Categories",
      subRoutes: categories.map((category) => ({
        href: `/${category.slug}`,
        label: category.name,
      })),
    },
  ];
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-border/30 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Blog App
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {routes.map((route, i) => (
            <React.Fragment key={i}>
              {route.href && !route.subRoutes ? (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === route.href
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {route.label}
                </Link>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary",
                      pathname === route.href
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {route.label} <ChevronDown className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {route.subRoutes?.map((subRoute) => (
                      <DropdownMenuItem
                        key={subRoute.href}
                        asChild
                        className="cursor-pointer"
                      >
                        <Link
                          href={subRoute.href}
                          className={cn(
                            "text-sm font-medium transition-colors hover:text-primary",
                            pathname === subRoute.href
                              ? "text-foreground bg-accent"
                              : "text-muted-foreground"
                          )}
                        >
                          {subRoute.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <ModeToggle />

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container py-4 flex flex-col space-y-4">
            {routes.map((route, i) => (
              <React.Fragment key={i}>
                {route.href && !route.subRoutes ? (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary px-2 py-1 rounded-md",
                      pathname === route.href
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {route.label}
                  </Link>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className={cn(
                        "flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary px-2 py-1",
                        pathname === route.href
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {route.label} <ChevronDown className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                      {route.subRoutes?.map((subRoute) => (
                        <DropdownMenuItem
                          key={subRoute.href}
                          asChild
                          className="cursor-pointer"
                        >
                          <Link
                            href={subRoute.href}
                            className={cn(
                              "text-sm font-medium transition-colors hover:text-primary",
                              pathname === subRoute.href
                                ? "text-foreground bg-accent"
                                : "text-muted-foreground"
                            )}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {subRoute.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
