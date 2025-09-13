"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export const markAllAsRead = async () => {
  const session = await auth();

  if (!session?.user) return { error: "you not loged in" };
  const userId = session?.user?.id;

  try {
    await db.notification.updateMany({
      where: {
        recipientId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return {
      success: "all notifications marked as read",
    };
  } catch (error: unknown) {
    console.error(error);

    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "something went wrong" };
  }
};

export const markAsRead = async (id: string) => {
  const session = await auth();

  if (!session?.user) return { error: "you not loged in" };

  const notification = await db.notification.findUnique({
    where: {
      id,
    },
  });
  if (!notification || notification.recipientId !== session?.user.id)
    return { error: "notification not found" };

  try {
    await db.notification.update({
      where: {
        id,
      },
      data: {
        isRead: true,
      },
    });

    return {
      success: "notification marked as read",
    };
  } catch (error: unknown) {
    console.error(error);

    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "something went wrong" };
  }
};
