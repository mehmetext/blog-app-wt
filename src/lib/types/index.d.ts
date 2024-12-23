interface NavRoute {
  label: string;
  href?: string;
  subRoutes?: { label: string; href: string }[];
}

interface PaginatedResponse<T> {
  items: T[];
  limit: number;
  pageCount: number;
}
