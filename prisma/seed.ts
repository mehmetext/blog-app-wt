import { PrismaClient } from "@prisma/client";
import { sub } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  // Clean the database
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "admin@example.com",
        name: "Admin User",
        role: "ADMIN",
      },
    }),
    prisma.user.create({
      data: {
        email: "john@example.com",
        name: "John Doe",
        role: "USER",
      },
    }),
    prisma.user.create({
      data: {
        email: "jane@example.com",
        name: "Jane Smith",
        role: "USER",
      },
    }),
  ]);

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
        name: "Food & Cooking",
        slug: "food-cooking",
      },
    }),
    prisma.category.create({
      data: {
        name: "Health & Wellness",
        slug: "health-wellness",
      },
    }),
    prisma.category.create({
      data: {
        name: "Personal Development",
        slug: "personal-development",
      },
    }),
    prisma.category.create({
      data: {
        name: "Science",
        slug: "science",
      },
    }),
  ]);

  // Helper function to generate random past dates
  const randomPastDate = (maxDaysAgo: number) => {
    const daysAgo = Math.floor(Math.random() * maxDaysAgo);
    return sub(new Date(), { days: daysAgo });
  };

  // Sample post titles and content templates
  const postTemplates = [
    {
      tech: [
        "The Future of AI: What to Expect in 2024",
        "Understanding WebAssembly: A Deep Dive",
        "Building Scalable Applications with Next.js",
        "Rust vs Go: A Performance Comparison",
        "Introduction to Quantum Computing",
      ],
      travel: [
        "Hidden Gems of Southeast Asia",
        "A Week in the Swiss Alps",
        "Budget Travel Guide: Europe Edition",
        "Best Street Food Markets in Asia",
        "Adventure Travel: Patagonia Explorer",
      ],
      food: [
        "Traditional Italian Pasta Recipes",
        "Vegan Baking Essentials",
        "Asian Fusion Cooking Guide",
        "Seasonal Cooking: Spring Edition",
        "Mastering French Pastries",
      ],
      health: [
        "Mindfulness Meditation Guide",
        "Plant-Based Diet Benefits",
        "Home Workout Routines",
        "Sleep Optimization Tips",
        "Stress Management Techniques",
      ],
      development: [
        "Building Better Habits",
        "Time Management Strategies",
        "Public Speaking Mastery",
        "Financial Planning 101",
        "Effective Goal Setting",
      ],
      science: [
        "Latest Discoveries in Astronomy",
        "Understanding Climate Change",
        "Breakthroughs in Genetics",
        "The Science of Sleep",
        "Neuroscience Basics",
      ],
    },
  ];

  // Create 50 posts
  const posts = [];
  for (let i = 1; i <= 50; i++) {
    const createdAt = randomPastDate(365); // Random date within the last year
    const category = categories[Math.floor(Math.random() * categories.length)];
    const author = users[Math.floor(Math.random() * users.length)];

    // Select a random title based on category
    let titles;
    switch (category.slug) {
      case "technology":
        titles = postTemplates[0].tech;
        break;
      case "travel":
        titles = postTemplates[0].travel;
        break;
      case "food-cooking":
        titles = postTemplates[0].food;
        break;
      case "health-wellness":
        titles = postTemplates[0].health;
        break;
      case "personal-development":
        titles = postTemplates[0].development;
        break;
      case "science":
        titles = postTemplates[0].science;
        break;
      default:
        titles = postTemplates[0].tech;
    }

    const title = `${titles[Math.floor(Math.random() * titles.length)]} ${i}`;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content: `# ${title}

${
  category.slug === "technology"
    ? `
As technology continues to evolve at an unprecedented pace, we're seeing remarkable innovations across various domains. This post explores the latest developments and their implications for the future.

## Key Points

- Understanding the fundamentals
- Practical applications
- Future implications
- Best practices and guidelines

### Technical Details

\`\`\`javascript
// Example code implementation
const implement = async (data) => {
  const result = await processData(data);
  return optimize(result);
};
\`\`\`

## Real-world Applications

1. Enterprise solutions
2. Consumer applications
3. Research and development
4. Educational purposes

`
    : `
## Introduction

This comprehensive guide will walk you through everything you need to know about ${title.toLowerCase()}. We'll cover the essentials, advanced techniques, and practical tips you can apply immediately.

### Key Takeaways

1. Fundamental concepts
2. Practical applications
3. Expert tips and tricks
4. Common mistakes to avoid

## Detailed Analysis

Let's dive deeper into each aspect and understand how you can make the most of this knowledge in your daily life.

### Best Practices

- Start with the basics
- Practice regularly
- Learn from experts
- Stay updated with latest trends

`
}

## Conclusion

This post has covered the essential aspects of ${title.toLowerCase()}. We hope you found this information valuable and applicable to your needs.

For more information, check out our related posts or leave a comment below.`,
        coverImage: `https://picsum.photos/seed/${i}/1200/630`,
        categoryId: category.id,
        authorId: author.id,
        createdAt,
        updatedAt: createdAt,
      },
    });

    // Add 2-5 comments for each post
    const numComments = Math.floor(Math.random() * 4) + 2;
    const commentTemplates = [
      "Great article! I especially liked the part about",
      "This was really helpful. I've been looking for information about",
      "Interesting perspective on",
      "Thanks for sharing! I learned a lot about",
      "Well-written and informative piece about",
      "I've been following this topic for a while, and this adds great insight into",
      "The examples really helped me understand",
      "Looking forward to more content about",
    ];

    for (let j = 1; j <= numComments; j++) {
      const commentTemplate =
        commentTemplates[Math.floor(Math.random() * commentTemplates.length)];
      await prisma.comment.create({
        data: {
          content: `${commentTemplate} ${title.toLowerCase()}. ${
            j === 1
              ? "Looking forward to more content!"
              : j === 2
              ? "Would love to see a follow-up post."
              : "Thanks for sharing!"
          }`,
          authorName: `Reader ${Math.floor(Math.random() * 100) + 1}`,
          postId: post.id,
          createdAt: sub(createdAt, { hours: Math.random() * 24 * 7 }), // Comments within a week of post
        },
      });
    }

    posts.push(post);
  }

  console.log(`Database has been seeded. 🌱`);
  console.log(`Created ${users.length} users`);
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
