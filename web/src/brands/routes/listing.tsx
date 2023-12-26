import { Route } from "@tanstack/react-router"
import { paginationParamsSchema } from "@/api/pagination"
import { brandsRoute } from "../router"

export const brandsListingRoute = new Route({
  getParentRoute: () => brandsRoute,
  path: "/",
  component: BrandsIndexRouteComponent,
  validateSearch: (search) => paginationParamsSchema.parse(search),
})

function BrandsIndexRouteComponent() {
  const { page, pageSize } = brandsListingRoute.useSearch()

  return (
    <div>
      brands index route component - {page}, {pageSize}
    </div>
  )
}
