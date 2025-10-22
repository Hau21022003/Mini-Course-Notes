import { courseApiRequest } from "@/api-requests/course";
import { useCourseDialogStore } from "@/pages/admin/courses/store/use-course-dialog-store";
import { handleErrorApi } from "@/lib/error";
import { cn } from "@/lib/utils";
import { type Course } from "@/types/course.type";
import { formatDateWithRelative } from "@/lib/time";
import {
  faNoteSticky,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment } from "react";

export default function CourseList({
  courses,
  resetCourses,
}: {
  courses: Course[];
  resetCourses: () => void;
}) {
  const { handleOpenCourseDialog } = useCourseDialogStore();
  const deleteCourse = async (courseId: string) => {
    try {
      await courseApiRequest.remove(courseId);
      resetCourses();
    } catch (error) {
      handleErrorApi({ error });
    }
  };
  return (
    <Fragment>
      {courses?.map((course) => (
        <div
          key={course.id}
          className={cn(
            "bg-white p-4 rounded-lg",
            "flex flex-col md:flex-row gap-4",
            ""
          )}
        >
          <img
            src={course.thumbnailUrl}
            alt=""
            className="w-full aspect-square md:w-30 md:h-30 object-cover shrink-0"
          />
          <div className="flex-1 flex flex-col gap-4 md:justify-between md:flex-row">
            <div className="flex-1 space-y-2">
              <p className="line-clamp-1 text-xl">{course.title}</p>
              <p className="text-gray-400">
                {formatDateWithRelative(course.createdAt)}
              </p>
            </div>
            <div className="shrink-0 flex gap-4 items-start">
              <a
                href={`/admin/${course.id}/notes`}
                title="Notes"
                className="cursor-pointer font-medium px-2 h-10 flex items-center justify-center leading-none bg-yellow-400 rounded-md"
              >
                <FontAwesomeIcon
                  icon={faNoteSticky}
                  size="lg"
                  className="w-7 h-7"
                />
                <p className="leading-none pl-1">Notes</p>
              </a>
              <div
                title="Edit"
                onClick={() => handleOpenCourseDialog(course.id)}
                className="cursor-pointer font-medium px-2 h-10 flex items-center justify-center leading-none bg-indigo-500 text-white rounded-md"
              >
                <FontAwesomeIcon icon={faPen} size="lg" className="w-7 h-7" />
                <p className="leading-none pl-1">Edit</p>
              </div>
              <div
                title="Delete"
                onClick={() => deleteCourse(course.id)}
                className="cursor-pointer font-medium px-2 h-10 flex items-center justify-center leading-none bg-black text-white rounded-md"
              >
                <FontAwesomeIcon icon={faTrash} size="lg" className="w-7 h-7" />
                <p className="leading-none pl-1">Delete</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </Fragment>
  );
}
