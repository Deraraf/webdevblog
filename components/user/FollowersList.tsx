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

const FollowersList = ({ user }: { user: userWithFollowing }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <span>{user._count.followers} Followers</span>
        </DialogTrigger>
        <DialogContent className="max-w-[500px] w-[90%]">
          <DialogHeader>
            <DialogTitle>Followers</DialogTitle>
          </DialogHeader>
          <div>
            {user.followers.map((item) => (
              <div
                key={item.follower.id}
                className="flex justify-between gap-8 items-center"
              >
                <UserSummary user={item.follower} />
                <FollowButton
                  user={item.follower}
                  isList={true}
                  isFollowing={!!item.follower.followers.length}
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FollowersList;
