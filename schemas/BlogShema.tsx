import { z } from "zod";

export const BlogSchema = z.object({
  userId: z.string().min(5),
  title: z.string().min(10, "Title is too short").max(150, "Title is too long"),
  content: z
    .string()
    .min(10, "Content is too short")
    .max(500, "Content is too long"),
  coverImage: z.string().optional(),
  tags: z.array(z.string()),
  isPublished: z.boolean(),
  authorId: z.string().min(5),
});

export type BlogFormType = z.infer<typeof BlogSchema>;
