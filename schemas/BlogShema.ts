import { z } from "zod";

export const BlogSchema = z.object({
  userId: z.string().min(5),
  title: z
    .string()
    .min(10, "Title is too short")
    .max(150, "Title is too long")
    .transform((val) => val.toLowerCase()), // 🔥 lowercase title
  content: z
    .string()
    .min(10, "Content is too short")
    .max(1000, "Content is too long"),
  coverImage: z.string().optional(),
  tags: z.array(z.string().transform((val) => val.toLowerCase())), // 🔥 lowercase each tag
  isPublished: z.boolean(),
});

export type BlogFormType = z.infer<typeof BlogSchema>;
