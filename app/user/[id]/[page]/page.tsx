import { auth } from "@/auth";
import Alert from "@/components/common/Alert";
import UserProfile from "@/components/user/UserProfile";
import { db } from "@/lib/db";

const Profile = async ({
  params,
}: {
  params: Promise<{ id: string; page: string }>;
}) => {
  const { id, page } = await params;
  const session = await auth();
  const currentUserId = session?.user?.id;
  const name = session?.user.name;
  console.log("currentUserId", currentUserId, name);

  const user = await db.user.findUnique({
    where: {
      id,
    },
    include: {
      followings: {
        include: {
          following: {
            select: {
              id: true,
              name: true,
              image: true,
              followers: {
                where: {
                  followerId: currentUserId,
                },
                select: { id: true },
              },
            },
          },
        },
      },
      followers: {
        include: {
          follower: {
            select: {
              id: true,
              name: true,
              image: true,
              followers: {
                where: {
                  followerId: currentUserId,
                },
                select: {
                  id: true,
                },
              },
            },
          },
        },
      },
      _count: {
        select: {
          followings: true,
          followers: true,
        },
      },
    },
  });

  if (!user) return <Alert error message="No user found" />;

  const follow = await db.follow.findFirst({
    where: {
      followingId: currentUserId,
      followerId: user.id,
    },
  });

  return <UserProfile user={user} page={page} isFollowing={Boolean(follow)} />;
};

export default Profile;
