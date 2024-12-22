import { PrismaClient } from "@prisma/client";
import { sub } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  // Clean the database
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      name: "Admin User",
      role: "ADMIN",
    },
  });

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Technology",
        slug: "technology",
      },
    }),
    prisma.category.create({
      data: {
        name: "Travel",
        slug: "travel",
      },
    }),
    prisma.category.create({
      data: {
        name: "Lifestyle",
        slug: "lifestyle",
      },
    }),
  ]);

  // Helper function to generate random past dates
  const randomPastDate = (maxDaysAgo: number) => {
    const daysAgo = Math.floor(Math.random() * maxDaysAgo);
    return sub(new Date(), { days: daysAgo });
  };

  // Create 30 posts
  const posts = [];
  for (let i = 1; i <= 30; i++) {
    const createdAt = randomPastDate(365); // Random date within the last year
    const category = categories[Math.floor(Math.random() * categories.length)];

    const post = await prisma.post.create({
      data: {
        title: `Sample Post ${i}`,
        slug: `sample-post-${i}`,
        content: `This is the content for sample post ${i}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

## Heading 2

- List item 1
- List item 2
- List item 3

### Code Example

\`\`\`javascript
console.log("Hello World!");
\`\`\`

More detailed content goes here...`,
        coverImage: `https://picsum.photos/seed/${i}/1200/630`, // Random image for each post
        categoryId: category.id,
        authorId: admin.id,
        createdAt,
        updatedAt: createdAt,
      },
    });

    // Add 1-3 comments for each post
    const numComments = Math.floor(Math.random() * 3) + 1;
    for (let j = 1; j <= numComments; j++) {
      await prisma.comment.create({
        data: {
          content: `This is comment ${j} on post ${i}. Great article!`,
          authorName: `Commenter ${j}`,
          postId: post.id,
          createdAt: sub(createdAt, { hours: Math.random() * 24 }), // Comments are slightly newer than posts
        },
      });
    }

    posts.push(post);
  }

  console.log(`Database has been seeded. 🌱`);
  console.log(`Created ${categories.length} categories`);
  console.log(`Created ${posts.length} posts`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
