import { Outlet, RouteObject } from "react-router-dom"
import { number, route } from "react-router-typesafe-routes/dom"
import { BrandListing } from "./listing"
import { UpdateBrand } from "./upsert"

export const BRAND_ROUTES = route(
  "brands",
  {},
  {
    INDEX: route(""),
    DETAIL: route(":id", { params: { id: number().default(0) } }),
  }
)

export const brandRoutes: RouteObject = {
  path: BRAND_ROUTES.INDEX.path,
  element: (
    <>
      <BrandListing />
      <Outlet />
    </>
  ),
  children: [
    {
      path: BRAND_ROUTES.DETAIL.path,
      element: <UpdateBrand />,
    },
  ],
}
