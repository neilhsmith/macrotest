import { Route, useNavigate } from "@tanstack/react-router"
import { paginationParamsSchema } from "@/api/pagination"
import { brandsRoute } from "../router"
import { useCallback } from "react"

export const brandsListingRoute = new Route({
  getParentRoute: () => brandsRoute,
  path: "/",
  component: BrandsIndexRouteComponent,
  validateSearch: (search) => paginationParamsSchema.parse(search),
})

function BrandsIndexRouteComponent() {
  const { page, pageSize } = brandsListingRoute.useSearch()
  const navigate = useNavigate({ from: "/brands" })

  const changePage = useCallback(
    (page: number) => {
      navigate({
        to: "/brands",
        search: {
          page,
          pageSize,
        },
      })
    },
    [navigate, pageSize]
  )

  const changePageSize = useCallback(
    (pageSize: number) => {
      navigate({
        to: "/brands",
        search: {
          page,
          pageSize,
        },
      })
    },
    [navigate, page]
  )

  return (
    <div>
      <button onClick={() => changePage(page + 1)}>asdf</button>
      <button onClick={() => changePageSize(pageSize + 1)}>fdfdf</button>
      brands index route component - {page}, {pageSize}
    </div>
  )
}
