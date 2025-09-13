import Link from "next/link";
import { BlogWithUser } from "./ListBlogs";
import Image from "next/image";
import UserSummary from "./UserSummery";
import Tag from "../common/Tag";
import Reactions from "./Reactions";
import { auth } from "@/auth";

const BlogCard = async ({
  blog,
  isUserProfile,
}: {
  blog: BlogWithUser;
  isUserProfile?: boolean;
}) => {
  const session = await auth();
  const userId = session?.user?.id;

  const isUserBlogOwner = userId === blog.userId;
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="border-b border-slate-300 dark:border-slate-700 py-6 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 ">
      <div className="flex justify-between items-center">
        {blog.user && (
          <UserSummary user={blog.user} createdDate={blog.createdAt} />
        )}
        {isUserBlogOwner && isUserProfile && !blog.isPublished && (
          <p className="text-rose-500">draft</p>
        )}
        {(isUserBlogOwner || isAdmin) && isUserProfile && (
          <Link className="text-orange-500" href={`/blog/edit/${blog.id}`}>
            Edit
          </Link>
        )}
      </div>
      <div className="flex justify-between my-2 gap-6">
        <div className="flex flex-col  justify-between w-full">
          <Link
            href={`/blog/details/${blog.id}`}
            className="text-xl sm:text-2xl font-bold"
          >
            {blog.title}
          </Link>
          {!!blog.tags.length && (
            <div className="flex gap-4 flex-wrap items-center mb-2 my-2">
              {blog.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          )}
          <Reactions blog={blog} />
        </div>
        {blog.coverImage && (
          <Link
            href={`/blog/details/${blog.id}`}
            className="w-full h-[100px] relative max-w-[160px] overflow-hidden"
          >
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              className="object-cover"
            />
          </Link>
        )}
      </div>
    </div>
  );
};

export default BlogCard;
