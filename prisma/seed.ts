import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean the database
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const adminUser = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      role: "ADMIN",
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      name: "Regular User",
      email: "user@example.com",
      role: "USER",
    },
  });

  // Create categories
  const webDevCategory = await prisma.category.create({
    data: {
      name: "Web Development",
      slug: "web-development",
    },
  });

  const mobileDevCategory = await prisma.category.create({
    data: {
      name: "Mobile Development",
      slug: "mobile-development",
    },
  });

  // Create posts
  const nextJsPost = await prisma.post.create({
    data: {
      title: "Getting Started with Next.js",
      content: `
# Getting Started with Next.js

Next.js is a powerful React framework that makes building full-stack web applications simple and efficient.

## Key Features

- Server-Side Rendering
- Static Site Generation
- API Routes
- File-based Routing

## Getting Started

First, create a new Next.js project:

\`\`\`bash
npx create-next-app@latest my-app
\`\`\`
      `,
      slug: "getting-started-with-nextjs",
      coverImage:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
      authorId: adminUser.id,
      categoryId: webDevCategory.id,
    },
  });

  const reactNativePost = await prisma.post.create({
    data: {
      title: "React Native Fundamentals",
      content: `
# React Native Fundamentals

Learn how to build mobile applications using React Native.

## Why React Native?

- Cross-platform development
- Native performance
- Large community
- Code reusability

## Setting Up Your Environment

Follow these steps to set up your development environment...
      `,
      slug: "react-native-fundamentals",
      coverImage: "https://images.unsplash.com/photo-1556656793-08538906a9f8",
      authorId: regularUser.id,
      categoryId: mobileDevCategory.id,
    },
  });

  // Create comments
  await prisma.comment.createMany({
    data: [
      {
        content:
          "Great introduction to Next.js! The server-side rendering explanation was particularly helpful.",
        postId: nextJsPost.id,
        authorName: "John Doe",
      },
      {
        content:
          "This helped me understand React Native's core concepts. The environment setup guide was clear.",
        postId: reactNativePost.id,
        authorName: "Jane Smith",
      },
      {
        content:
          "The code examples were very practical. Would love to see more advanced Next.js topics!",
        postId: nextJsPost.id,
        authorName: "Developer123",
      },
      {
        content: "Great explanation of cross-platform development benefits!",
        postId: reactNativePost.id,
        authorName: "Mobile Dev",
      },
      {
        content: "The file-based routing section was eye-opening. Thanks!",
        postId: nextJsPost.id,
        authorName: "WebDev Enthusiast",
      },
    ],
  });

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
