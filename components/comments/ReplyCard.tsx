"use client";

import { useState } from "react";
import UserSummary from "../blog/UserSummery";
import CommentReactions from "./CommentReactions";
import { CommentsWithUser } from "./ListComments";
import { useSession } from "next-auth/react";
import AddCommentsForm from "./AddCommentsForm";

const ReplyCard = ({ reply }: { reply: CommentsWithUser }) => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showReply, setShowReply] = useState<boolean>(false);
  const session = useSession();
  const userId = session?.data?.user.id;
  return (
    <div className="flex flex-col gap-2 p-4 pr-0">
      <UserSummary user={reply.user} createdDate={reply.createdAt} />
      <p>
        {reply.replyToUser && (
          <span className=" bg-secondary px-2 py-1 rounded text-sm cursor-pointer">
            @{reply.replyToUser.name}
          </span>
        )}
        {reply.content}
      </p>
      <CommentReactions
        comment={reply}
        setShowForm={setShowForm}
        isReplied={true}
      />
      {(showForm || showReply) && (
        <div className="border-l-2 pl-2 my-2 ml-4">
          {userId && showForm && (
            <AddCommentsForm
              blogId={reply.blogId}
              userId={userId}
              parentId={reply.parentId ? reply.parentId : undefined}
              replyToId={reply.userId}
              placeholder="Add reply"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ReplyCard;
