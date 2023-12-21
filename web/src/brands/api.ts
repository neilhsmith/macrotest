import { ApiError, axios } from "@/api/client"
import { PaginatedList, PaginatedQueryPayload, getPaginationMetadata } from "@/api/pagination"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { toast } from "react-toastify"

export type BrandSummaryDto = {
  id: number
  createdAt: Date
  modifiedAt: Date | null

  name: string
  foodCount: number
}

async function getBrandListing({ page, pageSize }: PaginatedQueryPayload) {
  const res = await axios<BrandSummaryDto[]>({
    method: "get",
    url: `/brands`,
    params: {
      PageNumber: page,
      PageSize: pageSize,
    },
  })

  return {
    items: res.data,
    paginationMetadata: getPaginationMetadata(res),
  } as PaginatedList<BrandSummaryDto>
}

async function createBrand() {}

async function updateBrand() {}

async function deleteBrands() {}

export const BRAND_LISTING_QUERY_KEY = "brand-listing" as const

export const useBrandListingQuery = (payload: PaginatedQueryPayload) =>
  useQuery<PaginatedList<BrandSummaryDto>, ApiError>({
    placeholderData: keepPreviousData,
    queryKey: [BRAND_LISTING_QUERY_KEY, payload.page, payload.pageSize],
    queryFn: () =>
      toast.promise(getBrandListing(payload), {
        error: "Something went wrong. Please try again later.",
      }),
  })
