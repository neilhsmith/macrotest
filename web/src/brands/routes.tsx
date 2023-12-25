import { rootRoute } from "@/router"
import { Route } from "@tanstack/react-router"
import { BrandsPage } from "./page"

export const brandsIndexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/brands",
  component: BrandsPage,
})

const brandDetailsRoute = new Route({
  getParentRoute: () => brandsIndexRoute,
  path: "/brands/$brandId",
  component: () => <div>dfadfasdf</div>,
})

brandsIndexRoute.addChildren([brandDetailsRoute])
