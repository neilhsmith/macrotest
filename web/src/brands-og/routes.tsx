import { Outlet, RouteObject } from "react-router-dom"
import { number, route } from "react-router-typesafe-routes/dom"
import { BrandSummaryListing } from "./listing"
import { CreateBrandModal } from "./create-brand-modal"

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
  path: BRAND_ROUTES.INDEX.path,
  element: (
    <>
      <BrandSummaryListing />
      <Outlet />
    </>
  ),
  children: [
    {
      path: BRAND_ROUTES.CREATE.path,
      element: <CreateBrandModal isOpen={true} />, // always open
    },
    {
      path: BRAND_ROUTES.DETAIL.path,
      element: <div>brand detail</div>,
    },
  ],
}
