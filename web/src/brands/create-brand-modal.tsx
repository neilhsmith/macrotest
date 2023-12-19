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

async function createBrand(name: string) {
  const res = await toast.promise(
    apiClient.post<BrandSummary>("brands", {
      name,
    }),
    {
      pending: "Creating Brand",
      success: "Brand created",
      error: "Something went wrong",
    }
  )

  return res.data
}

type CreateBrandModal = Pick<ModalProps, "isOpen">

export const CreateBrandModal = ({ isOpen }: CreateBrandModal) => {
  const navigate = useNavigate()

  const createBrandMutation = useMutation({
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

  return (
    <Modal isOpen={isOpen} onDismiss={dismiss}>
      <ModalHeader>
        <ModalTitle>Create Brand</ModalTitle>
        <ModalDescription>Lorem ipsum and stuff</ModalDescription>
      </ModalHeader>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" name="name" placeholder="Brand name" className="col-span-3" />
          </div>
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
