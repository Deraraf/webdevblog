"use client";
import { User } from "@prisma/client";
import Button from "../common/Button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createNotifications } from "@/action/notifications/createNotifications";
import { useSocket } from "@/context/SocketContext";

const FollowButton = ({
  user,
  isFollowing: following,
  isList = false,
}: {
  user: User | Pick<User, "id" | "name" | "image">;
  isFollowing: boolean;
  isList?: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(following);

  const { sendNotification } = useSocket();

  const router = useRouter();

  useEffect(() => {
    setIsFollowing(following);
  }, [following]);

  const handleFollow = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/follow/", {
        body: JSON.stringify({
          followId: user?.id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const data = await res.json();
      if (data.success === "followed") {
        setIsFollowing(true);
        if (user.id) {
          await createNotifications({
            recipientId: user.id,
            type: "FOLLOW",
            entityType: "USER",
          });
          if (sendNotification) sendNotification(user.id);
        }
      } else if (data.success === "unfollowed") {
        setIsFollowing(false);
      }
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button
      label={loading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
      onClick={handleFollow}
      disabled={loading}
      small={isList}
      isFollowing={isFollowing}
    />
  );
};

export default FollowButton;
