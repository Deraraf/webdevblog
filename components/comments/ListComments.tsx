import { Comment, User } from "@prisma/client";
import CommentCard from "./CommentCard";

export type CommentsWithUser = Comment & {
  user: Pick<User, "id" | "name" | "image">;
  replyToUser: Pick<User, "id" | "name"> | null;
  _count: {
    replies: number;
    claps: number;
  };
  claps: {
    id: string;
  }[];
};

const ListComments = async ({ comments }: { comments: CommentsWithUser[] }) => {
  return (
    <div>
      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default ListComments;
