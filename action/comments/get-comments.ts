"use server";

import { db } from "@/lib/db";
import { getBlogById } from "../blogs/getBlogById";

const getComments = async ({
  blogId,
  userId,
  parentId,
}: {
  blogId: string;
  userId?: string;
  parentId: string | null;
}) => {
  const blog = await getBlogById({ blogId });
  if (!blog) return { error: "Blog not found" };

  try {
    const comments = await db.comment.findMany({
      orderBy: {
        createdAt: parentId ? "asc" : "desc",
      },
      where: {
        blogId,
        parentId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        replyToUser: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            replies: true,
            claps: true,
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
      },
    });

    return { success: { comments } };
  } catch (error) {
    console.log("Error fetching comments:", error);
    return { error: "Failed to fetch comments" };
  }
};

export default getComments;
