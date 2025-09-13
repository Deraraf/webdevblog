"use client";

import { useEffect, useState } from "react";
import { CommentsWithUser } from "./ListComments";
import getComments from "@/action/comments/get-comments";
import ReplyCard from "./ReplyCard";

const ListReplies = ({
  comment,
  userId,
}: {
  comment: CommentsWithUser;
  userId?: string;
}) => {
  const [replies, setReplies] = useState<CommentsWithUser[]>([]);
  const [isPending, startTransition] = useState();
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    startTransition(() => {
      getComments({
        blogId: comment.blogId,
        parentId: comment.id,
        userId,
      }).then((res) => {
        if (res.success) {
          setReplies(res.success.comments);
        } else {
          setError(res.error);
        }
      });
    });
  }, [comment, userId]);
  return (
    <div className="text-sm">
      {isPending && <p>Loading...</p>}
      {error && <p className="text-rose-500">{error}</p>}
      {replies.map((reply) => (
        <div key={reply.id}>
          <ReplyCard reply={reply} />
        </div>
      ))}
    </div>
  );
};

export default ListReplies;
