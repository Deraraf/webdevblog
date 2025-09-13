"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export const getBlogById = async ({ blogId }: { blogId: string }) => {
  if (!blogId) return { error: "No BlogId" };

  const session = await auth();
  const userId = session?.user.id;

  try {
    const blog = await db.blog.findUnique({
      where: {
        id: blogId,
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
            userId: userId,
          },
          select: { id: true },
        },
        bookmarks: {
          where: {
            userId: userId,
          },
          select: {
            id: true,
          },
        },
      },
    });

    return { success: { blog } };
  } catch (error) {
    console.error("Error fetching blog by ID:", error);
    return { error: "Failed to fetch blog" };
  }
};
