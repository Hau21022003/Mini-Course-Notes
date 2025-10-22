import { create } from "zustand";

type CourseDialogState = {
  openCourseDialog: boolean;
  isEdit: boolean;
  selectedCourseId?: string;
  handleOpenCourseDialog: (courseId?: string) => void;
  handleCloseCourseDialog: () => void;
};

export const useCourseDialogStore = create<CourseDialogState>((set) => ({
  openCourseDialog: false,
  isEdit: false,
  selectedCourseId: undefined,
  handleOpenCourseDialog: (courseId) =>
    set({
      openCourseDialog: true,
      isEdit: !!courseId,
      selectedCourseId: courseId,
    }),
  handleCloseCourseDialog: () =>
    set({
      openCourseDialog: false,
      isEdit: false,
      selectedCourseId: undefined,
    }),
}));
