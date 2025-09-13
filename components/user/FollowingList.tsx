"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { userWithFollowing } from "./UserProfile";
import UserSummary from "../blog/UserSummery";
import FollowButton from "./FollowButton";

const FollowingList = ({ user }: { user: userWithFollowing }) => {
  const [open, setOpen] = useState(false);
  const followingId = user?.followings.map((item) => item.following.id);
  const followingsName = user?.followings.map((item) => item.following.name);
  console.log("followingNamae", followingsName, "followingId", followingId);
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <span>{user._count.followings} Followings</span>
        </DialogTrigger>
        <DialogContent className="max-w-[500px] w-[90%]">
          <DialogHeader>
            <DialogTitle>Following</DialogTitle>
          </DialogHeader>
          <div>
            {user.followings.map((item) => (
              <div
                key={item.following.id}
                className="flex justify-between gap-8 items-center"
              >
                <UserSummary user={item.following} />
                <FollowButton
                  user={item.following}
                  isList={true}
                  isFollowing={!!item.following.followers.length}
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FollowingList;
