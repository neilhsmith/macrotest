import { AxiosResponse } from "axios"

export type PaginatedQueryPayload = {
  page: number
  pageSize: number
}

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
