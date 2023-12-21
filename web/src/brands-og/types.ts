export const BRANDS_LISTING_QUERY_KEY = "brand-summary-list" as const

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

export type UpsertBrandPayload = {
  id?: number
  payload: UpsertBrandDto
}
