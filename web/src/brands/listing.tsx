import { useState } from "react"
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
        title="Brands"
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
