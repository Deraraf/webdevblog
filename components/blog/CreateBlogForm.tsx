"use client";

import { BlogFormType, BlogSchema } from "@/schemas/BlogShema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import FormField from "../common/FormField";
import AddCover from "./AddCover";
import { useEffect, useState, useTransition } from "react";
import CoverImage from "./CoverImage";
import { tags } from "@/lib/tags";
import { BlockNoteEditor } from "./editor/DynamicEditor";
import Button from "../common/Button";
import createBlog from "@/action/blogs/create-blog";
import { Blog } from "@prisma/client";
import { editBlog } from "@/action/blogs/edit-blog";
import { deleteBlog } from "@/action/blogs/delete-blog";
import { useRouter } from "next/navigation";
import { useEdgeStore } from "@/lib/edgestore";

const CreateBlogForm = ({ blog }: { blog?: Blog }) => {
  const session = useSession();
  const userId = session.data?.user?.id;
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadedCover, setUploadedCover] = useState<string>();
  const [content, setContent] = useState<string | undefined>("");
  const [isPublishing, startPublishing] = useTransition();
  const [isSavingDraft, startSavingDraft] = useTransition();
  const [isDeleting, startDeleting] = useTransition();
  const { edgestore } = useEdgeStore();
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm<BlogFormType>({
    resolver: zodResolver(BlogSchema),
    mode: "onChange",
    defaultValues: blog
      ? {
          userId: blog.userId,
          isPublished: blog.isPublished,
          title: blog.title,
          tags: blog.tags,
          content: blog.content,
          coverImage: blog.coverImage || undefined,
        }
      : {
          userId: "",
          isPublished: false,
          tags: [],
          content: "",
        },
  });
  useEffect(() => {
    if (userId) {
      setValue("userId", userId, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  }, [userId, setValue]);

  useEffect(() => {
    if (blog?.coverImage) {
      setUploadedCover(blog?.coverImage);
    }
  }, [blog?.coverImage]);

  useEffect(() => {
    if (uploadedCover) {
      setValue("coverImage", uploadedCover, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  }, [uploadedCover, setValue]);

  useEffect(() => {
    if (typeof content === "string") {
      setValue("content", content, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: false,
      });
    }
  }, [content, setValue]);

  const onChange = async (content: string) => {
    setContent(content);
  };

  const onPublish: SubmitHandler<BlogFormType> = async (data) => {
    setError(null);
    setSuccess(null);
    if (data.tags.length > 4) return setError(" select only 4 tags");

    startPublishing(() => {
      if (blog) {
        editBlog({ ...data, isPublished: true }, blog.id)
          .then((res) => {
            if (res.success) {
              setSuccess(res.success);
              router.push("/blog/feed/1");
            } else {
              setError(res.error ?? "Something went wrong");
            }
          })
          .catch((err) => {
            setError(err.message);
          });
      } else {
        createBlog({ ...data, isPublished: true })
          .then((res) => {
            if (res.success) {
              setSuccess(res.success);
              router.push("/blog/feed/1");
            } else {
              setError(res.error ?? "Something went wrong");
            }
          })
          .catch((err) => {
            setError(err.message);
          });
      }
    });
  };
  const onSaveDraft: SubmitHandler<BlogFormType> = async (data) => {
    setError(null);
    setSuccess(null);

    startSavingDraft(() => {
      if (blog) {
        editBlog({ ...data, isPublished: false }, blog.id)
          .then((res) => {
            if (res.success) {
              setSuccess(res.success);
            } else {
              setError(res.error ?? "Something went wrong");
            }
          })
          .catch((err) => {
            setError(err.message);
          });
      } else {
        createBlog({ ...data, isPublished: false })
          .then((res) => {
            if (res.success) {
              setSuccess(res.success);
            } else {
              setError(res.error ?? "Something went wrong");
            }
          })
          .catch((err) => {
            setError(err.message);
          });
      }
    });
  };

  const onDelete: SubmitHandler<BlogFormType> = async (data) => {
    setError(null);
    setSuccess(null);
    startDeleting(async () => {
      if (data.coverImage) {
        await edgestore.publicFiles.delete({
          url: data.coverImage,
        });
      }

      if (blog) {
        deleteBlog(blog.id).then((res) => {
          if (res.error) {
            setError(res.error);
          }
          if (res.success) {
            alert("are you sure you want to delete this blog?");
            setSuccess(res.success);
          }
        });
        router.push("/blog/feed/1");
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onPublish)}
      className="flex flex-col justify-between max-w-[1200px] m-auto min-h-[85vh]"
    >
      <div>
        {!!uploadedCover && (
          <CoverImage
            url={uploadedCover}
            isEditor={true}
            setUploadedCover={setUploadedCover}
          />
        )}
        {!uploadedCover && <AddCover setUploadedCover={setUploadedCover} />}
        <FormField
          id="title"
          register={register}
          placeholder="blog title"
          errors={errors}
          inputClassName="border-none text-5xl font-bold bg-transparent px-0"
        />
        <fieldset className="flex flex-col gap-2 border-y mb-4 py-2">
          <legend className="mb-2 pr-2">Select 4 Tags</legend>
          <div className="flex flex-wrap gap-4 w-full">
            {tags.map((tag) => {
              if (tag === "All") return null;
              return (
                <label key={tag}>
                  <input
                    type="checkbox"
                    value={tag}
                    {...register("tags")}
                    className="cursor-pointer"
                  />
                  <span className="ml-2">{tag}</span>
                </label>
              );
            })}
          </div>
          {errors.tags && errors.tags.message && (
            <span className="text-rose-400">select at one tag</span>
          )}
        </fieldset>
        <BlockNoteEditor
          onChange={onChange}
          initialContent={blog?.content ? blog.content : ""}
        />
        {errors.content && errors.content.message && (
          <span className="text-rose-400">{errors.content.message}</span>
        )}
      </div>
      {success && <span className="text-green-500">{success}</span>}
      {error && <span className="text-rose-500">{error}</span>}
      <div className="border-t pt-2">
        <div className="flex justify-between items-center gap-6">
          {blog && (
            <div>
              <Button
                onClick={handleSubmit(onDelete)}
                label={isDeleting ? "Deleting..." : "Delete"}
                type="button"
              />
            </div>
          )}

          <div className="flex gap-6">
            <Button
              type="submit"
              label={isPublishing ? "Publishing..." : "Publish"}
              className="bg-blue-700 outline-none"
              disabled={isPublishing}
            />
            <Button
              type="button"
              label={isSavingDraft ? "Saving..." : "Save Draft"}
              onClick={handleSubmit(onSaveDraft)}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateBlogForm;
