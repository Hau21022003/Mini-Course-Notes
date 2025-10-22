import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useNoteStore } from "@/stores/note-store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createNoteSchema, type CreateNoteInput } from "@/schemas/note.schema";
import { handleErrorApi } from "@/lib/error";
import { noteApiRequest } from "@/api-requests/note";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import TextEditor from "@/components/text-editor";
import { useUploadFile } from "@/hooks/use-upload-file";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloud } from "@fortawesome/free-solid-svg-icons";
import RadioItem from "@/components/ratio-item";

export default function SaveNoteDialog() {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(createNoteSchema),
  });

  const { fileInputRef, handleFileChange, openFileDialog, isLoading } =
    useUploadFile();

  const { open, isEdit, handleCloseSaveDialog, course, selectedNote } =
    useNoteStore();
  const resetForm = () => {
    form.reset({ isPublic: false, courseId: course?.id });
  };
  useEffect(() => {
    resetForm();
  }, [course]);

  useEffect(() => {
    if (selectedNote)
      form.reset({
        ...selectedNote,
        contentUrl: selectedNote.contentUrl
          ? selectedNote.contentUrl
          : undefined,
      });
    else resetForm();
  }, [selectedNote]);

  const save = async (data: CreateNoteInput) => {
    try {
      if (selectedNote) {
        await noteApiRequest.update(selectedNote.id, data);
      } else {
        await noteApiRequest.create(data);
      }
      handleCloseSaveDialog();
      resetForm();
      navigate(`/admin/${course?.id}/notes`);
    } catch (error) {
      handleErrorApi({ error });
    }
  };
  return (
    <Dialog open={open} onOpenChange={handleCloseSaveDialog}>
      <DialogContent className="max-h-[90vh] overflow-y-auto flex flex-col">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit" : "Create New"} Note</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(
              (data) => {
                save(data);
              },
              (errors) => {
                console.log("error", errors);
                console.log("data", form.getValues());
              }
            )}
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
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormControl>
                    <div className="flex gap-8">
                      <RadioItem
                        value="true"
                        label="Public"
                        checked={field.value === true}
                        onChange={() => field.onChange(true)}
                      />
                      <RadioItem
                        value="false"
                        label="Private"
                        checked={field.value === false}
                        onChange={() => field.onChange(false)}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Description</FormLabel>
                  <TextEditor setValue={field.onChange} value={field.value} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border-2  border-dashed border-gray-300 rounded-lg h-48 w-full flex items-center justify-center">
              <div className="flex flex-col items-center space-y-2">
                {!form.watch("contentUrl") && (
                  <FontAwesomeIcon
                    icon={faCloud}
                    className="text-indigo-200 w-10 h-10"
                    size="4x"
                  />
                )}
                {form.watch("contentUrl") && (
                  <img
                    src={form.watch("contentUrl")}
                    className="w-20 h-20 object-cover shrink-0 rounded"
                  />
                )}
                <p className="text-gray-500">
                  Drag or drop video files to upload
                </p>
                <button
                  onClick={openFileDialog}
                  disabled={isLoading}
                  type="button"
                  className=" disabled:cursor-not-allowed cursor-pointer leading-none p-3 border-2 rounded-lg border-gray-300"
                >
                  {isLoading ? "Uploading" : "Select File"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const urlPromise = handleFileChange(e);
                    urlPromise.then((url) => {
                      if (url) {
                        form.setValue("contentUrl", url);
                      }
                    });
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
