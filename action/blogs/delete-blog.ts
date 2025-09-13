"use server";

import { db } from "@/lib/db";

export const deleteBlog = async (id: string) => {
  // deleting blog may also delete tags comment and claps

  const blog = await db.blog.findUnique({
    where: {
      id,
    },
  });

  if (!blog) return { error: "Blog not found" };
  await db.blog.delete({
    where: {
      id,
    },
    include: {
      _count: true,
      bookmarks: true,
      comments: true,
      claps: true,
    },
  });

  return { success: "Blog deleted successfully" };
};
