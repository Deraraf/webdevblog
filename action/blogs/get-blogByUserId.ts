"use server";

import { db } from "@/lib/db";

export async function getBlogByUserId({
  page = 1,
  limit = 5,
  userId,
}: {
  page: number;
  limit: number;
  userId: string;
}) {
  const skip = (page - 1) * limit;

  try {
    const blogs = await db.blog.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            claps: true,
            comments: true,
          },
        },
        claps: {
          where: {
            userId,
          },
          select: { id: true },
        },
        bookmarks: {
          where: {
            userId,
          },
          select: {
            id: true,
          },
        },
      },
    });

    const totalBlogsCount = await db.blog.count({
      where: {
        userId,
      },
    });

    const hasMoreBlogs = totalBlogsCount > page * limit;
    return {
      success: { blogs, hasMoreBlogs },
    };
  } catch (error) {
    console.error("Error fetching published blogs:", error);
    return { error: "Failed to fetch blogs" };
  }
}
