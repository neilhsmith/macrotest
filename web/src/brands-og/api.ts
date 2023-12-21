import { AxiosError, AxiosResponse } from "axios"
import { BrandSummaryDto, UpsertBrandDto } from "./types"
import { PaginatedList, axios, getPaginationMetadata } from "@/api/client"
import { toast } from "react-toastify"

export type ApiError = {
  detail: string
  errors: Record<string, string[]>
  status: number
  title: string
  traceId: string
  type: string
}

export async function getBrandSummaryListing(page: number, pageSize: number) {
  const res = await axios.get<BrandSummaryDto[]>(`/brands?PageNumber=${page}&PageSize=${pageSize}`)

  return {
    result: res.data,
    paginationMetadata: getPaginationMetadata(res),
  } as PaginatedList<BrandSummaryDto>
}

export async function createBrand(payload: UpsertBrandDto) {
  try {
    const res = await toast.promise<AxiosResponse<BrandSummaryDto>, AxiosError<ApiError>>(
      axios.post<BrandSummaryDto>("brands", {
        name: payload.name,
      }),
      {
        pending: "Creating Brand",
        success: "Brand created",
        error: {
          render: (res) => {
            const toastData = res.data
            const response = toastData?.response
            const message = response?.data?.title ?? "Something went wrong"
            return message
          },
        },
      }
    )

    return res.data
  } catch (err) {
    const error = err as AxiosError<ApiError>
    throw error.response?.data
  }
}

export async function updateBrand(payload: { id: number; data: UpsertBrandDto }) {
  try {
    const res = await toast.promise<AxiosResponse<BrandSummaryDto>, AxiosError<ApiError>>(
      axios.put<BrandSummaryDto>(`brands/${payload.id}`, payload.data),
      {
        pending: "Updating Brand",
        success: "Brand updated",
        error: {
          render: (res) => {
            const toastData = res.data
            const response = toastData?.response
            const message = response?.data?.title ?? "Something went wrong"
            return message
          },
        },
      }
    )

    return res.data
  } catch (err) {
    const error = err as AxiosError<ApiError>
    throw error.response?.data
  }
}

export async function deleteBrands(ids: number[]) {
  const count = ids.length
  const plural = count > 1
  await toast.promise(
    axios.post("/brands/delete", {
      ids,
    }),
    {
      pending: `Deleting ${count} Brand${plural ? "s" : ""}`,
      success: `${count} Brand${plural ? "s" : ""} deleted`,
      error: "Something went wrong",
    }
  )
}
