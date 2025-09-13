"use server";

import { LoginSchema, LoginSchemaType } from "@/schemas/LoginSchema";
import { getUserByEmail } from "@/lib/user";
import { signIn } from "@/auth";
import {
  generateEmailVerificationToken,
  sendVerificationToken,
} from "@/lib/emailVerification";

export async function login(values: LoginSchemaType) {
  const validateFields = LoginSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password } = validateFields.data;

  const user = await getUserByEmail(email);

  if (!user || !user.password) {
    return { error: "Invalid email or password" };
  }

  // if (!user.emailVerified) {
  //   const emailVerificationToken = await generateEmailVerificationToken(
  //     user.email
  //   );

  //   const { error } = await sendVerificationToken(
  //     emailVerificationToken.email,
  //     emailVerificationToken.token
  //   );
  //   if (error) {
  //     return { error: "something went wrong while sending verification email" };
  //   }

  //   return { success: "Verification email sent successfully" };
  // }

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { error: result.error };
    }

    return { success: "Login successful" };
  } catch (error) {
    console.log(error);
    return { error: "Invalid email or password" };
  }
}

// "use server";

// import { cookies } from "next/headers";
// import bcrypt from "bcryptjs";
// import { LoginSchema, LoginSchemaType } from "@/schemas/LoginSchema";
// import z from "zod";
// import { getUserByEmail } from "@/lib/user";

// export async function loginUser(values: LoginSchemaType) {
//   const validateFields = await LoginSchema.safeParse(values);
//   if (!validateFields.success) {
//     const errorTree = z.treeifyError(validateFields.error);
//     return {
//       error: errorTree,
//     };
//   }
//   const { email, password } = validateFields.data;

//   const user = await getUserByEmail(email);

//   if (!user) {
//     return { error: "user not found" };
//   }
//   // Check if the user has a password set
//   if (!user.password) {
//     return { error: "Invalid email or password" };
//   }

//   const isPasswordValid = await bcrypt.compare(password, user.password);

//   if (!isPasswordValid) {
//     return { error: "Invalid email or password" };
//   }

//   // Create a simple JWT or session token (or use user id/email)
//   const token = JSON.stringify({ id: user.id, email: user.email });

//   // Store in cookie
//   const cookieStore = await cookies();
//   cookieStore.set("session", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     maxAge: 60 * 60 * 24 * 7, // 7 days
//     path: "/",
//   });

//   return { success: true };
// }
