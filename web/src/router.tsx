import { createBrowserRouter } from "react-router-dom"
import App from "./app"
import { brandRoutes } from "./brands/routes"
import { Timeline } from "./timeline/timeline"

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      brandRoutes,
      {
        path: "/",
        element: <Timeline />,
      },
    ],
  },
])
