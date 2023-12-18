import { FormEvent, FormEventHandler, useState } from "react"
import {
  DataTable,
  DeleteContextActions,
  SelectedRowsChangeEventPayload,
} from "@/components/data-table"
import { TableColumn } from "react-data-table-component"
import { BrandSummary } from "./types"
import { PaginatedList, apiClient, getPaginationMetadata } from "@/lib/api-client"
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query"
import { queryClient } from "@/lib/query-client"
import { ConfirmationModal } from "@/modals/confirm-modal"
import { PromiseModalProps, renderUncontrolledAsyncModal } from "@/modals/uncontrolled-async-modal"
import { Button } from "@/components/ui/button"
import { Modal, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from "@/modals/modal"
import { Label } from "@radix-ui/react-label"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"

async function getBrandSummaryListing(page: number, pageSize: number) {
  const res = await apiClient.get<BrandSummary[]>(`/brands?PageNumber=${page}&PageSize=${pageSize}`)

  return {
    result: res.data,
    paginationMetadata: getPaginationMetadata(res),
  } as PaginatedList<BrandSummary>
}

async function deleteBrands(ids: number[]) {
  await apiClient.post("/brands/delete", {
    ids,
  })
}

async function createBrand(name: string) {
  const res = await apiClient.post<BrandSummary>("brands", {
    name,
  })

  return res.data
}

const summaryColumns: TableColumn<BrandSummary>[] = [
  {
    name: "Name",
    sortable: true,
    selector: (row) => row.name,
  },
  {
    name: "Created",
    sortable: true,
    selector: (row) => new Date(row.createdAt).toLocaleString(),
  },
  {
    name: "Modified",
    sortable: true,
    selector: (row) => (row.modifiedAt ? new Date(row.modifiedAt).toLocaleString() : "-"),
  },
  {
    name: "Food Count",
    sortable: true,
    selector: (row) => row.foodCount,
  },
]

/**
 * TODO: left off here
 * - add a create button which opens a modal w/ a create form. closes & updates the table on success
 * - add an edit button to each row which opens a modal w/ an edit form. closes & update the table on success
 * - error handling
 *   - automatically show a toast if the api errors
 *   - should errors rethrow so events still bubble to the nearest error boundary?
 *   - or maybe certain errors should bubble while some should just show the toast?
 * - go through and make sure buttons and things are properly disabled during submits/loads (create-brand definitely isn't)
 * - refactor the useQuery usage here into a reusable paginated hook
 * - maybe make a response model? i don't like that deleteBrands doesn't really return anything
 * * if you do the above, you have a working reusable crud feature so good job
 * - maybe look into infering one or both of the reactModal generics
 */

export function BrandSummaryListing() {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const [selected, setSelected] = useState<BrandSummary[]>([])
  const [clearSelectedToggled, setClearSelectedToggled] = useState(false)

  const brandSummaryListingQuery = useQuery({
    queryKey: ["brand-summary-list", page, perPage],
    queryFn: () => getBrandSummaryListing(page, perPage),
    placeholderData: keepPreviousData,
  })

  const deleteBrandsMutation = useMutation({
    mutationFn: () => deleteBrands(selected.map((b) => b.id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brand-summary-list"] })
      setClearSelectedToggled(!clearSelectedToggled)
    },
  })

  const handlePageChange = (page: number) => {
    setPage(page)
  }

  const handlePerPageChange = (perPage: number, currentPage: number) => {
    setPage(currentPage)
    setPerPage(perPage)
  }

  const handleSelectedRowsChange = ({
    selectedRows,
  }: SelectedRowsChangeEventPayload<BrandSummary>) => {
    setSelected(selectedRows)
  }

  const handleDeleteClick = async () => {
    renderUncontrolledAsyncModal<void, ConfirmBrandsDeletionModalProps>(
      ConfirmBrandsDeletionModal,
      {
        count: selected.length,
      }
    ).then(() => deleteBrandsMutation.mutate())
  }

  const brandSummaries = brandSummaryListingQuery.data?.result ?? []
  const brandsCount = brandSummaryListingQuery.data?.paginationMetadata?.totalCount

  return (
    <div>
      <DataTable
        title={<HeaderRow />}
        columns={summaryColumns}
        data={brandSummaries}
        clearSelectedRows={clearSelectedToggled}
        contextActions={
          <DeleteContextActions selectedItemCount={selected.length} onClick={handleDeleteClick} />
        }
        highlightOnHover
        pagination
        paginationServer
        paginationTotalRows={brandsCount}
        progressPending={brandSummaryListingQuery.isPending}
        selectableRows
        onChangeRowsPerPage={handlePerPageChange}
        onChangePage={handlePageChange}
        onSelectedRowsChange={handleSelectedRowsChange}
      />
    </div>
  )
}

function HeaderRow() {
  return (
    <div className="flex justify-between items-center">
      <div>Brands</div>
      <Button size="sm" variant="secondary" asChild>
        <Link to="/brands/create">Create Brand</Link>
      </Button>
    </div>
  )
}

type ConfirmBrandsDeletionModalProps = {
  count: number
} & PromiseModalProps<void>

function ConfirmBrandsDeletionModal({
  isOpen,
  onResolve,
  onReject,
  count,
}: ConfirmBrandsDeletionModalProps) {
  const plural = count > 1
  const title = `Delete ${count} brand${plural ? "s" : ""}`

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onDismiss={onReject}
      onConfirm={onResolve}
      title={title}
      description="Are you sure? This action cannot be undone."
    />
  )
}

function CreateBrandModal({ isOpen, onResolve, onReject }: PromiseModalProps<BrandSummary>) {
  const createBrandMutation = useMutation({
    mutationFn: (name: string) => createBrand(name),
    onSuccess: (brandSummary) => {
      onResolve(brandSummary)
    },
  })

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name")

    createBrandMutation.mutate(name as string)
  }

  return (
    <Modal isOpen={isOpen} onDismiss={onReject}>
      <ModalHeader>
        <ModalTitle>Create Brand</ModalTitle>
        <ModalDescription>Lorem ipsum something or another.</ModalDescription>
      </ModalHeader>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" name="name" placeholder="Brand Name" className="col-span-3" />
          </div>
        </div>
        <ModalFooter>
          <Button type="button" variant="secondary" onClick={onReject}>
            Cancel
          </Button>
          <Button type="submit" onClick={console.log}>
            Submit
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
