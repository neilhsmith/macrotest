import { rootRoute } from "@/router"
import { Route } from "@tanstack/react-router"
import { BrandsPage } from "./page"
import { BrandsListing } from "./listing"

export const brandsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "brands",
  component: BrandsPage,
})

const brandsIndexRoute = new Route({
  getParentRoute: () => brandsRoute,
  path: "/",
  component: BrandsListing,
})

const brandDetailsRoute = new Route({
  getParentRoute: () => brandsRoute,
  path: "$brandId",
  component: () => <div>dfadfasdf</div>,
})

brandsRoute.addChildren([brandsIndexRoute, brandDetailsRoute])
