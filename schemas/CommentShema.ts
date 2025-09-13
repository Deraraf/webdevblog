import z from "zod";

export const CommentSchema = z.object({
  content: z
    .string()
    .min(4, { message: "Content should be at least 4 characters long" })
    .max(1000, { message: "Content should be less than 1000 characters long" }),
});

export type CommentSchemaType = z.infer<typeof CommentSchema>;
