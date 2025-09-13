import { User } from "@prisma/client";
import { Avatar, AvatarImage } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Calendar, UserRound } from "lucide-react";
import moment from "moment";
import { getBlogByUserId } from "@/action/blogs/get-blogByUserId";
import Alert from "../common/Alert";
import ListBlogs from "../blog/ListBlogs";
import Link from "next/link";
import Tag from "../common/Tag";
import FollowButton from "./FollowButton";
import { auth } from "@/auth";
import FollowersList from "./FollowersList";
import FollowingList from "./FollowingList";

export type userWithFollowing = User & {
  followings: {
    following: Pick<User, "id" | "name" | "image"> & {
      followers: {
        id: string;
      }[];
    };
  }[];
  followers: {
    follower: Pick<User, "id" | "name" | "image"> & {
      followers: {
        id: string;
      }[];
    };
  }[];
  _count: {
    followings: number;
    followers: number;
  };
};

const UserProfile = async ({
  user,
  page,
  isFollowing,
}: {
  user: userWithFollowing;
  page: string;
  isFollowing: boolean;
}) => {
  const currentPage = parseInt(page, 10);

  const session = await auth();

  const userId = session?.user.id;

  const { success, error } = await getBlogByUserId({
    userId: user?.id,
    page: currentPage,
    limit: 5,
  });

  return (
    <div className="max-w-[1200px] m-auto p-4">
      <div className="flex gap-6 justify-between">
        <div className="flex items-start sm:items-center gap-6 flex-col sm:flex-row">
          <Avatar className="w-20 h-20">
            <AvatarImage
              src={user?.image ? user?.image : ""}
              alt={user?.name ?? ""}
            />
            <AvatarFallback className="border-slate-500 dark:border-slate-50   ">
              <UserRound size={40} />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <h1 className="text-xl sm:text-3xl font-bold">{user?.name}</h1>
            <p className="text-xl">{user?.email}</p>
            {user.bio && <p>{user.bio}</p>}
            <div className="flex gap-4 items-center">
              <FollowersList user={user} />
              <FollowingList user={user} />
            </div>
          </div>
        </div>
        <div>
          {userId === user.id && (
            <Link
              className="p-2 bg-slate-500 dark:hover:bg-slate-800 rounded-md"
              href={`/user/edit/${user.id}`}
            >
              Edit
            </Link>
          )}

          {userId !== user.id && (
            <FollowButton user={user} isList isFollowing={isFollowing} />
          )}
        </div>
      </div>
      <div className="flex gap-4 flex-col items-center justify-center p-6 border-y mt-6 flex-wrap ">
        <div className="flex gap-6 items-center justify-center flex-wrap">
          <span className="bg-secondary ml-2 py-1 px-2 rounded-md">
            Id {user.id}
          </span>
          <span className="bg-secondary ml-2 py-1 px-2 rounded-md">
            email {user.email}
          </span>
        </div>
        <div className="flex items-center justify-center gap-2 ">
          <Calendar size={20} />
          memeber since {moment(user.createdAt).format("MMMM Do YYYY")}
        </div>
      </div>
      <div>
        {!!user.tags.length && (
          <div className="flex justify-center items-center p-6 border-b mb-6 gap-4 flex-wrap">
            {user.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}
      </div>
      <div>
        {error && <Alert error message="Error fetching user blogs" />}
        {success && (
          <ListBlogs
            blogs={success.blogs}
            hasMoreBlogs={success.hasMoreBlogs}
            currentPage={currentPage}
            isUserProfile={true}
          />
        )}
      </div>
      <div></div>
    </div>
  );
};

export default UserProfile;
