import { axios } from "@/api/api-client"
import { queryOptions } from "@tanstack/react-query"

export type BrandSummaryDto = {
  id: number
  createdAt: Date
  modifiedAt: Date | null

  name: string
  foodCount: number
}

async function fetchBrand(id: number) {
  const res = await axios<BrandSummaryDto>({
    method: "get",
    url: `/brands/${id}`,
  })

  return res.data
}

export function brandQueryOptions(brandId: number) {
  return queryOptions({
    queryKey: ["brands", { brandId }],
    queryFn: () => fetchBrand(brandId),
  })
}
