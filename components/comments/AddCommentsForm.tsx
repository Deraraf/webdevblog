"use client";

import { CommentSchema, CommentSchemaType } from "@/schemas/CommentShema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";

import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../common/Button";
import TextAreaField from "../common/TextAreaField";
import { addComment } from "@/action/comments/add-comment";
import toast from "react-hot-toast";
import { createNotifications } from "@/action/notifications/createNotifications";
import { useSocket } from "@/context/SocketContext";

interface AddCommentsFormProps {
  blogId: string;
  replyToId?: string;
  parentId?: string;
  userId: string;
  placeholder?: string;
  creatorId?: string;
}

const AddCommentsForm = ({
  blogId,
  replyToId,
  parentId,
  userId,
  placeholder,
  creatorId,
}: AddCommentsFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CommentSchemaType>({
    resolver: zodResolver(CommentSchema),
  });

  const [isPending, startTransition] = useTransition();
  const { sendNotification } = useSocket();

  const onSubmit: SubmitHandler<CommentSchemaType> = async (data) => {
    startTransition(() => {
      addComment({
        values: data,
        userId,
        blogId,
        parentId,
        replyToUserId: replyToId,
      }).then(async (res) => {
        if (res.error) return toast.error(res.error);
        if (res.success) {
          if (replyToId) {
            await createNotifications({
              recipientId: replyToId,
              type: "COMMENT_REPLY",
              commentId: parentId,
              entityType: "COMMENT",
              content: data.content,
            });
            //send notification realtime
            if (sendNotification) sendNotification(replyToId);
          }

          if (creatorId) {
            await createNotifications({
              recipientId: creatorId,
              type: "NEW_COMMENT",
              blogId,
              entityType: "BLOG",
              content: data.content,
            });
            //send notification real time
            if (sendNotification) sendNotification(creatorId);
          }

          toast.success(res.success);
          reset();
        }
      });
    });
  };
  return (
    <form className="flex flex-col my-2" onSubmit={handleSubmit(onSubmit)}>
      <TextAreaField
        id="content"
        label="Comment"
        register={register}
        placeholder={placeholder || "Add a comment"}
        errors={errors}
        disabled={isPending}
      />
      <div>
        <Button
          type="submit"
          label={isPending ? "submitting..." : "Submit"}
          disabled={isPending}
        />
      </div>
    </form>
  );
};

export default AddCommentsForm;
