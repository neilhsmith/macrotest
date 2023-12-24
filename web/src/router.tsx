import { Router, rootRouteWithContext } from "@tanstack/react-router"
import { App } from "@/app"
import { queryClient } from "@/query-client"
import { QueryClient } from "@tanstack/react-query"
import { timelineIndexRoute } from "./timeline/routes"
import { brandsIndexRoute } from "./brands/routes"

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

export const rootRoute = rootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: App,
})

const routeTree = rootRoute.addChildren([timelineIndexRoute, brandsIndexRoute])

export const router = new Router({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  context: {
    queryClient,
  },
})
