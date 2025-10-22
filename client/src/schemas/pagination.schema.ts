import z from "zod";

export const PaginationBodySchema = z
  .object({
    pageNumber: z.number().int().min(1).default(1).optional(),
    pageSize: z.number().int().min(10).default(10).optional(),
  })
  .strict();

export type PaginationBody = z.TypeOf<typeof PaginationBodySchema>;
export const createPaginationBodySchema = <T extends z.ZodRawShape>(
  itemSchema: z.ZodObject<T>
) => PaginationBodySchema.merge(itemSchema);
