import { createPaginationBodySchema } from "@/schemas/pagination.schema";
import z from "zod";

export const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().default(""),
  contentUrl: z.string().url("contentUrl must be a valid URL").optional(),
  courseId: z.string().uuid("courseId must be a valid UUID"),
  isPublic: z.boolean().optional().default(false),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;

export const findAllSchema = createPaginationBodySchema(
  z.object({
    title: z.string().optional(),
    courseId: z.string().uuid("courseId must be a valid UUID"),
  })
);
export type FindAllBody = z.infer<typeof findAllSchema>;
