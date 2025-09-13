import { Blog, User } from "@prisma/client";
import BlogCard from "./BlogCard";
import Pagination from "./Pagination";

export type BlogWithUser = Blog & {
  user: Pick<User, "id" | "name" | "image">;
  _count: {
    claps: number;
    comments: number;
  };
  claps: {
    id: string;
  }[];
  bookmarks: {
    id: string;
  }[];
};
interface ListBlogsProps {
  blogs: BlogWithUser[];
  hasMoreBlogs: boolean;
  currentPage: number;
  isUserProfile?: boolean;
}
const ListBlogs = ({
  blogs,
  hasMoreBlogs,
  currentPage,
  isUserProfile,
}: ListBlogsProps) => {
  return (
    <div className="flex flex-col gap-4 m-auto px-4 pt-2 max-w-[800px] min-h-[85vh] justify-between">
      <section>
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} isUserProfile={isUserProfile} />
        ))}
      </section>
      <Pagination
        currentPage={currentPage}
        hasMoreBlogs={hasMoreBlogs}
        isUserProfile={isUserProfile}
      />
    </div>
  );
};

export default ListBlogs;
