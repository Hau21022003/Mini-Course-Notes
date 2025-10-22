import http from "@/lib/http";
import type { CreateNoteInput, FindAllBody } from "@/schemas/note.schema";
import type { Note } from "@/types/note.type";
import type { PaginationResponse } from "@/types/pagination.type";

const BASE_URL = "/note";
export const noteApiRequest = {
  create: (body: CreateNoteInput) => http.post<Note>(BASE_URL, body),
  update: (id: string, body: CreateNoteInput) =>
    http.put<Note>(`${BASE_URL}/${id}`, body),
  delete: (id: string) => http.delete<Note>(`${BASE_URL}/${id}`),
  findOne: (id: string) => http.get<Note>(`${BASE_URL}/${id}`),
  findOnePublic: (shareToken: string) =>
    http.get<Note>(`${BASE_URL}/${shareToken}/share`),
  findAll: (body: FindAllBody) =>
    http.post<PaginationResponse<Note>>(`${BASE_URL}/find-all`, body),
};
