import { rootRoute } from "@/router"
import { Route } from "@tanstack/react-router"
import { BrandsLayout } from "./layout"
import { BrandsListing } from "./listing"
import { paginationParamsSchema } from "@/api/pagination"

export const brandsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "brands",
  component: BrandsLayout,
})

const brandsIndexRoute = new Route({
  getParentRoute: () => brandsRoute,
  path: "/",
  component: BrandsListing,
  validateSearch: (search) => paginationParamsSchema.parse(search),
})

const brandDetailsRoute = new Route({
  getParentRoute: () => brandsRoute,
  path: "$brandId",
  component: () => <div>dfadfasdf</div>,
})

brandsRoute.addChildren([brandsIndexRoute, brandDetailsRoute])
