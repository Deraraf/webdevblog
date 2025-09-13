"use client";

import { PiHandsClapping } from "react-icons/pi";
import { FaRegBookmark, FaRegComment } from "react-icons/fa";
import { useState } from "react";
import { FaBookmark, FaHandsClapping } from "react-icons/fa6";
import { useSession } from "next-auth/react";
import { BlogWithUser } from "./ListBlogs";
import { clapBlog } from "@/action/blogs/clap-blog";
import { useRouter } from "next/navigation";
import { bookmarkBlog } from "@/action/blogs/bookmark-blog";

const Reactions = ({ blog }: { blog: BlogWithUser }) => {
  const [clapCount, setClapCount] = useState(blog._count.claps);
  const [userHasClapped, setUserHasClapped] = useState(!!blog.claps?.length);
  const [userHasBookmarked, setUserHasBookmarked] = useState(
    !!blog.bookmarks?.length
  );
  const session = useSession();
  const router = useRouter();

  const userId = session?.data?.user.id;

  const handleClap = async () => {
    if (!userId) return;

    setClapCount((prevCount) =>
      userHasClapped ? prevCount - 1 : prevCount + 1
    );
    setUserHasClapped((prevValue) => !prevValue);

    await clapBlog(blog.id, userId);
    router.refresh();
  };

  const handleBookmark = async () => {
    if (!userId) return;
    setUserHasBookmarked((prevValue) => !prevValue);

    await bookmarkBlog(blog.id, userId);
    router.refresh();
  };

  const handleComment = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (window.location.pathname.includes(`/blog/details/${blog.id}`)) {
      document
        .getElementById("comments")
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/blog/details/${blog.id}#comments`);
    }
  };
  return (
    <div className="flex justify-between items-center w-full text-sm">
      <div className="flex items-center gap-4">
        <span onClick={handleClap} className="flex mr-2 gap-1 cursor-pointer">
          {userHasClapped ? <FaHandsClapping /> : <PiHandsClapping size={20} />}
          {clapCount}
        </span>

        <span
          onClick={handleComment}
          className="flex mr-2 gap-1 cursor-pointer "
        >
          <FaRegComment size={18} />
          {blog?._count?.comments}
        </span>
      </div>
      <div>
        <span onClick={handleBookmark} className=" cursor-pointer">
          {userHasBookmarked ? (
            <FaBookmark size={18} />
          ) : (
            <FaRegBookmark size={18} />
          )}
        </span>
      </div>
    </div>
  );
};

export default Reactions;
