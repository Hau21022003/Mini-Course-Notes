import type { Course } from "@/types/course.type";
import type { Note } from "@/types/note.type";
import { create } from "zustand";

interface NoteState {
  course?: Course;
  setCourse: (course: Course) => void;
  open: boolean;
  isEdit: boolean;
  selectedNote?: Note;
  handleOpenSaveDialog: (note?: Note) => void;
  handleCloseSaveDialog: () => void;
}

export const useNoteStore = create<NoteState>((set) => ({
  course: undefined,
  setCourse: (course) => set({ course }),
  open: false,
  isEdit: false,
  selectedNote: undefined,
  handleOpenSaveDialog: (note) => {
    set({
      open: true,
      isEdit: !!note,
      selectedNote: note,
    });
  },
  handleCloseSaveDialog: () => {
    set({
      open: false,
      isEdit: false,
      selectedNote: undefined,
    });
  },
}));
