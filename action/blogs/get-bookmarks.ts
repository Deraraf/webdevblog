"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export const getBookmarks = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  const skip = (page - 1) * limit;
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) return { error: "No user found" };

  try {
    const bookmarks = await db.bookmark.findMany({
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
        blog: {
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
              select: {
                id: true,
              },
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
        },
      },
    });

    const blogs = bookmarks
      .filter((bookmark) => bookmark.blog !== null)
      .map((bookmark) => bookmark.blog);

    const totalBookmarks = await db.bookmark.count({
      where: {
        userId,
      },
    });
    const hasMoreBlogs = totalBookmarks > page * limit;

    return {
      success: {
        blogs,
        hasMoreBlogs,
      },
    };
  } catch (error) {
    console.log(error);
    return { error: "Error fetching bookmarks" };
  }
};
