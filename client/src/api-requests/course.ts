import http from "@/lib/http";
import { type CourseBody } from "@/schemas/course.schema";
import { type PaginationBody } from "@/schemas/pagination.schema";
import { type Course } from "@/types/course.type";
import { type PaginationResponse } from "@/types/pagination.type";
import { type UploadRes } from "@/types/upload.type";

const BASE_URL = "course";
export const courseApiRequest = {
  create: (body: CourseBody) => http.post<Course>(`${BASE_URL}`, body),
  update: (id: string, body: CourseBody) =>
    http.put<Course>(`${BASE_URL}/${id}`, body),
  findOne: (id: string) => http.get<Course>(`${BASE_URL}/${id}`),
  findAll: (body: PaginationBody) =>
    http.post<PaginationResponse<Course>>(`${BASE_URL}/find-all`, body),
  remove: (id: string) => http.delete<Course>(`${BASE_URL}/${id}`),
  upload: (body: FormData) => http.post<UploadRes>(`${BASE_URL}/upload`, body),
};
