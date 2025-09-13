"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import {
  generateEmailVerificationToken,
  sendVerificationToken,
} from "@/lib/emailVerification";
import { getUserByEmail } from "@/lib/user";
import {
  EditProfileFormType,
  EditProfileSchema,
} from "@/schemas/EditProfileSchema";

export const editUser = async (values: EditProfileFormType, userId: string) => {
  const vfields = EditProfileSchema.safeParse(values);

  if (!vfields.success) return { error: "invalid fields" };
  const session = await auth();
  if (session?.user?.id !== userId) return { error: "unauthorized" };
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) return { error: "user not found" };
  // check if the user email is already taken
  if (user.email !== vfields.data.email) {
    const existingUser = await getUserByEmail(user.email);
    if (existingUser) return { error: "email already taken" };

    await db.user.update({
      where: {
        id: userId,
      },
      data: { ...vfields.data, emailVerified: null },
    });

    const verificationToken = await generateEmailVerificationToken(
      vfields.data.email
    );

    const { error } = await sendVerificationToken(
      verificationToken.email,
      verificationToken.token
    );

    if (error) {
      return {
        error:
          "Something went wrong while sending verification email, try to login and resend the verification email",
      };
    }
    return { success: "verification email sent successfully" };
  } else {
    await db.user.update({
      where: {
        id: userId,
      },
      data: { ...vfields.data },
    });
    return { success: "user Profile edited successfully" };
  }
};
