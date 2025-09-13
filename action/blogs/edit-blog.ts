"use server";
import { db } from "@/lib/db";
import { getUserById } from "@/lib/user";

import { BlogSchema, BlogFormType } from "@/schemas/BlogShema";

export const editBlog = async (values: BlogFormType, blogId: string) => {
  const vFields = BlogSchema.safeParse(values);

  if (!vFields.success) return { error: "Invalid fields" };
  const { userId, isPublished } = await vFields.data;

  const user = await getUserById(userId);
  if (!user) return { error: "User not found" };

  if (isPublished && !user.emailVerified) {
    return { error: "not authorized verify your email first" };
  }

  const blog = await db.blog.findUnique({
    where: {
      id: blogId,
    },
  });

  if (!blog) return { error: "Blog not found" };

  await db.blog.update({
    where: {
      id: blogId,
    },
    data: {
      ...vFields.data,
    },
  });

  return { success: "Blog updated successfully" };
};
