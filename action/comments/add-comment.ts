"use server";

import { getUserById } from "@/lib/user";
import { CommentSchema, CommentSchemaType } from "@/schemas/CommentShema";
import { getBlogById } from "../blogs/getBlogById";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const addComment = async ({
  values,
  userId,
  blogId,
  replyToUserId,
  parentId,
}: {
  values: CommentSchemaType;
  userId: string;
  blogId: string;
  parentId?: string;
  replyToUserId?: string;
}) => {
  const vfields = CommentSchema.safeParse(values);

  if (!vfields.success) return { error: "Invalid fields" };

  const { content } = vfields.data;

  const user = await getUserById(userId);

  if (!user) return { error: "User not found" };

  const blog = await getBlogById({ blogId });
  if (!blog) return { error: "Blog not found" };

  if (parentId) {
    const parentComment = await db.comment.findUnique({
      where: {
        id: parentId,
      },
    });
    if (!parentComment) return { error: "Parent comment not found" };
  }

  if (replyToUserId) {
    const replyToUser = await getUserById(replyToUserId);
    if (!replyToUser) return { error: "Reply to user not found" };
  }

  await db.comment.create({
    data: {
      content,
      userId,
      blogId,
      parentId,
      replyToUserId,
    },
  });

  revalidatePath(`/blogs/${blogId}`);

  return { success: "Comment added Successfully" };
};
