"use client";

import { Category, Post } from "@prisma/client";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

interface CategoryDistributionProps {
  categories: Category[];
  posts: Post[];
}

export function CategoryDistribution({
  categories,
  posts,
}: CategoryDistributionProps) {
  const data = categories.map((category) => ({
    name: category.name,
    value: posts.filter((post) => post.categoryId === category.id).length,
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart width={500} height={300} data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
