import SaveCourseDialog from "@/pages/admin/courses/components/save-course-dialog";
import { useCourseDialogStore } from "@/pages/admin/courses/store/use-course-dialog-store";
import { useCourses } from "@/pages/admin/courses/hooks/use-courses";
import { cn } from "@/lib/utils";
import CourseList from "@/pages/admin/courses/components/course-list";

export default function CoursesPage() {
  const { handleOpenCourseDialog } = useCourseDialogStore();
  const { courses, loadCoursesNextPage, paginationMeta, resetCourses } =
    useCourses();

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8 flex flex-col items-center">
      <div className="w-full max-w-screen-lg mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-2xl font-medium">Course</p>
          <div
            onClick={() => handleOpenCourseDialog()}
            className={cn(
              "px-4 py-3 leading-none cursor-pointer",
              "text-white bg-indigo-500 rounded-lg"
            )}
          >
            New Course
          </div>
        </div>
        <CourseList courses={courses} resetCourses={resetCourses} />
        {paginationMeta.hasNextPage && (
          <div className="flex justify-center">
            <button
              onClick={() => loadCoursesNextPage()}
              className="font-medium cursor-pointer px-4 py-3 rounded-lg bg-gray-300 leading-none"
            >
              SHOW MORE
            </button>
          </div>
        )}
      </div>
      <SaveCourseDialog resetCourses={resetCourses} />
    </div>
  );
}
