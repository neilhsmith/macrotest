import { AxiosResponse } from "axios"
import { z } from "zod"

export type PaginationParams = z.infer<typeof paginationParamsSchema>
export const paginationParamsSchema = z.object({
  page: z.number().catch(1),
  pageSize: z.number().catch(10),
})

export type PaginationMetadata = {
  totalCount: number
  pageSize: number
  currentPageSize: number
  currentStartIndex: number
  currentEndIndex: number
  pageNumber: number
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
}

export type PaginatedList<T> = {
  items: T[]
  paginationMetadata?: PaginationMetadata
}

export function getPaginationMetadata<T>(response: AxiosResponse<T>) {
  const header = response.headers["x-pagination"] as string | undefined
  if (!header) {
    return
  }

  return JSON.parse(header) as PaginationMetadata
}
