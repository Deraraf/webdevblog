"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { backendClient } from "@/lib/edgestore-server";
import { getUserById } from "@/lib/user";

export const DeletUser = async (userId: string) => {
  const user = await getUserById(userId);

  if (!user) return { error: "User not found" };

  const session = await auth();
  if (session?.user?.id !== user.id) return { error: "unauthorized" };

  const blogs = await db.blog.findMany({
    where: {
      userId: user.id,
    },
  });

  if (!!blogs.length) {
    await Promise.all(
      blogs.map(async (blog) => {
        if (blog.coverImage) {
          try {
            await backendClient.publicFiles.deleteFile({
              url: blog.coverImage,
            });
          } catch (error) {
            console.log("Error deleting cover image:", error);
          }
        }
      })
    );
  }
  try {
    await db.user.delete({
      where: {
        id: userId,
      },
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return { error: "Error deleting user" };
  }

  return { success: "User account deleted successfully" };
};
