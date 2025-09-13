"use client";

import { getNotifications } from "@/action/notifications/getNotifications";
import { markAllAsRead, markAsRead } from "@/action/notifications/markAsRead";
import { useSocket } from "@/context/SocketContext";
import { cn } from "@/lib/utils";
import { Blog, Comment, Notification } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Bell } from "lucide-react";
import moment from "moment";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type latestNotifications = Notification & {
  blog: Pick<Blog, "id" | "title"> | null;
  comment: Pick<Comment, "id" | "content" | "blogId"> | null;
};
const Notifications = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<latestNotifications[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refetchNotiications, handleNotifications } = useSocket();

  useEffect(() => {
    const handleFetch = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await getNotifications();

        if (res.success) {
          setNotifications(res.success.notifications);
          setUnreadCount(res.success.unreadNotificationsCount);
        }

        if (res.error) {
          setError(res.error);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(String(error));
        }
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    handleFetch();
  }, [refetchNotiications]);

  useEffect(() => {
    const hash = window.location.hash; // e.g. "#section1"
    let timeOutId: ReturnType<typeof setTimeout>;

    if (hash) {
      // remove the "#" and validate it's a proper ID
      const id = hash.slice(1);
      if (id) {
        timeOutId = setTimeout(() => {
          const element = document.getElementById(id); // safer than querySelector
          if (element instanceof HTMLElement) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 0);
      }
    }

    return () => {
      clearTimeout(timeOutId);
    };
  }, [pathname]);

  const handleOpen = async (n: latestNotifications) => {
    if (n.entityType === "BLOG" && n.blogId) {
      router.push(`/blog//details/${n.blogId}/#comments`);
    }
    if (n.entityType === "COMMENT" && n.comment?.blogId) {
      router.push(`/blog/details/${n?.comment?.blogId}/#${n?.comment?.id}`);
    }
    if (n.entityType === "USER" && n.senderId) {
      router.push(`/user/${n.senderId}/1`);
    }

    await markAsRead(n.id);
    handleNotifications();
  };
  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    handleNotifications();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative">
        {!!unreadCount && (
          <div className="absolute bg-rose-500 h-6 w-6 flex text-sm items-center justify-center rounded-full left-2 bottom-2">
            <span className="">{unreadCount}</span>
          </div>
        )}
        <Bell size={24} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[100%] max-w-[400px]">
        <div className="flex gap-4 justify-between p-2 mb-2">
          <h3 className="font-bold text-lg">Notifications</h3>
          <button onClick={handleMarkAllAsRead}>Mark all as read</button>
        </div>

        {loading && (
          <DropdownMenuItem>
            <div className="text-sm text-gray-500">Loading...</div>
          </DropdownMenuItem>
        )}
        {error && (
          <DropdownMenuItem>
            <div className="text-sm text-rose-500">{error}</div>
          </DropdownMenuItem>
        )}
        {!loading &&
          !error &&
          !!notifications.length &&
          notifications.map((n) => {
            return (
              <DropdownMenuItem
                onClick={() => handleOpen(n)}
                key={n.id}
                className={cn(
                  "text-sm cursor-pointer mb-4 flx flex-col items-start border",
                  !n.isRead && "bg-green-500"
                )}
              >
                <div className="flex flex-col gap-2 p-2">
                  {n.content}
                  <span>{moment(new Date(n.createdAt)).fromNow()}</span>
                </div>
              </DropdownMenuItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;
