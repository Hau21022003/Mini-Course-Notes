import { noteApiRequest } from "@/api-requests/note";
import { buildPaginatedMeta, getVisiblePages } from "@/lib/pagination";
import { findAllSchema } from "@/schemas/note.schema";
import { useNoteStore } from "@/stores/note-store";
import type { Note } from "@/types/note.type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  defaultPaginationMeta,
  type PaginationMeta,
} from "@/types/pagination.type";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faLink,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { handleErrorApi } from "@/lib/error";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function NoteTable() {
  const { course, handleOpenSaveDialog } = useNoteStore();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [pageMeta, setPageMeta] = useState<PaginationMeta>(
    defaultPaginationMeta
  );
  const findAllForm = useForm({
    resolver: zodResolver(findAllSchema),
  });
  useEffect(() => {
    findAllForm.reset({ courseId: course?.id });
  }, [course]);

  const watchValues = findAllForm.watch();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const values = findAllForm.getValues();
        const res = await noteApiRequest.findAll(values);
        setNotes(res.payload.data);
        const newPageMeta = buildPaginatedMeta(
          res.payload.total,
          values.pageNumber || 1,
          values.pageSize || 10
        );
        setPageMeta(newPageMeta);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotes();
  }, [watchValues]);

  const deleteNote = async (noteId: string) => {
    try {
      await noteApiRequest.delete(noteId);
      navigate(`/admin/${course?.id}/notes`);
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  const visiblePages = getVisiblePages({
    currentPage: pageMeta.pageNumber,
    totalPages: pageMeta.totalPages,
  });

  return (
    <div className="p-4 rounded-md bg-white space-y-4">
      <div>
        <Input
          className="max-w-2xl"
          placeholder="Search title"
          onChange={(e) => findAllForm.setValue("title", e.target.value)}
        />
      </div>
      <Table className="text-gray-500 overflow-hidden border-collapse">
        <TableHeader>
          <TableRow className="">
            <TableHead className="font-medium text-gray-600 pl-4 rounded-tl-md rounded-bl-md">
              Image
            </TableHead>
            <TableHead className="font-medium text-gray-600  hidden sm:table-cell">
              Title
            </TableHead>
            <TableHead className="font-medium text-gray-600  hidden md:table-cell">
              Public
            </TableHead>
            <TableHead className="font-medium text-gray-600 text-right rounded-tr-md rounded-br-md">
              Act
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-base">
          {notes.map((note) => (
            <TableRow key={note.id} className={`py-4 border-b border-gray-200`}>
              <TableCell className="py-4 pl-4 text-black">
                <img
                  alt=""
                  src={note.contentUrl}
                  className="w-16 h-16 object-cover"
                />
              </TableCell>
              <TableCell className="py-4 text-black">{note.title}</TableCell>
              <TableCell className="py-4 text-black">
                {note.isPublic && (
                  <FontAwesomeIcon icon={faCircleCheck} size="lg" />
                )}
              </TableCell>
              <TableCell className="py-4 pr-4 text-black">
                <div className="flex justify-end gap-2">
                  {note.isPublic && (
                    <button
                      onClick={() => {
                        const link = `${window.location.origin}/share-note/${note.shareToken}`;
                        navigator.clipboard
                          .writeText(link)
                          .then(() => {
                            toast.success("Đã sao chép link ghi chú! 📋");
                          })
                          .catch(() => {
                            toast.error("Không thể sao chép link!");
                          });
                      }}
                      className="h-10 w-10 flex items-center bg-yellow-500 justify-center rounded-md cursor-pointer"
                    >
                      <FontAwesomeIcon
                        icon={faLink}
                        className="w-6 h-6"
                        size="lg"
                      />
                    </button>
                  )}

                  <button
                    onClick={() => handleOpenSaveDialog(note)}
                    className="h-10 w-10 flex items-center justify-center rounded-md bg-black cursor-pointer"
                  >
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      className="w-6 h-6 text-white"
                      size="lg"
                    />
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="h-10 w-10 flex items-center justify-center rounded-md bg-red-700 cursor-pointer"
                  >
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="w-6 h-6 text-white"
                      size="lg"
                    />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* visiblePages.length !== 0 && ( */}
      <div className="w-full flex justify-end items-center">
        {visiblePages.map((page, index) => (
          <div key={`${page}-${index}`}>
            {page === "..." ? (
              <p className="leading-none">...</p>
            ) : (
              <div
                onClick={() => findAllForm.setValue("pageNumber", Number(page))}
                className={cn(
                  "w-9 h-9 cursor-pointer flex items-center justify-center leading-none",
                  page === pageMeta.pageNumber &&
                    "border rounded-md border-gray-300"
                )}
              >
                {page}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* ) */}
    </div>
  );
}
