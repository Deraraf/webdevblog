"use server";

import { db } from "@/lib/db";
import {
  generateEmailVerificationToken,
  sendVerificationToken,
} from "@/lib/emailVerification";
import { getUserByEmail } from "@/lib/user";
import { RegisterSchema, RegisterSchemaType } from "@/schemas/RegisterSchema";
import bcrypt from "bcryptjs";
import z from "zod";

export const signUp = async (values: RegisterSchemaType) => {
  const validateFields = await RegisterSchema.safeParse(values);
  if (!validateFields.success) {
    const errorTree = z.treeifyError(validateFields.error);
    return {
      error: errorTree,
    };
  }

  const { name, email, password } = validateFields.data;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "User with this email already exists." };
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    // const emailVerificationToken = await generateEmailVerificationToken(email);

    // const { error } = await sendVerificationToken(
    //   emailVerificationToken.email,
    //   emailVerificationToken.token
    // );
    // if (error) {
    //   return { error: "something went wrong while sending verification email" };
    // }

    // return { success: "Verification email sent successfully" };
  } catch (err) {
    console.error("Error creating user:", err);
    return { error: "Server error while creating user" };
  }
};
