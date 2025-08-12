"use server";

import { db } from "@/lib/db";
import { getPasswordResetTokenByToken } from "@/lib/passwordResetToken";
import { getUserByEmail } from "@/lib/user";
import {
  PasswordResetSchema,
  PasswordResetSchemaType,
} from "@/schemas/PasswordResetSchema";
import bcrypt from "bcryptjs";

export const passwordReset = async (
  values: PasswordResetSchemaType,
  token?: string | null
) => {
  if (!token) return { error: "Invalid Reset Token" };

  const validateFields = PasswordResetSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid password" };
  }
  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "Invalid Token" };
  }

  const isExpired = new Date(existingToken.expires).getTime() < Date.now();

  if (isExpired) {
    return { error: "Token has expired" };
  }

  const { email } = existingToken;

  const user = await getUserByEmail(email);

  if (!user || !user.email) {
    return { error: "user not found" };
  }

  const { password } = validateFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      emailVerified: new Date(),
      email: user.email,
    },
  });

  await db.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Password reset successfully" };
};
