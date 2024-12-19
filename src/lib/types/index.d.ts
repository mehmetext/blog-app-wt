interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

interface Category {
  id: string;
  name: string;
  slug: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  coverImage: string;

  authorId: string;
  categoryId: string;
  category: Pick<Category, "id" | "name" | "slug">;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

interface Comment {
  id: string;
  content: string;
  postId: string;
  authorName: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

interface NavRoute {
  label: string;
  href?: string;
  subRoutes?: { label: string; href: string }[];
}
