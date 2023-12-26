import { axios } from "@/api/api-client"
import { PaginatedList, PaginationParams, getPaginationMetadata } from "@/api/pagination"
import { SuccessCallbackMutationConfig, queryClient } from "@/query-client"
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

export type BrandSummaryDto = {
  id: number
  createdAt: Date
  modifiedAt: Date | null

  name: string
  foodCount: number
}

export type UpsertBrandDto = {
  name: string
}

async function getBrand(id: number) {
  const res = await axios<BrandSummaryDto>({
    method: "get",
    url: `/brands/${id}`,
  })

  return res.data
}

async function getBrandListing({ page, pageSize }: PaginationParams) {
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

async function createBrand(data: UpsertBrandDto) {
  const res = await axios<BrandSummaryDto, UpsertBrandDto>({
    method: "post",
    url: "/brands",
    data,
  })

  return res.data
}

async function updateBrand(id: number, data: UpsertBrandDto) {
  const res = await axios<BrandSummaryDto, UpsertBrandDto>({
    method: "put",
    url: `/brands/${id}`,
    data,
  })

  return res.data
}

export async function deleteBrands({ ids }: { ids: number[] }) {
  await axios({
    method: "post",
    url: "/brands/delete",
    data: {
      ids,
    },
  })
}

export const BRAND_DETAIL_QUERY_KEY = "brand-detail" as const
export const BRAND_LISTING_QUERY_KEY = "brand-listing" as const

export const useBrandQuery = (id: number) =>
  useQuery({
    queryKey: [BRAND_DETAIL_QUERY_KEY, id],
    queryFn: () => getBrand(id),
  })

export const useBrandListingQuery = (payload: PaginationParams) =>
  useQuery({
    queryKey: [BRAND_LISTING_QUERY_KEY, payload.page, payload.pageSize],
    queryFn: () => getBrandListing(payload),
    placeholderData: keepPreviousData,
  })

export const useCreateBrandMutation = (config?: SuccessCallbackMutationConfig<BrandSummaryDto>) =>
  useMutation({
    mutationFn: createBrand,
    onSuccess: (data) => {
      config?.onSuccess && config.onSuccess(data)
      toast.success("Brand created.")
      queryClient.invalidateQueries({ queryKey: [BRAND_LISTING_QUERY_KEY] })
    },
  })

export const useUpdateBrandMutation = (config?: SuccessCallbackMutationConfig<BrandSummaryDto>) =>
  useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpsertBrandDto }) => updateBrand(id, data),
    onSuccess: (data) => {
      config?.onSuccess && config.onSuccess(data)
      toast.success("Brand updated.")
      queryClient.invalidateQueries({ queryKey: [BRAND_LISTING_QUERY_KEY] })
    },
  })

export const useDeleteBrandsMutation = (config?: SuccessCallbackMutationConfig) =>
  useMutation({
    mutationFn: (ids: number[]) => deleteBrands({ ids }),
    onSuccess: (_, ids) => {
      config?.onSuccess && config.onSuccess()
      toast.success(`Deleted ${ids.length} Brand${ids.length > 1 ? "s" : ""}.`)
      queryClient.invalidateQueries({ queryKey: [BRAND_LISTING_QUERY_KEY] })
    },
  })
