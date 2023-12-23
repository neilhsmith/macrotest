import { FormEventHandler, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Modal, ModalHeader, ModalProps, ModalTitle } from "@/modals/modal"
import { FiPlus, FiSlash } from "react-icons/fi"
import {
  UpsertBrandDto,
  useBrandQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
} from "./api"
import { useTypedParams } from "react-router-typesafe-routes/dom"
import { BRAND_ROUTES } from "./routes"
import { useNavigate } from "react-router-dom"
import { Skeleton } from "@/components/ui/skeleton"

export function CreateBrandTrigger() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button size="sm" variant="secondary" icon={<FiPlus />} onClick={() => setIsOpen(true)}>
        Create Brand
      </Button>
      {isOpen && <CreateBrandModal onDismiss={() => setIsOpen(false)} />}
    </>
  )
}

export function UpdateBrand() {
  const navigate = useNavigate()
  const { id } = useTypedParams(BRAND_ROUTES.DETAIL)

  const dismiss = () => navigate(BRAND_ROUTES.INDEX.path)

  return <UpdateBrandModal id={id} onDismiss={dismiss} />
}

function CreateBrandModal({ onDismiss }: Omit<ModalProps, "isOpen">) {
  const createBrandMutation = useCreateBrandMutation({
    onSuccess: onDismiss,
  })

  return (
    <Modal isOpen={true} onDismiss={onDismiss}>
      <ModalHeader>
        <ModalTitle>Create Brand</ModalTitle>
      </ModalHeader>
      <UpsertBrandForm
        loading={createBrandMutation.isPending}
        errors={createBrandMutation.error?.errors}
        onCancel={onDismiss}
        onSubmit={createBrandMutation.mutate}
      />
    </Modal>
  )
}

function UpdateBrandModal({ id, onDismiss }: { id: number } & Omit<ModalProps, "isOpen">) {
  const getBrandQuery = useBrandQuery(id)
  const updateBrandMutation = useUpdateBrandMutation({
    onSuccess: () => onDismiss(),
  })

  const handleSubmit = (data: UpsertBrandDto) => {
    updateBrandMutation.mutate({ id, data })
  }

  return (
    <Modal isOpen={true} onDismiss={onDismiss}>
      <ModalHeader>
        <ModalTitle>Update Brand</ModalTitle>
      </ModalHeader>
      {getBrandQuery.isLoading ? (
        <UpsertBrandFormSkeleton />
      ) : (
        <UpsertBrandForm
          initialValues={getBrandQuery.data}
          loading={updateBrandMutation.isPending}
          errors={updateBrandMutation.error?.errors}
          onCancel={onDismiss}
          onSubmit={handleSubmit}
        />
      )}
    </Modal>
  )
}

type UpsertBrandProps = {
  initialValues?: UpsertBrandDto
  loading: boolean
  errors?: Record<string, string[]>
  onCancel?: () => void
  onSubmit: (payload: UpsertBrandDto) => void
}

function UpsertBrandForm({
  initialValues,
  loading,
  errors = {},
  onCancel,
  onSubmit,
}: UpsertBrandProps) {
  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string

    const payload: UpsertBrandDto = {
      name,
    }

    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4 flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Brand name"
          autoFocus
          required
          disabled={loading}
          defaultValue={initialValues?.name}
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
          <Button
            type="button"
            variant="secondary"
            disabled={loading}
            icon={<FiSlash />}
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" loading={loading} icon={<FiPlus />}>
          Submit
        </Button>
      </div>
    </form>
  )
}

function UpsertBrandFormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Skeleton className="h-4 w-[50px]" />
        <Skeleton className="h-7 w-full" />
      </div>
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
        <Skeleton className="h-8 w-[100px]" />
        <Skeleton className="h-8 w-[100px]" />
      </div>
    </div>
  )
}
