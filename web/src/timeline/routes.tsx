import { Route } from "@tanstack/react-router"
import { rootRoute } from "@/router"
import { TimelinePage } from "./page"

export const timelineIndexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: TimelinePage,
})
