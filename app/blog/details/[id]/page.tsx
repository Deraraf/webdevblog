import { getBlogById } from "@/action/blogs/getBlogById";
import { auth } from "@/auth";
import { BlockNoteEditor } from "@/components/blog/editor/DynamicEditor";

import Reactions from "@/components/blog/Reactions";
import UserSummary from "@/components/blog/UserSummery";
import Alert from "@/components/common/Alert";
import Tag from "@/components/common/Tag";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import "./editor.css";
import Comments from "@/components/comments/Comments";

interface BlogContentProps {
  params: Promise<{ id: string }>;
}

const BlogContent = async ({ params }: BlogContentProps) => {
  const session = await auth();

  const { id } = await params;

  const res = await getBlogById({ blogId: id });

  if (!res.success)
    return <Alert error message={res.error || "Error fetching blog contebt"} />;

  const { blog } = res.success;

  if (!blog) return <Alert message="No blog found" />;

  return (
    <div className="flex flex-col max-w-[900px] m-auto gap-6">
      {blog.coverImage && (
        <div className="w-full h-[35vh] relative mt-2">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            className="object-cover rounded"
          />
        </div>
      )}
      <div className="flex justify-between items-center">
        {blog.user && (
          <UserSummary user={blog.user} createdDate={blog.createdAt} />
        )}
        {blog.userId === session?.user.id && (
          <Link href={`/blog/edit/${blog.id}`} className="text-orange-400">
            Edit
          </Link>
        )}
      </div>
      <div>
        <Separator />
        <Reactions blog={blog} />
        <Separator />
      </div>
      <h1 className="text-4xl font-bold">{blog.title}</h1>
      {!!blog.tags.length && (
        <div className="flex gap-4 flex-wrap items-center">
          {blog.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      )}
      <div>
        <BlockNoteEditor editable={false} initialContent={blog.content} />
      </div>
      <Separator />
      <div id="comments">
        <Comments blog={blog} />
      </div>
    </div>
  );
};

export default BlogContent;
