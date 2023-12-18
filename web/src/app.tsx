import { QueryClientProvider } from "@tanstack/react-query"
import { Outlet } from "react-router-dom"
import { Header } from "./header"
import { queryClient } from "./lib/query-client"

function App() {
  return (
    <div className="bg-slate-50 h-screen">
      <div className="container mx-auto flex flex-col justify-start gap-y-8">
        <Header />
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>
      </div>
    </div>
  )
}

export default App
