import { useState } from "react"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Modal, ModalHeader, ModalProps, ModalTitle } from "@/modals/modal"
import { FaPlus } from "react-icons/fa6"
import { FiSlash } from "react-icons/fi"
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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormActions,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

type UpsertBrandFields = z.infer<typeof upsertBrandSchema>
const upsertBrandSchema = z.object({
  name: z.string().min(1).max(128),
})

export function CreateBrandTrigger() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button size="sm" variant="secondary" icon={<FaPlus />} onClick={() => setIsOpen(true)}>
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
        isPending={createBrandMutation.isPending}
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
      <UpsertBrandForm
        defaultValues={getBrandQuery.data}
        isLoading={getBrandQuery.isLoading}
        isPending={updateBrandMutation.isPending}
        errors={updateBrandMutation.error?.errors}
        onCancel={onDismiss}
        onSubmit={handleSubmit}
      />
    </Modal>
  )
}

// ---

type UpsertBrandFormProps = {
  defaultValues?: UpsertBrandFields
  errors?: Record<string, string[]>
  isLoading?: boolean
  isPending: boolean
  onCancel?: () => void
  onSubmit: (formValues: UpsertBrandDto) => void
}

function UpsertBrandForm({
  defaultValues,
  errors,
  isLoading,
  isPending,
  onCancel,
  onSubmit,
}: UpsertBrandFormProps) {
  const form = useForm<UpsertBrandFields>({
    resolver: zodResolver(upsertBrandSchema),
    defaultValues,
    errors,
  })

  if (isLoading) {
    return <UpsertBrandFormSkeleton />
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Brand name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormActions>
          {!!onCancel && (
            <Button
              type="button"
              variant="secondary"
              disabled={isPending}
              icon={<FiSlash />}
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" loading={isPending} icon={<FaPlus />}>
            Submit
          </Button>
        </FormActions>
      </form>
    </Form>
  )
}

function UpsertBrandFormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-4 w-[50px]" />
        <Skeleton className="h-7 w-full" />
      </div>
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
        <Skeleton className="h-9 w-[100px]" />
        <Skeleton className="h-9 w-[100px]" />
      </div>
    </div>
  )
}
