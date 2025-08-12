import { v4 as uuidv4 } from "uuid";
import { db } from "./db";
import { Resend } from "resend";

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findUnique({
      where: { token },
    });
    return passwordResetToken;
  } catch (error) {
    console.error("Error fetching password reset token:", error);
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findFirst({
      where: { email },
    });
    return passwordResetToken;
  } catch (error) {
    console.error("Error fetching password reset token:", error);
    return null;
  }
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);
  if (existingToken) {
    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
  return passwordResetToken;
};

export const sendPasswordResetToken = async (email: string, token: string) => {
  const resend = new Resend(process.env.RESEND_API_KEY!);

  const passwordResetLink = `${process.env.BASE_URL}/password-reset-form?token=${token}`;

  const res = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Reset your password",
    html: `<p>Click the link to reset your password:</p>
        <p><a href="${passwordResetLink}">click here</a> to reset your password</p>`,
  });

  return { error: res.error };
};
