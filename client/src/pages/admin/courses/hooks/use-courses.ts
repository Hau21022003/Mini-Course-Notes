import { courseApiRequest } from "@/api-requests/course";
import { handleErrorApi } from "@/lib/error";
import { type Course } from "@/types/course.type";
import {
  defaultPaginationMeta,
  type PaginationMeta,
} from "@/types/pagination.type";
import { buildPaginatedMeta } from "@/lib/pagination";
import { useEffect, useState } from "react";

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>(
    defaultPaginationMeta
  );
  const [currentPage, setCurrentPage] = useState(1);
  const loadCourses = async (pageNumber: number, pageSize: number = 10) => {
    try {
      const { data, total } = (
        await courseApiRequest.findAll({ pageSize, pageNumber })
      ).payload;

      if (pageNumber === 1) {
        setCourses(data);
      } else {
        setCourses((prev) => [...prev, ...data]);
      }
      const paginationMeta = buildPaginatedMeta(total, pageNumber, pageSize);
      setPaginationMeta(paginationMeta);
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  const loadCoursesNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  useEffect(() => {
    loadCourses(currentPage);
  }, [currentPage]);

  const resetCourses = () => {
    loadCourses(1);
    setPaginationMeta(defaultPaginationMeta);
    setCurrentPage(1);
  };

  return { courses, paginationMeta, loadCoursesNextPage, resetCourses };
}
