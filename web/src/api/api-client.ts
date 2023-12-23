import axiosLib, { AxiosError, AxiosRequestConfig } from "axios"

export type ApiError = {
  detail: string
  errors: Record<string, string[]>
  status: number
  title: string
  traceId: string
  type: string
}

const instance = axiosLib.create({
  baseURL: "https://localhost:5020/api",
})

instance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // the server responded with a status code that falls out of the range of 2xx
      return Promise.reject(error.response.data)
    } else if (error.request) {
      // the request was made but no response was received
      return Promise.reject(new Error("No response received"))
    } else {
      // something happened in setting up the request that triggered an Error
      return Promise.reject(new Error(error.message))
    }
  }
)

export function axios<TResult, TData = void>(config: AxiosRequestConfig<TData>) {
  return instance.request<TResult>({
    headers: {
      "Content-Type": "application/json",
      ...config.headers,
    },
    ...config,
  })
}
