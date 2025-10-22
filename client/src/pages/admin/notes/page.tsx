import { courseApiRequest } from "@/api-requests/course";
import { handleErrorApi } from "@/lib/error";
import { cn } from "@/lib/utils";
import NoteTable from "@/pages/admin/notes/components/note-table";
import SaveNoteDialog from "@/pages/admin/notes/components/save-note-dialog";
import { useNoteStore } from "@/stores/note-store";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function NotesPage() {
  const { courseId } = useParams();
  const { setCourse, course, handleOpenSaveDialog } = useNoteStore();

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const rsp = await courseApiRequest.findOne(courseId || "");
        setCourse(rsp.payload);
      } catch (error) {
        handleErrorApi({ error });
      }
    };
    loadCourse();
  }, []);

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8 flex flex-col items-center">
      <div className="w-full max-w-screen-lg mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-2xl font-medium">Notes</p>
            <p className="">Course: {course?.title}</p>
          </div>

          <div
            onClick={() => handleOpenSaveDialog()}
            className={cn(
              "px-4 py-3 leading-none cursor-pointer",
              "text-white bg-indigo-500 rounded-lg font-medium"
            )}
          >
            New Note
          </div>
        </div>
        <NoteTable />
      </div>
      <SaveNoteDialog />
    </div>
  );
}
