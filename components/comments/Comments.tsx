import React from "react";
import { BlogWithUser } from "../blog/ListBlogs";
import Heading from "../common/Heading";
import { auth } from "@/auth";
import AddCommentsForm from "./AddCommentsForm";
import getComments from "@/action/comments/get-comments";
import ListComments from "./ListComments";

const Comments = async ({ blog }: { blog: BlogWithUser }) => {
  const session = await auth();
  const userId = session?.user.id;

  const { success } = await getComments({
    blogId: blog.id,
    userId,
    parentId: null,
  });

  return (
    <div>
      <Heading title="Comments" />
      {userId && (
        <AddCommentsForm
          blogId={blog.id}
          userId={userId}
          creatorId={blog.userId}
        />
      )}
      {!!success?.comments.length && (
        <ListComments comments={success.comments} />
      )}
    </div>
  );
};

export default Comments;
