"use server";

import prisma from "@/lib/prisma";
import { generateTokens } from "@/lib/utils";
import { Comment, CommentStatus, Post, Prisma } from "@prisma/client";
import { compare } from "bcrypt";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import slugify from "slugify";

export const getPosts = async ({
  page = 1,
  q,
  category,
  limit = 10,
  sortBy,
  sortDesc,
  featured,
}: {
  page?: number;
  q?: string;
  category?: string | null;
  limit?: number;
  sortBy?: string;
  sortDesc?: boolean;
  featured?: boolean;
}) => {
  const orderBy: Prisma.PostOrderByWithRelationInput = {};

  if (sortBy) {
    switch (sortBy) {
      case "comments":
        break;
      case "author":
        orderBy.author = {
          name: sortDesc ? "desc" : "asc",
        };
        break;
      case "category":
        orderBy.category = {
          name: sortDesc ? "desc" : "asc",
        };
        break;
      default:
        orderBy[sortBy as keyof Post] = sortDesc ? "desc" : "asc";
        break;
    }
  }

  const [posts, total] = await prisma.$transaction([
    prisma.post.findMany({
      include: {
        category: true,
        author: true,
        comments: {
          where: {
            deletedAt: null,
            status: "APPROVED",
          },
        },
      },
      orderBy,
      take: limit,
      skip: (page - 1) * limit,
      where: {
        // Only show posts that are not deleted
        deletedAt: null,
        // Only show posts that are in the category
        ...(category
          ? {
              category: {
                slug: category,
              },
            }
          : {}),
        // Search for posts that contain the query in the title or content
        ...(q
          ? {
              OR: [
                {
                  title: {
                    contains: q,
                    mode: "insensitive",
                  },
                },
                {
                  content: {
                    contains: q,
                    mode: "insensitive",
                  },
                },
                {
                  comments: {
                    some: {
                      content: { contains: q, mode: "insensitive" },
                      deletedAt: null,
                      status: "APPROVED",
                    },
                  },
                },
              ],
            }
          : {}),
        // Show featured posts filtered by featured
        ...(featured ? { isFeatured: featured } : {}),
      },
    }),
    prisma.post.count({
      where: {
        deletedAt: null,
        ...(category
          ? {
              category: {
                slug: category,
              },
            }
          : {}),
        ...(q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { content: { contains: q, mode: "insensitive" } },
                {
                  comments: {
                    some: {
                      content: { contains: q, mode: "insensitive" },
                      deletedAt: null,
                      status: "APPROVED",
                    },
                  },
                },
              ],
            }
          : {}),
        ...(featured ? { isFeatured: featured } : {}),
      },
    }),
  ]);

  if (sortBy === "comments") {
    posts.sort((a, b) => b.comments.length - a.comments.length);
    if (sortDesc) posts.reverse();
  }

  return {
    items: posts,
    limit,
    pageCount: Math.ceil(total / limit),
  };
};

export const getPost = async (slug: string) => {
  const post = await prisma.post.findUnique({
    include: {
      category: true,
      author: true,
      comments: {
        where: {
          deletedAt: null,
          status: "APPROVED",
        },
      },
    },
    where: {
      slug: slug,
      deletedAt: null,
    },
  });

  return post;
};

export const updatePost = async (slug: string, data: Partial<Post>) => {
  if (data.isFeatured) {
    await prisma.post.updateMany({
      where: { isFeatured: true },
      data: { isFeatured: false },
    });
  }

  const post = await prisma.post.update({
    where: { slug },
    data: {
      ...data,
    },
  });

  return post;
};

export const getCategories = async () => {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { posts: true } },
    },
    where: {
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return categories;
};

export const getCategory = async (slug: string) => {
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  return category;
};

export const createComment = async ({
  content,
  authorName,
  postId,
}: {
  content: string;
  authorName: string;
  postId: string;
}) => {
  const newComment = await prisma.comment.create({
    data: {
      content,
      authorName,
      postId,
    },
  });

  return newComment;
};

export const login = async (email: string, password: string) => {
  const cookieList = await cookies();
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { status: false, code: "invalid-credentials" };
  }

  const isPasswordValid = await compare(password, user.hashedPassword);

  if (!isPasswordValid) {
    return { status: false, code: "invalid-credentials" };
  }

  const { accessToken, refreshToken } = await generateTokens(user.id);

  cookieList.set({
    name: "access-token",
    value: accessToken,
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 5, // 5 minutes
  });

  cookieList.set({
    name: "refresh-token",
    value: refreshToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60, // 1 hour
  });

  return { status: true, code: "login-success" };
};

export const refreshTokens = async () => {
  const cookieList = await cookies();
  const refreshToken = cookieList.get("refresh-token")?.value;

  if (!refreshToken) {
    return false;
  }

  const { payload } = await jwtVerify(
    refreshToken,
    new TextEncoder().encode(process.env.JWT_REFRESH_SECRET)
  );

  const user = await prisma?.user.findUnique({
    where: { id: payload.sub! },
  });

  if (!user) {
    return false;
  }

  const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    await generateTokens(user.id);

  cookieList.set({
    name: "access-token",
    value: newAccessToken,
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 5, // 5 minutes
  });

  cookieList.set({
    name: "refresh-token",
    value: newRefreshToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60, // 1 hour
  });

  return true;
};

export const logout = async () => {
  const cookieList = await cookies();
  cookieList.delete("access-token");
  cookieList.delete("refresh-token");

  return { status: true, code: "logout-success" };
};

export const currentUser = async () => {
  const cookieList = await cookies();

  const accessToken = cookieList.get("access-token")?.value;

  if (!accessToken) {
    return null;
  }

  const { payload } = await jwtVerify(
    accessToken,
    new TextEncoder().encode(process.env.JWT_SECRET)
  );

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
  });

  return user;
};

export const getUsers = async () => {
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          Post: {
            where: {
              deletedAt: null,
            },
          },
        },
      },
    },
    where: {
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
};

export const getComments = async ({
  page = 1,
  q,
  limit = 10,
  sortBy,
  sortDesc,
}: {
  page?: number;
  q?: string;
  limit?: number;
  sortBy?: string;
  sortDesc?: boolean;
}) => {
  const orderBy: Prisma.CommentOrderByWithRelationInput = {};

  if (sortBy) {
    switch (sortBy) {
      case "postTitle":
        orderBy.post = {
          title: sortDesc ? "desc" : "asc",
        };
        break;
      default:
        orderBy[sortBy as keyof Comment] = sortDesc ? "desc" : "asc";
        break;
    }
  }

  const [comments, total] = await prisma.$transaction([
    prisma.comment.findMany({
      include: {
        post: {
          include: {
            category: true,
          },
        },
      },
      orderBy,
      take: limit,
      skip: (page - 1) * limit,
      where: {
        // Only show posts that are not deleted
        deletedAt: null,
        ...(q
          ? {
              OR: [
                {
                  content: {
                    contains: q,
                    mode: "insensitive",
                  },
                },
                {
                  authorName: {
                    contains: q,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),
      },
    }),
    prisma.comment.count({
      where: {
        deletedAt: null,
        ...(q
          ? {
              OR: [
                {
                  content: {
                    contains: q,
                    mode: "insensitive",
                  },
                },
                {
                  authorName: {
                    contains: q,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),
      },
    }),
  ]);

  return {
    items: comments,
    limit,
    pageCount: Math.ceil(total / limit),
  };
};

export const updateCommentStatus = async (
  id: string | string[],
  status: CommentStatus
) => {
  if (Array.isArray(id)) {
    const updatedComments = await prisma.comment.updateMany({
      where: { id: { in: id } },
      data: { status },
    });

    return updatedComments.count;
  } else {
    await prisma.comment.update({
      where: { id },
      data: { status },
    });

    return 1;
  }
};

export const createPost = async ({
  title,
  content,
  categoryId,
  coverImage,
}: {
  title: string;
  content: string;
  categoryId: string;
  coverImage: string;
}) => {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const slug = slugify(title, { lower: true, strict: true });

  const existingPost = await prisma.post.findUnique({
    where: { slug },
  });

  if (existingPost) {
    throw new Error("Bu başlıkta bir gönderi zaten mevcut");
  }

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      content,
      coverImage,
      categoryId,
      authorId: user.id,
    },
  });

  return post;
};
