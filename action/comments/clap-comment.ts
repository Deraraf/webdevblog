"use server";

import { db } from "@/lib/db";
import { getUserById } from "@/lib/user";

export const clapComment = async (commentId: string, userId: string) => {
  const comment = await db.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  if (!comment) return "Comment not found";

  const user = await getUserById(userId);

  if (!user) return "User not found";

  const commentClap = await db.commentClap.findUnique({
    where: {
      userId_commentId: { userId, commentId },
    },
  });

  if (commentClap) {
    await db.commentClap.delete({
      where: {
        id: commentClap.id,
      },
    });
    return { success: "unClapped" };
  } else {
    await db.commentClap.create({
      data: {
        userId,
        commentId,
      },
    });
    return { success: "Clap created" };
  }
};
