import { Route } from "@tanstack/react-router"
import { brandsRoute } from "../router"

export const brandDetailsRoute = new Route({
  getParentRoute: () => brandsRoute,
  path: "$brandId",
  component: () => BrandsDetailRouteComponent,
})

function BrandsDetailRouteComponent() {
  return <div>brands index route component</div>
}
