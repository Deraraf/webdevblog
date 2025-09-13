"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export const getNotifications = async () => {
  const session = await auth();

  if (!session) return { error: "you not loged in" };
  const userId = session?.user?.id;

  try {
    const notifications = await db.notification.findMany({
      where: {
        recipientId: userId,
      },
      take: 100,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
        blog: {
          select: {
            id: true,
            title: true,
          },
        },
        comment: {
          select: {
            id: true,
            content: true,
            blogId: true,
          },
        },
      },
    });

    const unreadCount = await db.notification.count({
      where: {
        recipientId: userId,
        isRead: false,
      },
    });
    const countNotifications = await db.notification.count({
      where: {
        recipientId: userId,
      },
    });

    if (countNotifications > 100) {
      const oldestNotifications = await db.notification.findMany({
        where: {
          recipientId: userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: 100,
        select: {
          id: true,
        },
      });

      const oldestNotificationId = oldestNotifications?.map((n) => n.id);

      await db.notification.deleteMany({
        where: {
          id: {
            in: oldestNotificationId,
          },
        },
      });
    }

    const formatedNotifications = notifications.map((notification) => {
      const { type, sender, blog } = notification;
      let content = "";

      switch (type) {
        case "NEW_COMMENT":
          content = `${sender.name || "someone "} commented on your blog :"${
            blog?.title
          }"`;
          break;
        case "COMMENT_REPLY":
          content = `${sender.name} replied to your comment`;
          break;
        case "FOLLOW":
          content = `${sender.name} followed you`;
          break;
        case "SYSTEM_ALERT":
          content = `${sender.name} alerted you`;
          break;
        default:
          content = `${sender.name} sent you a notification`;
      }
      return {
        ...notification,
        content,
      };
    });

    return {
      success: {
        notifications: formatedNotifications,
        unreadNotificationsCount: unreadCount,
      },
    };
  } catch (error: unknown) {
    console.error(error);

    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "something went wrong" };
  }
};
