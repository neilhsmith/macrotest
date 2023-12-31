import { rootRoute } from "@/router"
import { Route } from "@tanstack/react-router"
import { BrandsLayout } from "./layout"
import { brandsIndexRoute } from "./routes"
import { brandDetailsRoute } from "./routes/details"

export const brandsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "brands",
  component: BrandsLayout,
})

brandsRoute.addChildren([brandsIndexRoute, brandDetailsRoute])
