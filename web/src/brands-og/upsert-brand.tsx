import { FormEventHandler } from "react"
import { BRANDS_LISTING_QUERY_KEY, BrandSummaryDto, UpsertBrandDto } from "./types"
import { useMutation } from "@tanstack/react-query"
import { ApiError, createBrand, updateBrand } from "./api"
import { queryClient } from "@/lib/query-client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Modal, ModalDescription, ModalHeader, ModalProps, ModalTitle } from "@/modals/modal"
import { BRAND_ROUTES } from "./routes"
import { useNavigate } from "react-router-dom"

type CreateBrandModalProps = Pick<ModalProps, "isOpen">
type UpdateBrandModalProps = Pick<ModalProps, "isOpen"> & { brand: BrandSummaryDto }

type UpsertBrandProps = {
  brand?: UpsertBrandDto
  onCancel?: () => void
  onSubmit: (payload: UpsertBrandPayload) => Promise<BrandSummaryDto>
}

export const UpsertBrand = ({ brand, onCancel, onSubmit }: UpsertBrandProps) => {
  const upsertBrand = useMutation<BrandSummaryDto, ApiError, UpsertBrandPayload>({
    mutationFn: onSubmit,
    onSuccess: () => {
      // TODO: would prefer this to not have knowledge of the listing
      queryClient.invalidateQueries({ queryKey: [BRANDS_LISTING_QUERY_KEY] })
    },
  })

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string

    upsertBrand.mutate({
      payload: {
        name,
      },
    })
  }

  const disabled = upsertBrand.isPending
  const errors = upsertBrand.error?.errors ?? {}

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4 flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Brand name"
          autoFocus
          defaultValue={brand?.name}
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
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
        {!!onCancel && (
          <Button type="button" variant="secondary" disabled={disabled} onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={disabled}>
          Submit
        </Button>
      </div>
    </form>
  )
}

export function CreateBrandModal({ isOpen }: CreateBrandModalProps) {
  const navigate = useNavigate()

  const dismiss = () => {
    navigate(BRAND_ROUTES.INDEX.path)
  }

  return (
    <Modal isOpen={isOpen} onDismiss={dismiss}>
      <ModalHeader>
        <ModalTitle>Create Brand</ModalTitle>
        <ModalDescription>Lorem ipsum and stuff</ModalDescription>
      </ModalHeader>
      <UpsertBrand onCancel={dismiss} onSubmit={createBrand} />
    </Modal>
  )
}

export function UpdateBrandModal({ isOpen, brand }: UpdateBrandModalProps) {
  const navigate = useNavigate()

  const dismiss = () => {
    navigate(BRAND_ROUTES.INDEX.path)
  }

  const handleSubmit = (payload: UpsertBrandPayload) => {}

  return (
    <Modal isOpen={isOpen} onDismiss={dismiss}>
      <ModalHeader>
        <ModalTitle>Create Brand</ModalTitle>
        <ModalDescription>Lorem ipsum and stuff</ModalDescription>
      </ModalHeader>
      <UpsertBrand brand={brand} onCancel={dismiss} onSubmit={handleSubmit} />
    </Modal>
  )
}
