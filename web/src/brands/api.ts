import { axios } from "@/api/api-client"
import { PaginatedList, PaginatedQueryPayload, getPaginationMetadata } from "@/api/pagination"
import { SuccessCallbackConfig, queryClient } from "@/lib/query-client"
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"

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

export async function deleteBrands({ ids }: { ids: number[] }) {
  await axios({
    method: "post",
    url: "/brands/delete",
    data: {
      ids,
    },
  })
}

export const BRAND_LISTING_QUERY_KEY = "brand-listing" as const

export const useBrandListingQuery = (payload: PaginatedQueryPayload) =>
  useQuery({
    queryKey: [BRAND_LISTING_QUERY_KEY, payload.page, payload.pageSize],
    queryFn: () => getBrandListing(payload),
    placeholderData: keepPreviousData,
  })

export const useDeleteBrandsMutation = (config: SuccessCallbackConfig) =>
  useMutation({
    mutationFn: (ids: number[]) => deleteBrands({ ids }),
    onSuccess: (_, ids) => {
      config.onSuccess && config.onSuccess()
      toast.success(`Deleted ${ids.length} Brand${ids.length > 1 ? "s" : ""}.`)
      queryClient.invalidateQueries({ queryKey: [BRAND_LISTING_QUERY_KEY] })
    },
  })
