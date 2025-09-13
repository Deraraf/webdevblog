import { auth } from "@/auth";
import { db } from "@/lib/db";

export const getCount = async () => {
  const session = await auth();

  const isAdmin = session?.user?.role === "ADMIN";

  if (!isAdmin) return { error: "Error fetching data" };

  try {
    const users = await db.user.count();
    const blogs = await db.blog.count();
    return { success: { users, blogs } };
  } catch (error) {
    console.log(error);
    return { error: "Error fetching data" };
  }
};
