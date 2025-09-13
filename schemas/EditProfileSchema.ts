import z, { email } from "zod";

export const EditProfileSchema = z.object({
  name: z.string().min(4, "Name is too short").max(50, "Name is too long"),
  email: email(),
  bio: z.string().min(2, "Bio is too short").max(200, "Bio is too long"),
  tags: z.array(z.string()).min(1, "Select at least one tag"),
});

export type EditProfileFormType = z.infer<typeof EditProfileSchema>;
