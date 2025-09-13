"use client";
import { useState } from "react";
import UserSummary from "../blog/UserSummery";
import CommentReactions from "./CommentReactions";
import { CommentsWithUser } from "./ListComments";
import AddCommentsForm from "./AddCommentsForm";
import { useSession } from "next-auth/react";
import ListReplies from "./ListReplies";

const CommentCard = ({ comment }: { comment: CommentsWithUser }) => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showReply, setShowReply] = useState<boolean>(false);

  const session = useSession();
  const userId = session?.data?.user.id;
  return (
    <div className="flex flex-col gap-2 p-4 border-2 rounded-md mt-4">
      <UserSummary user={comment.user} createdDate={comment.createdAt} />
      <p>{comment.content}</p>
      <CommentReactions
        comment={comment}
        setShowForm={setShowForm}
        setShowReply={setShowReply}
      />
      {(showForm || showReply) && (
        <div className="border-l-2 pl-2 my-2 ml-4">
          {userId && showForm && (
            <AddCommentsForm
              blogId={comment.blogId}
              userId={userId}
              parentId={comment.id}
              replyToId={comment.userId}
              placeholder="Add reply"
            />
          )}
          {showReply && <ListReplies comment={comment} userId={userId} />}
        </div>
      )}
    </div>
  );
};

export default CommentCard;
