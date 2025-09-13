import { tags } from "@/lib/tags";
import Tag from "../common/Tag";
import "./Tags.css";
import { usePathname, useSearchParams } from "next/navigation";

const Tags = () => {
  const tag = useSearchParams().get("tag");
  const title = useSearchParams().get("title");
  const pathname = usePathname();

  const isFeedPage = pathname.includes("/blog/feed");

  if (!isFeedPage) return null;

  return (
    <div className="border-t">
      <div className="max-w-[1920px] mx-auto w-full px-4 pt-4 pb-0 xl:px-20">
        <div className="flex justify-start items-center gap-6 pb-2 sm:gap-12 overflow-x-auto tags-container">
          {tags.map((item) => (
            <Tag
              key={item}
              selected={
                tag === item ||
                title === item ||
                (tag === null && title === null && item === "all")
              }
            >
              {item}
            </Tag>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tags;
