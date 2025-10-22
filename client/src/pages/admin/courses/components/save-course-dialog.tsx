import { type CourseBody, CourseBodySchema } from "@/schemas/course.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCourseDialogStore } from "@/pages/admin/courses/store/use-course-dialog-store";
import { ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUploadFile } from "@/hooks/use-upload-file";
import { handleErrorApi } from "@/lib/error";
import { courseApiRequest } from "@/api-requests/course";

export default function SaveCourseDialog({
  resetCourses,
}: {
  resetCourses: () => void;
}) {
  const { fileInputRef, handleFileChange, openFileDialog } = useUploadFile();
  const {
    handleCloseCourseDialog,
    openCourseDialog,
    isEdit,
    selectedCourseId,
  } = useCourseDialogStore();
  const form = useForm({
    resolver: zodResolver(CourseBodySchema),
    defaultValues: {},
  });

  useEffect(() => {
    const loadSelectedCourse = async () => {
      if (!selectedCourseId) return;
      try {
        const course = (await courseApiRequest.findOne(selectedCourseId))
          .payload;
        form.reset(course);
      } catch (error) {
        handleErrorApi({ error });
      }
    };
    loadSelectedCourse();
  }, [selectedCourseId]);

  const onClose = () => {
    form.reset({});
    handleCloseCourseDialog();
  };

  const saveCourse = async (data: CourseBody) => {
    try {
      if (isEdit && selectedCourseId) {
        await courseApiRequest.update(selectedCourseId, data);
      } else {
        await courseApiRequest.create(data);
      }
      resetCourses();
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };

  return (
    <Dialog open={openCourseDialog} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto flex flex-col">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit" : "Create New"} Course</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit((data) => {
              saveCourse(data);
            })}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Title</FormLabel>
                  <Input
                    className="bg-white"
                    placeholder="Enter course title"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="flex items-start gap-4">
                <div
                  className="cursor-pointer relative group"
                  onClick={openFileDialog}
                >
                  {form.watch("thumbnailUrl") && (
                    <div className="relative w-30 h-30">
                      <img
                        className="w-full h-full rounded-md object-cover"
                        src={form.watch("thumbnailUrl")}
                        alt=""
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                        <ImagePlus className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  )}
                  {!form.watch("thumbnailUrl") && (
                    <div
                      className={cn(
                        form.formState.errors.thumbnailUrl
                          ? "border-red-300 text-red-300"
                          : "border-gray-200 text-gray-400",
                        "w-20 h-20 flex items-center justify-center border-2 border-dashed rounded-md"
                      )}
                    >
                      <ImagePlus className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div
                  onClick={openFileDialog}
                  className="md:hidden text-sm font-medium leading-none px-4 py-3 rounded-md bg-indigo-500 text-white"
                >
                  Upload
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const imageUrlPromise = handleFileChange(e);
                    imageUrlPromise
                      .then((imageUrl) => {
                        if (imageUrl) form.setValue("thumbnailUrl", imageUrl);
                      })
                      .catch((e) => console.log("error", e));
                  }}
                  hidden
                />
              </div>
            </div>

            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg !bg-black text-white font-medium text-sm"
              >
                Submit
              </button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
