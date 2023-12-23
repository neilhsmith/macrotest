import { ApiError } from "@/api/api-client"
import { QueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: ApiError
  }
}

export type ErrorCallbackMutationConfig = {
  onError?: (error: ApiError) => void
}
export type SuccessCallbackMutationConfig<T = void> = {
  onSuccess?: (data: T) => void
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
        message = err.title
      }

      toast.error(message)
    },
  },
})
