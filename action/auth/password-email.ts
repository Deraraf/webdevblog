"use server";

import {
  generatePasswordResetToken,
  sendPasswordResetToken,
} from "@/lib/passwordResetToken";
import { getUserByEmail } from "@/lib/user";
import {
  PasswordEmailSchema,
  PasswordEmailSchemaType,
} from "@/schemas/PasswordEmailSchema";

export const passwordEmail = async (values: PasswordEmailSchemaType) => {
  const validateFields = PasswordEmailSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid Email" };
  }

  const { email } = validateFields.data;

  const user = await getUserByEmail(email);

  if (!user || !user.email) {
    return { error: "user not found" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);

  if ("error" in passwordResetToken) {
    return {
      error: "something went wrong while generating password reset token",
    };
  }

  const { error } = await sendPasswordResetToken(
    passwordResetToken.email,
    passwordResetToken.token
  );

  if (error) {
    return { error: "something went wrong while sending password reset email" };
  }

  return { success: "Password reset link sent to your email" };
};
