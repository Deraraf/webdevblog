"use client";

import { cn } from "@/lib/utils";
import { CommentsWithUser } from "./ListComments";
import { Dispatch, SetStateAction, useState } from "react";
import { BsReply } from "react-icons/bs";
import { FaHandsClapping } from "react-icons/fa6";
import { FaRegComment } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { useSession } from "next-auth/react";
import { deleteComment } from "@/action/comments/delete-comment";
import toast from "react-hot-toast";
import { PiHandsClapping } from "react-icons/pi";
import { clapComment } from "@/action/comments/clap-comment";
import { useRouter } from "next/navigation";

interface CommentReactionsProps {
  comment: CommentsWithUser;
  setShowForm: Dispatch<SetStateAction<boolean>>;
  setShowReply?: Dispatch<SetStateAction<boolean>>;
  isReplied?: boolean;
}

const CommentReactions = ({
  comment,
  setShowForm,
  setShowReply,
  isReplied,
}: CommentReactionsProps) => {
  const session = useSession();
  const router = useRouter();
  const userId = session?.data?.user.id;
  const [clapCount, setClapCount] = useState(comment?._count?.claps);
  const [userHasClapped, setUserHasClapped] = useState(
    !!comment?.claps?.length
  );

  const handleReplay = () => {
    setShowForm((prevValue) => !prevValue);
  };

  const handleShowReplay = () => {
    if (setShowReply) {
      setShowReply((prevValue) => !prevValue);
    }
  };

  const handleDelete = async () => {
    if (userId) {
      const res = await deleteComment(comment.id, userId);
      if (res.success) {
        toast.success("Comment deleted");
        setShowForm(false);
      }
      if (res.error) {
        toast.error(res.error);
      }
    }
  };

  const handleClap = async () => {
    if (!userId) return;

    setClapCount((prevCount) =>
      userHasClapped ? prevCount - 1 : prevCount + 1
    );
    setUserHasClapped((prevValue) => !prevValue);

    await clapComment(comment.id, userId);
    router.refresh();
  };
  return (
    <div
      className={cn(
        "flex justify-between items-center w-full text-sm mt-2 gap-4",
        isReplied && "justify-start ml-2"
      )}
    >
      <div className="flex items-center gap-4">
        <span
          onClick={handleClap}
          className="flex items-center gap-1 cursor-pointer"
        >
          {userHasClapped ? (
            <FaHandsClapping size={20} />
          ) : (
            <PiHandsClapping size={20} />
          )}
          {clapCount}
        </span>
        {!isReplied && (
          <span
            onClick={handleShowReplay}
            className="flex items-center gap-1 cursor-pointer"
          >
            <FaRegComment size={20} />
            Replies {comment._count.replies}
          </span>
        )}
      </div>
      <div className="flex items-center">
        <span
          onClick={handleReplay}
          className="flex items-center gap-1 cursor-pointer mr-4"
        >
          <BsReply size={20} /> Reply
        </span>
        {userId === comment.userId && (
          <span onClick={handleDelete} className=" cursor-pointer">
            <MdDeleteOutline size={20} />
          </span>
        )}
      </div>
    </div>
  );
};

export default CommentReactions;
