import { v4 as uuidv4 } from "uuid";
import { db } from "./db";
import { Resend } from "resend";

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.emailVerificationToken.findFirst({
      where: { email },
    });
    return verificationToken;
  } catch (error) {
    console.error("Error fetching verification token:", error);
    return null;
  }
};

export const generateEmailVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await db.emailVerificationToken.delete({
      where: { id: existingToken.id },
    });
  }

  const emailVerificationToken = await db.emailVerificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
  return emailVerificationToken;
};

export const sendVerificationToken = async (email: string, token: string) => {
  const resend = new Resend(process.env.RESEND_API_KEY!);

  const emailVerificationLink = `${process.env.BASE_URL}/email-verification?token=${token}`;

  const res = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Verify your email",
    html: `<p>Click the link to verify your email address:</p>
        <p><a href="${emailVerificationLink}">click here</a> to verify your email</p>`,
  });

  return { error: res.error };
};
