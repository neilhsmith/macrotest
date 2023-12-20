import {
  Modal,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalProps,
  ModalTitle,
} from "@/modals/modal"
import { useNavigate } from "react-router-dom"
import { BRAND_ROUTES } from "./routes"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useMutation } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { BrandSummary } from "./types"
import { FormEventHandler } from "react"
import { Button } from "@/components/ui/button"
import { queryClient } from "@/lib/query-client"
import { toast } from "react-toastify"
import { AxiosError, AxiosResponse } from "axios"

type ApiError = {
  detail: string
  errors: Record<string, string[]>
  status: number
  title: string
  traceId: string
  type: string
}

async function createBrand(name: string) {
  try {
    const res = await toast.promise<AxiosResponse<BrandSummary>, AxiosError<ApiError>>(
      apiClient.post<BrandSummary>("brands", {
        name,
      }),
      {
        pending: "Creating Brand",
        success: "Brand created",
        error: {
          render: (res) => {
            const toastData = res.data
            const response = toastData?.response
            const message = response?.data?.title ?? "Something went wrong"
            return message
          },
        },
      }
    )

    return res.data
  } catch (err) {
    const error = err as AxiosError<ApiError>
    throw error.response?.data
  }
}

type CreateBrandModal = Pick<ModalProps, "isOpen">

export const CreateBrandModal = ({ isOpen }: CreateBrandModal) => {
  const navigate = useNavigate()

  const createBrandMutation = useMutation<BrandSummary, ApiError, string, unknown>({
    mutationFn: createBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brand-summary-list"] })
      dismiss()
    },
  })

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string

    createBrandMutation.mutate(name)
  }

  const dismiss = () => {
    navigate(BRAND_ROUTES.INDEX.path)
  }

  const disabled = createBrandMutation.isPending
  const errors = createBrandMutation.error?.errors ?? {}

  return (
    <Modal isOpen={isOpen} onDismiss={dismiss}>
      <ModalHeader>
        <ModalTitle>Create Brand</ModalTitle>
        <ModalDescription>Lorem ipsum and stuff</ModalDescription>
      </ModalHeader>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Brand name"
            autoFocus
            className={`${!!errors["name"] && "border-red-500"}`}
          />
          {!!errors["name"] && (
            <ul>
              {errors["name"].map((err) => (
                <li
                  key={err}
                  className="text-red-500 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {err}
                </li>
              ))}
            </ul>
          )}
        </div>
        <ModalFooter>
          <Button type="button" variant="secondary" disabled={disabled} onClick={dismiss}>
            Cancel
          </Button>
          <Button type="submit" disabled={disabled}>
            Submit
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
