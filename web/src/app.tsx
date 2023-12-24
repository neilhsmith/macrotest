import { Outlet } from "@tanstack/react-router"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { TanStackRouterDevtools } from "@tanstack/router-devtools"
import { Toaster } from "@/components/ui/sonner"
import { Header } from "./header"

export function App() {
  return (
    <>
      <div className="bg-slate-50 h-screen">
        <div className="container mx-auto flex flex-col justify-start gap-y-8">
          <Header />
          <Outlet />
        </div>
      </div>
      <Toaster />
      <ReactQueryDevtools />
      <TanStackRouterDevtools />
    </>
  )
}
