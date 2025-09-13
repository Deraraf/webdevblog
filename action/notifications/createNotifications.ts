"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { EntityType, NotificationType } from "@prisma/client";

export const createNotifications = async ({
  recipientId,
  blogId,
  commentId,
  entityType,
  content,
  type,
}: {
  recipientId: string;
  type: NotificationType;
  entityType?: EntityType;
  content?: string;
  blogId?: string;
  commentId?: string;
}) => {
  const session = await auth();

  if (!session?.user) {
    return { error: "not authenticated" };
  }

  if (session?.user?.id === recipientId) {
    return { error: "you can't send notification to yourself" };
  }
  const recipient = await db.user.findUnique({
    where: {
      id: recipientId,
    },
  });

  if (!recipient) {
    return { error: "recipient not found" };
  }

  try {
    await db.notification.create({
      data: {
        senderId: session?.user?.id,
        recipientId,
        type,
        blogId,
        commentId,
        entityType,
        content,
      },
    });

    return { success: "notification sent" };
  } catch (error) {
    console.log("error sending notification", error);
    return { error: "failed to send notification" };
  }
};
