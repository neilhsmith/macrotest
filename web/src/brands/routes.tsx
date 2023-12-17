import { RouteObject } from "react-router-dom"
import { Layout } from "./layout"
import { number, route } from "react-router-typesafe-routes/dom"
import { BrandSummaryListing } from "./listing"

export const BRAND_ROUTES = route(
  "brands",
  {},
  {
    INDEX: route(""),
    CREATE: route("create", {}),
    DETAIL: route(":id", { params: { id: number().default(0) } }),
  }
)

export const brandRoutes: RouteObject = {
  path: BRAND_ROUTES.path,
  element: <Layout />,
  children: [
    {
      path: BRAND_ROUTES.INDEX.path,
      element: <BrandSummaryListing />,
    },
    {
      path: BRAND_ROUTES.CREATE.path,
      element: <div>create brand</div>,
    },
    {
      path: BRAND_ROUTES.DETAIL.path,
      element: <div>brand detail</div>,
    },
  ],
}
