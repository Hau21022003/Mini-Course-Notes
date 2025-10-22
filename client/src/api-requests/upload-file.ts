import http from "@/lib/http";
import type { UploadRes } from "@/types/upload.type";

export const uploadFileApiRequest = {
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return http.post<UploadRes>("/upload", formData);
  },
};
