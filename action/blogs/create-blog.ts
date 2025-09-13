"use server";

import { db } from "@/lib/db";

import { BlogFormType, BlogSchema } from "@/schemas/BlogShema";

export default async function createBlog(values: BlogFormType) {
  const vFields = BlogSchema.safeParse(values);

  if (!vFields.success) return { error: "Invalid fields" };
  const { userId, isPublished } = vFields.data;

  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) return { error: "User not found" };

  // if (isPublished && !user.emailVerified) {
  //   return { error: "not authorized verify your email first" };
  // }

  await db.blog.create({
    data: {
      ...vFields.data,
    },
  });

  if (isPublished) {
    return { success: "Blog created and published successfully" };
  }

  return { success: "Blog saved as draft successfully" };
}
