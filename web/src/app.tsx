import { QueryClientProvider } from "@tanstack/react-query"
import { Outlet } from "react-router-dom"
import { Header } from "./header"
import { queryClient } from "./lib/query-client"
import { Toaster } from "react-hot-toast"

function App() {
  return (
    <>
      <div className="bg-slate-50 h-screen">
        <div className="container mx-auto flex flex-col justify-start gap-y-8">
          <Header />
          <QueryClientProvider client={queryClient}>
            <Outlet />
          </QueryClientProvider>
        </div>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  )
}

export default App
