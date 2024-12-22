interface NavRoute {
  label: string;
  href?: string;
  subRoutes?: { label: string; href: string }[];
}
