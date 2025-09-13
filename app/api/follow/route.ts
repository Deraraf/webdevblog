import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const session = await auth();
    const userId = session?.user?.id;
    const followId = body.followId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!followId) {
      return NextResponse.json(
        { error: "no user to follow Id" },
        { status: 400 }
      );
    }

    if (userId === followId) {
      return NextResponse.json(
        { error: "You can't follow yourself" },
        { status: 400 }
      );
    }

    const existingFollow = await db.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: followId,
        },
      },
    });

    if (existingFollow) {
      //unfollow
      await db.follow.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: followId,
          },
        },
      });
      return NextResponse.json(
        { success: "unfollowed" },
        {
          status: 200,
        }
      );
    } else {
      //follow
      await db.follow.create({
        data: {
          followerId: userId,
          followingId: followId,
        },
      });
      return NextResponse.json(
        { success: "followed" },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
