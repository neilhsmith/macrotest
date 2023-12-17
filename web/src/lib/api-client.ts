import axios, { type AxiosResponse } from "axios"

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
  result: T[]
  paginationMetadata?: PaginationMetadata
}

export const apiClient = axios.create({
  baseURL: "https://localhost:5020/api",
})

export function getPaginationMetadata<T>(response: AxiosResponse<T>) {
  const header = response.headers["x-pagination"] as string | undefined

  if (!header) return

  return JSON.parse(header) as PaginationMetadata
}
