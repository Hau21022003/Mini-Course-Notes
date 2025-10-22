import type { CreateNoteInput } from "@/schemas/note.schema";
import type { Course } from "@/types/course.type";

export type Note = CreateNoteInput & {
  id: string;
  course?: Course;
  shareToken?: string;
};
