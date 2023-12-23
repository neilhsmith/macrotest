import { ApiError } from "@/api/api-client"
import { QueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: ApiError
  }
}

export type ErrorCallbackConfig = {
  onError?: () => void
}
export type SuccessCallbackConfig = {
  onSuccess?: () => void
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

queryClient.setDefaultOptions({
  mutations: {
    onError: (err) => {
      let message = "Something went wrong. Please try again later."

      if (err.status === 422) {
        message = err.detail
      }

      toast.error(message)
    },
  },
})
