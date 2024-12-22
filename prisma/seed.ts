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
  await prisma.post.create({
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

  await prisma.post.create({
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
        content: "Great introduction to Next.js!",
        postId: "1",
        authorName: "John Doe",
      },
      {
        content: "This helped me get started with React Native.",
        postId: "2",
        authorName: "Jane Smith",
      },
      {
        content: "Looking forward to more tutorials!",
        postId: "1",
        authorName: "Developer123",
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
